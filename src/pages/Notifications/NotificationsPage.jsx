import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import { io } from "socket.io-client";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Badge from "@mui/material/Badge";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";
import { useSelector } from "react-redux";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [hasMore, setHasMore] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);
  const { userId, companyId } = useSelector((state) => state.authentication);
  const socketRef = useRef(null);
  const observer = useRef();
  const BASE_URL = String(import.meta.env.VITE_APP_BASE_URL || "").trim();
  const [userInteracted, setUserInteracted] = useState(false);
  const audioContextRef = useRef(null);
  const audioInitializedRef = useRef(false);

  // Fetch unseen notifications count
  const fetchUnseenCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/notifications/${companyId || userId}/unseen`);
      setUnseenCount(response.data.unseenCount);
    } catch (error) {
      console.error("Failed to fetch unseen count:", error);
    }
  }, [companyId, userId]);

  const initializeAudio = useCallback(async () => {
    if (audioInitializedRef.current) return true;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn("Web Audio API not supported");
        return false;
      }
  
      audioContextRef.current = new AudioContext();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      audioInitializedRef.current = true;
      setUserInteracted(true);
      return true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      return false;
    }
  }, []);
  
  const playBeep = useCallback(async () => {
    if (!audioInitializedRef.current) {
      const initialized = await initializeAudio();
      if (!initialized) return;
    }
  
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 1200;
      gainNode.gain.value = 0.5;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
      }, 300);
    } catch (error) {
      console.error("Beep playback failed:", error);
    }
  }, [initializeAudio]);

  useEffect(() => {
    const handleUserInteraction = async () => {
      await initializeAudio();
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
  
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [initializeAudio]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/notifications/${companyId || userId}`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          filter: filter === 'unread' ? 'unread' : undefined
        },
      });
      
      const sortedNotifications = [...response.data].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setNotifications(prev => 
        pagination.page === 1 
          ? sortedNotifications 
          : [...prev, ...sortedNotifications]
      );
      setHasMore(response.data.length === pagination.limit);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPagination((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${companyId || userId}/${notificationId}/read`);
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnseenCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleNotificationClick = (notification, elementClicked) => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }

    if (elementClicked === 'content') {
      if (notification.type === "React" || notification.type === "Comment") {
        navigate(`/post/${notification.rootItemId}?highlight=${notification.referenceId}`);
      } else if (notification.type === "Connection") {
        navigate(`/profile/${notification.referenceId}`);
      }
    } else {
      switch (notification.type) {
        case "React":
        case "Comment":
          navigate(`/post/${notification.rootItemId}`);
          break;
        case "Connection":
          navigate(`/profile/${notification.referenceId}`);
          break;
        default:
          if (notification.rootItemId) {
            navigate(`/post/${notification.rootItemId}`);
          } else if (notification.referenceId) {
            navigate(`/profile/${notification.referenceId}`);
          }
      }
    }
  };

  const formatNotificationContent = (notification) => {
    switch (notification.type) {
      case "React":
        return (
          <span>
            <span 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleNotificationClick(notification, 'content');
              }}
            >
              reacted
            </span>{' '}
            to your post
          </span>
        );
      case "Comment":
        return (
          <span>
            <span 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleNotificationClick(notification, 'content');
              }}
            >
              commented
            </span>{' '}
            on your post
          </span>
        );
      case "Connection":
        return `${notification.userName} sent you a connection request`;
      default:
        return notification.content;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io('wss://tawasolapp.me', {
      transports: ['websocket'],
      query: { userId },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to notifications socket");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socketRef.current.on("newNotification", (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnseenCount(prev => prev + 1);
      playBeep();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, BASE_URL, playBeep]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchNotifications();
    fetchUnseenCount();
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [pagination.page, pagination.limit]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(notification => !notification.isRead)
    : notifications;

  return (
    <div className="min-h-screen bg-mainBackground p-4 md:p-8 flex justify-center">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-6xl">
        <div className="bg-cardBackground p-4 md:p-6 rounded-lg shadow-md border border-cardBorder w-full sm:w-[360px] h-fit">
          <h2 className="text-xl font-bold mb-4 text-textHeavyTitle">
            Notifications
          </h2>

          <div className="space-y-1">
            <div
              onClick={() => navigate("/notifications")}
              className={`flex items-center p-3 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors ${
                filter !== 'unread' ? 'bg-cardBackgroundHover' : ''
              }`}
            >
              <CircleNotificationsIcon className="text-textActivity text-2xl mr-3" />
              <div className="flex items-center">
                <span className="text-textActivity font-medium">All Notifications</span>
                {unseenCount > 0 && (
                  <Badge 
                    badgeContent={unseenCount} 
                    color="error" 
                    overlap="circular"
                    max={99}
                    className="ml-5"
                  />
                )}
              </div>
            </div>

            <div
              onClick={() => navigate("/notifications?filter=unread")}
              className={`flex items-center p-3 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors ${
                filter === 'unread' ? 'bg-cardBackgroundHover' : ''
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-textActivity font-medium">Unread</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 md:space-y-6">
          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder overflow-hidden">
            <div className="p-4 md:p-6 border-b border-cardBorder">
              <h2 className="text-xl font-semibold text-textHeavyTitle">
                {filter === 'unread' ? 'Unread Notifications' : 'All Notifications'}
              </h2>
            </div>

            {loading && pagination.page === 1 ? (
              <div className="p-6 text-center text-textPlaceholder">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-error">{error}</div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-cardBorder">
                {filteredNotifications.map((notification, index) => {
                  const isLast = index === filteredNotifications.length - 1;
                  return (
                    <div
                      key={notification.notificationId}
                      className={`p-3 md:p-4 hover:bg-cardBackgroundHover cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification, 'box')}
                      ref={isLast ? lastElementRef : null}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={notification.profilePicture || defaultProfilePicture}
                          alt={notification.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-textHeavyTitle truncate">
                              {notification.userName}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-textContent break-words">
                            {formatNotificationContent(notification)}
                          </p>
                          <p className="text-xs text-textPlaceholder mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="p-4 text-center text-textPlaceholder">
                    Loading more notifications...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-textPlaceholder">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </div>
            )}
          </div>

          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-textHeavyTitle">
              Stay updated with notifications
            </h2>
            <p className="text-sm md:text-base text-textContent mb-2 md:mb-3">
              Turn on notifications to never miss important updates from your network.
            </p>
            <button className="px-3 py-1.5 md:px-4 md:py-2 bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-white font-medium rounded-lg transition-colors text-sm md:text-base">
              Notification Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
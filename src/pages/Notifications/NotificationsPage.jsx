import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import { io } from "socket.io-client";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";
import { useSelector } from "react-redux";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [hasMore, setHasMore] = useState(true);
  const { userId, companyId } = useSelector((state) => state.authentication);
  const socketRef = useRef(null);
  const observer = useRef();
  const BASE_URL = String(import.meta.env.VITE_APP_BASE_URL || "").trim();

  // Beep sound function
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || 
                          window.webkitAudioContext || 
                          window.mozAudioContext || 
                          window.msAudioContext;
  
      if (!AudioContext) {
        console.warn("Web Audio API not supported in this browser");
        return;
      }
  
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
        
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }, 200);
      
    } catch (error) {
      console.warn("Couldn't play beep sound:", error);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/notifications/${companyId || userId}`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      
      // Sort notifications by timestamp (newest first)
      const sortedNotifications = [...response.data].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setNotifications(prev => [...prev, ...sortedNotifications]);
      setHasMore(response.data.length === pagination.limit);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
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

  // Mark notification as read
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
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Handle click on notification
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

  // Format notification content with clickable parts
  const formatNotificationContent = (notification) => {
    switch (notification.type) {
      case "React":
        return (
          <span>
            {notification.userName}{' '}
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
            {notification.userName}{' '}
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

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Initialize Socket.io connection
  useEffect(() => {
    if (!userId) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(BASE_URL, {
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
      // Add new notification at the top of the list
      setNotifications(prev => [newNotification, ...prev]);
      playBeep();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, BASE_URL]);

  // Fetch notifications when pagination changes
  useEffect(() => {
    fetchNotifications();
  }, [pagination.page, pagination.limit]);

  return (
    <div className="min-h-screen bg-mainBackground p-8 flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <div className="bg-cardBackground p-6 rounded-lg shadow-md border border-cardBorder w-full sm:w-[360px] h-fit">
          <h2 className="text-xl font-bold mb-6 text-textHeavyTitle">
            Notifications
          </h2>

          <div className="space-y-2">
            <div
              onClick={() => navigate("/notifications")}
              className="flex items-center p-4 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors"
            >
              <CircleNotificationsIcon className="text-textActivity text-2xl mr-4" />
              <span className="text-textActivity font-medium">All Notifications</span>
            </div>

            <div
              onClick={() => navigate("/notifications?filter=unread")}
              className="flex items-center p-4 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 mr-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-textActivity font-medium">Unread</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder overflow-hidden">
            <div className="p-6 border-b border-cardBorder">
              <h2 className="text-xl font-semibold text-textHeavyTitle">
                Notifications
              </h2>
            </div>

            {loading && pagination.page === 1 ? (
              <div className="p-6 text-center text-textPlaceholder">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-error">{error}</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-cardBorder">
                {notifications.map((notification, index) => {
                  const isLast = index === notifications.length - 1;
                  return (
                    <div
                      key={notification.notificationId}
                      className={`p-6 hover:bg-cardBackgroundHover cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification, 'box')}
                      ref={isLast ? lastElementRef : null}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={notification.profilePicture || defaultProfilePicture}
                          alt={notification.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-textHeavyTitle">
                              {notification.userName}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-textContent">
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
                  <div className="p-6 text-center text-textPlaceholder">
                    Loading more notifications...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-textPlaceholder">
                No notifications yet
              </div>
            )}
          </div>

          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder p-6">
            <h2 className="text-xl font-bold mb-3 text-textHeavyTitle">
              Stay updated with notifications
            </h2>
            <p className="text-textContent mb-3">
              Turn on notifications to never miss important updates from your network.
            </p>
            <button className="px-4 py-2 bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-white font-medium rounded-lg transition-colors">
              Notification Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
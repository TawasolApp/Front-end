import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosInstance } from "../apis/axios";
import HomeIcon from "@mui/icons-material/Home";
import CottageIcon from "@mui/icons-material/Cottage";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ForumIcon from "@mui/icons-material/Forum";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import { getIconComponent } from "../utils";
import { useSocket } from "../hooks/SocketContext";

const TawasolNavbar = () => {
  const currentPath = window.location.pathname;
  const [isMeOpen, setIsMeOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [unseenCount, setUnseenCount] = useState(0);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchIconRef = useRef(null);
  const meDropdownRef = useRef(null);
  const navbarRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioInitializedRef = useRef(false);
  const navigate = useNavigate();

  const currentAuthorId = useSelector((state) => state.authentication.userId);
  const companyId = useSelector((state) => state.authentication.companyId);
  const currentAuthorName = `${useSelector((state) => state.authentication.firstName)} ${useSelector((state) => state.authentication.lastName)}`;
  const currentAuthorPicture = useSelector(
    (state) => state.authentication.profilePicture
  );
  const currentAuthorBio = useSelector((state) => state.authentication.bio);
  const socket = useSocket();

  // Initialize audio context and setup user interaction
  const initializeAudio = useCallback(async () => {
    if (audioInitializedRef.current) return true;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn("Web Audio API not supported");
        return false;
      }

      audioContextRef.current = new AudioContext();

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      audioInitializedRef.current = true;
      return true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      return false;
    }
  }, []);

  // Play beep sound when new notification arrives
  const playBeep = useCallback(async () => {
    if (!audioInitializedRef.current) {
      const initialized = await initializeAudio();
      if (!initialized) return;
    }

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.type = "sine";
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

  // Fetch initial unseen notifications count
  const fetchUnseenCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/notifications/${companyId || currentAuthorId}/unseen`
      );
      setUnseenCount(response.data.unseenCount);
    } catch (error) {
      console.error("Failed to fetch unseen count:", error);
    }
  }, [companyId, currentAuthorId]);

  // Setup user interaction for audio
  useEffect(() => {
    const handleUserInteraction = async () => {
      await initializeAudio();
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [initializeAudio]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket || !currentAuthorId) return;

    const handleConnect = () => {
      console.log("Connected to notifications socket");
      fetchUnseenCount();
    };

    const handleConnectError = (err) => {
      console.error("Socket connection error:", err);
    };

    const handleNewNotification = (newNotification) => {
      // Only increment if not on notifications page
      if (currentPath !== "/notifications") {
        setUnseenCount((prev) => prev + 1);
        playBeep();
      }
    };

    const handleNotificationsSeen = ({ count }) => {
      setUnseenCount(count);
    };

    const handleNotificationCountUpdate = ({ count }) => {
      setUnseenCount(count);
    };

    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      // Acknowledge message delivery with empty body
      socket.emit("messages_delivered", {});
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("newNotification", handleNewNotification);
    socket.on("notificationsSeen", handleNotificationsSeen);
    socket.on("notificationCountUpdate", handleNotificationCountUpdate);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("newNotification", handleNewNotification);
      socket.off("notificationsSeen", handleNotificationsSeen);
      socket.off("notificationCountUpdate", handleNotificationCountUpdate);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentAuthorId, fetchUnseenCount, playBeep, currentPath]);

  // Handle notification click
  const handleNotificationClick = () => {
    if (currentPath !== "/notifications") {
      setUnseenCount(0);
    }
    navigate("/notifications");
  };

  // Nav items with notification badge
  const navItems = [
    {
      name: "Home",
      path: "/feed",
      icon: currentPath === "/feed" ? <CottageIcon /> : <HomeIcon />,
      active: currentPath === "/feed",
    },
    {
      name: "My Network",
      path: "/network-box",
      icon:
        currentPath === "/network-box" ? (
          <GroupIcon sx={{ transform: "scaleX(-1)" }} />
        ) : (
          <GroupIcon />
        ),
      active: currentPath === "/network-box",
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: currentPath === "/jobs" ? <BusinessCenterIcon /> : <WorkIcon />,
      active: currentPath === "/jobs",
    },
    {
      name: "Messaging",
      path: "/messaging",
      icon: currentPath === "/messaging" ? <ForumIcon /> : <ChatBubbleIcon />,
      active: currentPath === "/messaging",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon:
        currentPath === "/notifications" ? (
          <NotificationsActiveIcon />
        ) : (
          <Badge
            badgeContent={unseenCount}
            color="error"
            max={99}
            overlap="circular"
          >
            <NotificationsIcon />
          </Badge>
        ),
      active: currentPath === "/notifications",
    },
  ];

  const Icon = getIconComponent("tawasol-icon");

  // Existing click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        searchIconRef.current &&
        !searchIconRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }

      if (
        meDropdownRef.current &&
        !meDropdownRef.current.contains(event.target)
      ) {
        setIsMeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Window resize handler
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Search handlers
  const toggleSearch = () => {
    setIsSearchFocused(true);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 bg-cardBackground border-b border-cardBorder shadow-sm h-[52px]"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full lg:justify-evenly">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0 h-10">
            <Icon
              className="w-10 h-10 cursor-pointer"
              onClick={() => navigate("/feed")}
            />
          </div>

          {!isMobile && (
            <div
              ref={searchContainerRef}
              className="relative transition-all duration-300 ease-in-out"
              style={{ width: isSearchFocused ? "24rem" : "17.5rem" }}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <SearchIcon
                  className="text-navbarIconsNormal"
                  fontSize="small"
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                ref={searchRef}
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className={`pl-10 pr-4 py-1 h-10 bg-navbarSearch rounded-md w-full text-sm text-text outline-none transition-all duration-300 ease-in-out ${
                  isSearchFocused ? "border border-navbarSearchBorder" : ""
                }`}
              />
              {isSearchFocused && searchText && (
                <button
                  onClick={handleSearchSubmit}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-navbarIconsNormal hover:text-navbarIconsSelected"
                >
                  <span className="text-xs font-medium">Search</span>
                </button>
              )}
            </div>
          )}
        </div>

        {isSearchFocused && isMobile && (
          <div className="absolute left-0 top-0 w-full h-[52px] flex items-center px-4 z-50 animate-fadeIn">
            <div ref={searchContainerRef} className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon
                  className="text-navbarIconsNormal"
                  fontSize="small"
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                ref={searchRef}
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                autoFocus
                onBlur={handleSearchBlur}
                className="pl-10 pr-4 py-1 h-10 bg-navbarSearch rounded-md w-full text-sm text-text outline-none border border-navbarSearchBorder transition-all duration-300 ease-in-out"
              />
              {searchText && (
                <button
                  onClick={handleSearchSubmit}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-navbarIconsNormal hover:text-navbarIconsSelected"
                >
                  <span className="text-xs font-medium">Search</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center">
          {isMobile && !isSearchFocused && (
            <button
              ref={searchIconRef}
              className="p-1 text-navbarIconsNormal mr-2"
              onClick={toggleSearch}
            >
              <SearchIcon fontSize="small" />
            </button>
          )}

          {(!isSearchFocused || !isMobile) && (
            <>
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`px-3 md:px-4 py-1 flex flex-col items-center justify-center h-[52px] relative
                    ${item.active ? "text-navbarIconsSelected" : "text-navbarIconsNormal"}
                    ${item.active ? "border-b-2 border-navbarIconsSelected" : ""}
                    hover:text-navbarIconsSelected`}
                  onClick={
                    item.name === "Notifications"
                      ? handleNotificationClick
                      : () => navigate(item.path)
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={`text-xs ${isMobile ? "hidden" : "block"}`}>
                    {item.name}
                  </span>
                </button>
              ))}

              <div
                ref={meDropdownRef}
                className="relative px-3 md:px-4 py-1 flex flex-col items-center justify-center h-[52px] text-navbarIconsNormal hover:text-navbarIconsSelected"
              >
                <button
                  className="flex flex-col items-center"
                  onClick={() => setIsMeOpen(!isMeOpen)}
                >
                  <Avatar
                    src={currentAuthorPicture}
                    sx={{ width: 24, height: 24 }}
                  />
                  <div
                    className={`flex items-center text-xs ${isMobile ? "hidden" : "block"}`}
                  >
                    <span>Me</span>
                    <ExpandMoreIcon fontSize="inherit" />
                  </div>
                </button>

                {isMeOpen && (
                  <div
                    className="absolute right-0 top-[52px] w-72 bg-cardBackground rounded-lg shadow-lg border border-cardBorder z-10 cursor-pointer animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-cardBorder">
                      <div
                        className="p-4 flex gap-3 items-center hover:bg-buttonIconHover"
                        onClick={() => {
                          setIsMeOpen(false);
                          navigate(`/users/${currentAuthorId}`);
                        }}
                      >
                        <Avatar
                          src={currentAuthorPicture}
                          sx={{ width: 56, height: 56 }}
                        />
                        <div>
                          <h3 className="font-semibold text-authorName">
                            {currentAuthorName}
                          </h3>
                          <p className="text-sm text-authorBio">
                            {currentAuthorBio && currentAuthorBio.length > 50
                              ? currentAuthorBio.slice(0, 48) + ".."
                              : currentAuthorBio}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-cardBorder">
                      <button
                        className="w-full py-2 px-4 text-left text-sm hover:bg-buttonIconHover transition-colors duration-150"
                        onClick={() => {
                          setIsMeOpen(false);
                          navigate("/settings");
                        }}
                      >
                        Settings & Privacy
                      </button>
                      <button
                        className="w-full py-2 px-4 text-left text-sm hover:bg-buttonIconHover transition-colors duration-150"
                        onClick={() => {
                          setIsMeOpen(false);
                          navigate("/auth/signin");
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TawasolNavbar;

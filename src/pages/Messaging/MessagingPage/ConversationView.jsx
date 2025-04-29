import { useEffect, useState, useRef, useLayoutEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewMessageModalInputs from "../New Message Modal/NewMessageModalInputs";
import ProfileCard from "../New Message Modal/ProfileCard";
import { axiosInstance } from "../../../apis/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const ConversationView = ({ conversation }) => {
  const currentUserId = useSelector((state) => state.authentication.userId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const initialLoadComplete = useRef(false);
  const [socket, setSocket] = useState(null);
  const userId = useSelector((state) => state.authentication.userId);

  // Setup socket connection
  useEffect(() => {
    const newSocket = io("wss://tawasolapp.me", {
      transports: ["websocket"],
      query: { userId },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message.senderId === conversation.participant._id) {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        }, 0);
      }
    };

    socket?.on("receive_message", handleReceiveMessage);
    return () => {
      socket?.off("receive_message", handleReceiveMessage);
    };
  }, [socket, conversation.participant._id]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation.id) {
      setMessages([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      });
      initialLoadComplete.current = false;
      fetchMessages(1, true);
    }
  }, [conversation.id]);

  // Scroll to bottom on initial load
  useLayoutEffect(() => {
    if (
      scrollContainerRef.current &&
      messages.length > 0 &&
      !initialLoadComplete.current
    ) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
      initialLoadComplete.current = true;
    }
  }, [messages]);

  const fetchMessages = async (pageNum = 1, reset = false) => {
    if (loading) return;
    setLoading(true);

    const scrollContainer = scrollContainerRef.current;
    const previousScrollHeight = scrollContainer?.scrollHeight || 0;

    try {
      const response = await axiosInstance.get(
        `/messages/conversations/${conversation.id}`,
        {
          params: { page: pageNum, limit: 20 },
        }
      );

      const newMessages = response.data.data;
      const paginationData = response.data.pagination;

      setPagination({
        currentPage: Number(paginationData.currentPage),
        totalPages: Number(paginationData.totalPages),
        totalItems: Number(paginationData.totalItems),
        itemsPerPage: Number(paginationData.itemsPerPage),
      });

      setMessages((prev) => {
        const updatedMessages = reset
          ? newMessages.reverse()
          : [...newMessages.reverse(), ...prev];
        return updatedMessages;
      });

      if (!reset && scrollContainer) {
        // Delay the scrollTop update until after DOM updates
        setTimeout(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - previousScrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      toast.error("Failed to load conversation", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (
      container &&
      container.scrollTop < 100 &&
      pagination.currentPage < pagination.totalPages &&
      !loading
    ) {
      fetchMessages(pagination.currentPage + 1);
    }
  };

  const handleSendMessage = (messageData) => {
    if (!socket || !socket.connected) {
      toast.error("Not connected to server", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(), // Temporary local ID
        text: messageData.text,
        media: messageData.media || [],
        senderId: currentUserId,
        sentAt: new Date().toISOString(),
      },
    ]);

    const messagePayload = {
      receiverId: conversation.participant._id,
      text: messageData.text,
      media: messageData.media || [],
    };

    socket.emit("send_message", messagePayload, (ack) => {
      if (!ack?.success) {
        toast.error("Failed to send message", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col bg-mainBackground h-full max-h-[85vh] rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-cardBorder bg-cardBackground">
        <div>
          <div
            className="text-text font-semibold text-base cursor-pointer"
            onClick={() => {
              navigate(`/users/${conversation.participant._id}`);
            }}
          >
            {conversation.participant.firstName +
              " " +
              conversation.participant.lastName}
          </div>
          <div className="text-sm text-green-600">● Online</div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
            title="More options"
          >
            <MoreHorizIcon className="text-icon" fontSize="medium" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-cardBackground px-4 py-2"
      >
        <ProfileCard
          recipient={{
            _id: conversation.participant._id,
            firstName: conversation.participant.firstName,
            lastName: conversation.participant.lastName,
            headline: conversation.participant.headline,
            profilePicture: conversation.participant.profilePicture,
          }}
        />

        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-textContent">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-textContent">No messages yet</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`max-w-xs px-3 py-2 rounded-lg text-sm mb-2 ${
                  msg.senderId === currentUserId
                    ? "bg-chatYouBackground text-chatYouText self-end ml-auto"
                    : "bg-chatThemBackground text-chatThemText self-start"
                }`}
              >
                <div>{msg.text}</div>
                {msg.media?.length > 0 && (
                  <div className="mt-2">
                    {msg.media.map((mediaUrl) => (
                      <img
                        key={mediaUrl}
                        src={mediaUrl}
                        alt="Message media"
                        className="max-w-full h-auto rounded"
                      />
                    ))}
                  </div>
                )}
                <div className="text-xs text-right mt-1 text-textContent">
                  {formatTime(msg.sentAt)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input */}
      <NewMessageModalInputs isMinimized={true} onSend={handleSendMessage} />
    </div>
  );
};

export default ConversationView;

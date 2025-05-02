import { useEffect, useState, useRef, useLayoutEffect } from "react";
import BlockIcon from "@mui/icons-material/Block";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NewMessageModalInputs from "../New Message Modal/NewMessageModalInputs";
import ProfileCard from "../New Message Modal/ProfileCard";
import { axiosInstance } from "../../../apis/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AccessTime, Done, DoneAll } from "@mui/icons-material";
import { useSocket } from "../../../hooks/SocketContext";

const ConversationView = ({ conversation }) => {
  const currentUserId = useSelector((state) => state.authentication.userId);
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const initialLoadComplete = useRef(false);
  const messagesRef = useRef([]);

  const markConversationAsRead = () => {
    if (!socket || !conversation.id) return;
    socket.emit("messages_read", { conversationId: conversation.id });
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.senderId === conversation.participant._id) {
        message.status = "Sending";
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        }, 0);

        markConversationAsRead();
        setTimeout(() => {
          refreshRecentMessages();
        }, 300);

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          requestAnimationFrame(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          });
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, conversation.participant._id, conversation.id]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }) => {
      console.log(senderId, conversation.participant._id);
      if (senderId === conversation.participant._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("typing", handleTyping);
    return () => {
      socket.off("typing", handleTyping);
    };
  }, [socket, currentUserId, conversation.participant._id]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleErrorMessage = (error) => {
      console.log("received something from error_message");
      const currentMessages = messagesRef.current;

      const hasSending = currentMessages.some(
        (msg) => msg.status === "Sending"
      );
      if (!hasSending) {
        console.log("no pending messages");
        return;
      }
      if (error.type === "LIMIT_REACHED") {
        setMessages((prev) => prev.slice(0, prev.length - 1));
        toast.error(
          "Your daily message limit has been reached. Upgrade to Premium for unlimited messaging.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        console.error("Unexpected error message from error_message");
      }

      setTimeout(() => {
        refreshRecentMessages();
      }, 50);
      refreshRecentMessages();
    };

    socket.on("error_message", handleErrorMessage);

    return () => {
      socket.off("error_message", handleErrorMessage);
    };
  }, [socket]);

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

  // useLayoutEffect(() => {
  //   if (
  //     scrollContainerRef.current &&
  //     messages.length > 0 &&
  //     !initialLoadComplete.current
  //   ) {
  //     scrollContainerRef.current.scrollTop =
  //       scrollContainerRef.current.scrollHeight;
  //     initialLoadComplete.current = true;
  //   }
  // }, [messages]);

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
        setTimeout(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - previousScrollHeight;
        }, 50);
      }

      const lastMsg = newMessages[0];
      if (reset && lastMsg?.senderId !== currentUserId) {
        markConversationAsRead();
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

  const refreshRecentMessages = async () => {
    if (!conversation.id || loading) return;

    try {
      const response = await axiosInstance.get(
        `/messages/conversations/${conversation.id}`,
        {
          params: { page: 1, limit: 10 },
        }
      );

      const latestMessages = response.data.data.reverse();

      setMessages((prev) => {
        const latestIds = new Set(latestMessages.map((msg) => msg._id));
        // Remove any old versions of these messages
        const filteredOldMessages = prev.filter(
          (msg) => !latestIds.has(msg._id) && msg.status !== "Sending"
        );
        return [...filteredOldMessages, ...latestMessages];
      });
    } catch (err) {
      console.error("Failed to refresh recent messages", err);
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
        _id: Date.now().toString(),
        text: messageData.text,
        media: messageData.media || [],
        senderId: currentUserId,
        sentAt: new Date().toISOString(),
        status: "Sending",
      },
    ]);

    const messagePayload = {
      receiverId: conversation.participant._id,
      text: messageData.text,
      media: messageData.media || [],
    };

    setTimeout(() => {
      refreshRecentMessages();
    }, 300);

    socket.emit("send_message", messagePayload, (ack) => {
      if (!ack?.success) {
        toast.error("Failed to send message", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleBlock = async () => {
    try {
      await axiosInstance.put("/messages/block", {
        participantId: conversation.participant._id,
      });
      toast.success("User has been blocked", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to block user:", error);
      toast.error("Failed to block user", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
        </div>
        <div className="flex gap-2 items-center">
          <Tooltip title="Block User" placement="bottom-start" arrow>
            <IconButton
              size="small"
              className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
              onClick={handleBlock}
            >
              <BlockIcon
                fontSize="small"
                className="text-textActivity hover:text-red-600"
              />
            </IconButton>
          </Tooltip>
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
                <div className="flex justify-end items-center gap-2 mt-1 text-xs text-textContent">
                  <span>{formatTime(msg.sentAt)}</span>
                  {msg.status && msg.senderId === currentUserId && (
                    <span
                      title={
                        msg.status.charAt(0).toUpperCase() + msg.status.slice(1)
                      }
                    >
                      {msg.status === "Read" ? (
                        <DoneAll
                          className="text-buttonSubmitEnable"
                          fontSize="small"
                        />
                      ) : msg.status === "Delivered" ? (
                        <DoneAll
                          className="text-textPlaceholder"
                          fontSize="small"
                        />
                      ) : msg.status === "Sent" ? (
                        <Done
                          className="text-textPlaceholder"
                          fontSize="small"
                        />
                      ) : (
                        <AccessTime
                          className="text-textPlaceholder"
                          fontSize="small"
                        />
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 pb-1 text-sm text-text animate-pulse bg-cardBackground">
          <span
            className="inline-block w-2 h-2 bg-text rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="inline-block w-2 h-2 bg-text rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="inline-block w-2 h-2 bg-text rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      )}

      {/* Input */}
      <NewMessageModalInputs
        isMinimized={true}
        onSend={handleSendMessage}
        receiverId={conversation.participant._id}
      />
    </div>
  );
};

export default ConversationView;

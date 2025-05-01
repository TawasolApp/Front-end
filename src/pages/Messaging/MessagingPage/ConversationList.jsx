import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../apis/axios";
import { useSocket } from "../../../hooks/SocketContext";

const ConversationList = ({ activeFilter, onConversationSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedForAction, setSelectedForAction] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const userId = useSelector((state) => state.authentication.userId);
  const socket = useSocket();

  const fetchConversations = async (load = true, page = 1, limit = 10) => {
    try {
      setLoading(load);
      const response = await axiosInstance.get("/messages/conversations", {
        params: { page, limit },
      });

      const formattedConversations = response.data.data.map((convo) => ({
        id: convo._id,
        participant: convo.otherParticipant,
        lastMessage: convo.lastMessage?.text || "No messages yet",
        time: formatTime(convo.lastMessage?.sentAt),
        unreadCount: convo.unseenCount,
        isYou: convo.lastMessage?.senderId === userId,
        isOnline: false, // TODO: implement presence
        markedAsUnread: convo.markedAsUnread,
      }));

      setConversations((prev) =>
        page === 1
          ? formattedConversations
          : [...prev, ...formattedConversations]
      );
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Couldn't fetch conversations.");
      toast.error("Couldn't fetch conversations.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message) => {
      fetchConversations(false);
    };

    socket.on("receive_message", handleIncomingMessage);

    return () => {
      socket.off("receive_message", handleIncomingMessage);
    };
  }, [socket]);

  useEffect(() => {
    filterConversations();
  }, [conversations, activeFilter]);

  const loadMoreConversations = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchConversations(pagination.currentPage + 1, pagination.itemsPerPage);
    }
  };

  const filterConversations = () => {
    setFilteredConversations(
      conversations.filter((convo) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Unread")
          return convo.unreadCount > 0 && !convo.isYou;
        return true;
      })
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const date = new Date(dateString);
    const isToday = now.toDateString() === date.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      date.toDateString();

    if (isToday) {
      // Show time for today's messages
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      // Show "Yesterday" for yesterday's messages
      return "Yesterday";
    } else {
      // Show date for older messages
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
      // Alternative formats you could use:
      // return date.toLocaleDateString(); // "MM/DD/YYYY"
      // return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }); // "MMM DD, YYYY"
    }
  };

  // Selection mode is ON if at least one convo is selected
  const isSelectionMode = selectedForAction.length > 0;

  const toggleSelect = (id) => {
    setSelectedForAction((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedForAction([]);
    setHoveredId(null);
  };

  const markAsRead = async () => {
    // Optimistic update
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        selectedForAction.includes(convo.id)
          ? { ...convo, markedAsUnread: false }
          : convo
      )
    );

    clearSelection();

    try {
      await Promise.all(
        selectedForAction.map((id) => {
          if (socket) {
            socket.emit("messages_read", { conversationId: id });
          }

          return axiosInstance.patch(
            `/messages/conversations/${id}/mark-as-read`
          );
        })
      );
      fetchConversations(false);
    } catch (error) {
      console.error("Error marking as read", error);
      toast.error("Failed to mark as read", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const markAsUnread = async () => {
    // Optimistic update
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        selectedForAction.includes(convo.id)
          ? { ...convo, markedAsUnread: true }
          : convo
      )
    );

    clearSelection();

    try {
      await Promise.all(
        selectedForAction.map((id) =>
          axiosInstance.patch(`/messages/conversations/${id}/mark-as-unread`)
        )
      );
      clearSelection();
      fetchConversations(false);
    } catch (error) {
      console.error("Error marking as unread", error);
      toast.error("Failed to mark as unread", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const allSelectedAreRead = selectedForAction.every((id) => {
    const convo = conversations.find((c) => c.id === id);
    return (
      convo && !convo.markedAsUnread && (!convo.unreadCount || convo.isYou)
    );
  });

  return (
    <div>
      {/* Selection Bar */}
      {isSelectionMode && (
        <div className="sticky top-0 z-20 flex items-center justify-between bg-background px-4 py-2 border-b border-cardBorder shadow-sm">
          {/* Left side: count and clear */}
          <div className="flex items-center space-x-4">
            <button
              className="text-textActivity hover:text-text transition-colors"
              onClick={clearSelection}
            >
              ✕
            </button>
            <span className="text-sm text-text font-medium">
              {selectedForAction.length} selected
            </span>
          </div>

          {/* Right side: actions */}
          <div className="flex items-center space-x-4">
            {/* Mark as read/unread */}
            <Tooltip
              title={allSelectedAreRead ? "Mark as unread" : "Mark as read"}
              placement="bottom-start"
              arrow
            >
              <IconButton
                size="small"
                className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
                onClick={allSelectedAreRead ? markAsUnread : markAsRead}
              >
                {allSelectedAreRead ? (
                  <MarkEmailUnreadOutlinedIcon
                    fontSize="small"
                    className="text-textActivity hover:text-textContent"
                  />
                ) : (
                  <MarkEmailReadOutlinedIcon
                    fontSize="small"
                    className="text-textActivity hover:text-textContent"
                  />
                )}
              </IconButton>
            </Tooltip>

            {/* Delete */}
            <Tooltip title="Delete" placement="bottom-start" arrow>
              <IconButton
                size="small"
                className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
              >
                <DeleteOutlineOutlinedIcon
                  fontSize="small"
                  className="text-textActivity hover:text-red-600"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Conversation List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-textContent">Loading conversations...</p>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <div className="w-16 h-16 bg-mainBackground rounded-full flex items-center justify-center mb-4">
            <MarkEmailReadOutlinedIcon className="text-textPlaceholder" />
          </div>
          <h3 className="text-lg font-medium text-textContent mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-textActivity max-w-md">
            Start a new conversation by searching for users or wait for someone
            to message you.
          </p>
        </div>
      ) : (
        filteredConversations.map((convo, index) => {
          const isSelected = selectedConversation === convo.id;
          const isHovered = hoveredId === convo.id;
          const isChecked = selectedForAction.includes(convo.id);
          const recipient = convo.participant;

          return (
            <div key={convo.id}>
              <div
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelect(convo.id);
                  } else {
                    setSelectedConversation(convo.id);
                    onConversationSelect(convo);
                  }
                }}
                className={`flex items-start p-3 cursor-pointer hover:bg-cardBackgroundHover transition-colors ${
                  isSelected
                    ? "border-l-4 border-green-500 !bg-chatYouBackground"
                    : "border-l-4 border-transparent"
                }`}
              >
                {/* Avatar + Status or Checkbox */}
                <div
                  className="mr-3 relative flex-shrink-0 w-14 h-14"
                  onMouseEnter={() => setHoveredId(convo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {isSelectionMode || isHovered ? (
                    <button
                      className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1e1e1e]"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(convo.id);
                      }}
                    >
                      {isChecked ? (
                        <CheckCircleOutlineIcon
                          className="text-green-500"
                          fontSize="medium"
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          className="text-gray-400"
                          fontSize="medium"
                        />
                      )}
                    </button>
                  ) : (
                    <>
                      <Avatar
                        src={recipient.profilePicture || "/placeholder.svg"}
                        alt={`${recipient.firstName} ${recipient.lastName}`}
                        sx={{ width: 56, height: 56 }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          recipient.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </>
                  )}
                </div>

                {/* Conversation content */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    {/* Left side: name + message */}
                    <div className="py-1">
                      <h3 className="font-medium text-textContent">
                        {recipient.firstName} {recipient.lastName}
                      </h3>
                      <p
                        className={`text-sm ${
                          convo.unreadCount
                            ? "font-semibold text-textContent"
                            : "text-textContent"
                        }`}
                      >
                        {convo.isYou ? "You: " : ""}
                        {convo.lastMessage}
                      </p>
                    </div>

                    {/* Right side: time + unread badge */}
                    <div className="flex flex-col items-end space-y-1">
                      {/* Time */}
                      <span className="text-xs text-textActivity">
                        {convo.time}
                      </span>

                      {/* Unread badge */}
                      {convo.markedAsUnread ? (
                        <span className="flex items-center justify-center min-w-[20px] h-[20px] text-[11px] font-bold bg-blue-500 text-white rounded-full px-1"></span>
                      ) : (
                        convo.unreadCount > 0 &&
                        !convo.isYou && (
                          <span className="flex items-center justify-center min-w-[20px] h-[20px] text-[11px] font-bold bg-blue-500 text-white rounded-full px-1">
                            {convo.unreadCount}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom bottom border */}
              {index < conversations.length && (
                <div className="border-t border-cardBorder" />
              )}
            </div>
          );
        })
      )}
      {/* Load More Button */}
      {!loading && pagination.currentPage < pagination.totalPages && (
        <div className="flex justify-center p-4">
          <button
            onClick={loadMoreConversations}
            className="px-4 py-2 text-sm text-textContent bg-cardBackgroundHover rounded-lg hover:bg-cardBackgroundHover"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationList;

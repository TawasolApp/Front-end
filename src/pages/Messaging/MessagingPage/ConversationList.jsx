import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

const ConversationList = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      firstName: "Mohamed",
      lastName: "Sobh",
      lastMessage: "Message 1",
      time: "1:31 PM",
      unreadCount: 2,
      isYou: true,
      profilePicture: "/placeholder.svg",
      isOnline: true,
    },
    {
      id: 2,
      firstName: "Mohamed",
      lastName: "Sobh",
      lastMessage: "Message 2",
      time: "12:45 PM",
      unreadCount: 0,
      isYou: false,
      profilePicture: "/placeholder.svg",
      isOnline: false,
    },
    {
      id: 3,
      firstName: "Khalid",
      lastName: "Ali",
      lastMessage: "Message 3",
      time: "Yesterday",
      unreadCount: 5,
      isYou: false,
      profilePicture: "/placeholder.svg",
      isOnline: true,
    },
    {
      id: 4,
      firstName: "Khalid",
      lastName: "Ali",
      lastMessage: "Message 3",
      time: "Yesterday",
      unreadCount: 0,
      isYou: false,
      profilePicture: "/placeholder.svg",
      isOnline: true,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedForAction, setSelectedForAction] = useState([]);

  // Selection mode is ON if at least one convo is selected
  const isSelectionMode = selectedForAction.length > 0;

  const toggleSelect = (id) => {
    setSelectedForAction((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedForAction([]);

  const allSelectedAreRead = selectedForAction.every((id) => {
    const convo = conversations.find((c) => c.id === id);
    return convo && !convo.unreadCount;
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
              >
                {allSelectedAreRead ? (
                  <MarkEmailUnreadOutlinedIcon fontSize="small" className="text-textActivity hover:text-textContent" />
                ) : (
                  <MarkEmailReadOutlinedIcon fontSize="small" className="text-textActivity hover:text-textContent" />
                )}
              </IconButton>
            </Tooltip>

            {/* Delete */}
            <Tooltip title="Delete" placement="bottom-start" arrow>
              <IconButton
                size="small"
                className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" className="text-textActivity hover:text-red-600" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Conversation List */}
      {conversations.map((convo, index) => {
        const isSelected = selectedConversation === convo.id;
        const isHovered = hoveredId === convo.id;
        const isChecked = selectedForAction.includes(convo.id);
        const recipient = convo;

        return (
          <div key={convo.id}>
            <div
              onClick={() => {
                if (isSelectionMode) {
                  toggleSelect(convo.id);
                } else {
                  setSelectedConversation(convo.id);
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
                    {convo.unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-[20px] text-[11px] font-bold bg-blue-500 text-white rounded-full px-1">
                        {convo.unreadCount}
                      </span>
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
      })}
    </div>
  );
};

export default ConversationList;

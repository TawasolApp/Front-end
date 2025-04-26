import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewMessageModalInputs from "../New Message Modal/NewMessageModalInputs";
import ProfileCard from "../New Message Modal/ProfileCard";

const dummyMessages = [
  { id: 1, sender: "you", content: "Hey there!", time: "1:30 PM" },
  { id: 2, sender: "them", content: "Hey! How’s it going?", time: "1:31 PM" },
  {
    id: 3,
    sender: "you",
    content: "All good, just working on something cool.",
    time: "1:32 PM",
  },
  {
    id: 4,
    sender: "them",
    content: "Nice! Can’t wait to hear more.",
    time: "1:33 PM",
  },
  { id: 5, sender: "them", content: "Another message", time: "1:34 PM" },
  { id: 6, sender: "you", content: "Sure thing!", time: "1:35 PM" },
  { id: 7, sender: "them", content: "Great!", time: "1:36 PM" },
  { id: 8, sender: "you", content: "Chat getting long now", time: "1:37 PM" },
  { id: 9, sender: "them", content: "Scrolling test", time: "1:38 PM" },
];

const ConversationView = () => {
  const [isStarred, setIsStarred] = useState(false);

  return (
    <div className="flex flex-col bg-mainBackground h-full max-h-[85vh] rounded-lg shadow-md overflow-hidden">
      {/* Fixed Header */}
      <div className="flex justify-between items-center p-4 border-b border-cardBorder bg-cardBackground">
        <div>
          <div className="text-text font-semibold text-base">Khalid Ali</div>
          <div className="text-sm text-green-600">● Online</div>
        </div>
        <div className="flex gap-2 items-center">
          {/* More Options Button */}
          <button
            className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
            title="More options"
          >
            <MoreHorizIcon className="text-icon" fontSize="medium" />
          </button>

          {/* Star Button */}
          <button
            onClick={() => setIsStarred(!isStarred)}
            className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
            title="Star conversation"
          >
            {isStarred ? (
              <StarIcon
                className="text-yellow-400 transition-colors"
                fontSize="medium"
              />
            ) : (
              <StarBorderIcon
                className="text-icon transition-colors"
                fontSize="medium"
              />
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Section: ProfileCard + Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <ProfileCard
          recipient={{
            _id: "userId",
            firstName: "Khalid",
            lastName: "Ali",
            headline: "This is my bio",
          }}
        />

        {/* Chat history */}
        <div className="px-4 py-2 space-y-3 bg-cardBackground border-t border-cardBorder">
          {dummyMessages.map((msg) => (
            <div
              key={msg.id + msg.time} // make key unique
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.sender === "you"
                  ? "bg-chatYouBackground text-chatYouText self-end ml-auto"
                  : "bg-chatThemBackground text-chatThemText self-start"
              }`}
            >
              <div>{msg.content}</div>
              <div className="text-xs text-right mt-1 text-textContent">
                {msg.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <NewMessageModalInputs isMinimized={true} />
    </div>
  );
};

export default ConversationView;

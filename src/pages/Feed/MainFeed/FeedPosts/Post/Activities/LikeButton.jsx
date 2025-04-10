import { useState } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import reactionIcons from "../../../../GenericComponents/reactionIcons";
import ReactionPicker from "../../../../GenericComponents/ReactionPicker";
import { usePost } from "../../PostContext";
import CircularProgress from "@mui/material/CircularProgress";
import "./LikeButton.css";

const LikeButton = () => {
  const { post, handleReactOnPost } = usePost();
  const initReactValue = post.reactType;

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  // State for the animation
  const [isReacted, setIsReacted] = useState(false);

  const handleReactionInternal = async (reactionType) => {
    setIsLoading(true);
    try {
      if (initReactValue === null) {
        handleReactOnPost && (await handleReactOnPost(reactionType, null));
      } else if (initReactValue === reactionType) {
        handleReactOnPost && (await handleReactOnPost(null, reactionType));
      } else {
        handleReactOnPost &&
          (await handleReactOnPost(reactionType, initReactValue));
      }
      // Trigger the pop-up animation
      setIsReacted(true);
      setTimeout(() => setIsReacted(false), 1000); // Reset the animation after 1 second
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const renderButtonContent = () => {
    if (isLoading) {
      return (
        <CircularProgress size={20} className="text-gray-600" /> // Loading spinner
      );
    }

    if (initReactValue) {
      const { Icon, color, label } = reactionIcons[initReactValue];
      return (
        <>
          <Icon
            style={{ color }}
            className={`w-4 h-4 group-hover:text-black ${isReacted ? "animate-pop" : ""}`}
          />
          <span
            style={{ color }}
            className="text-sm font-semibold text-gray-600 group-hover:text-black"
          >
            {label}
          </span>
        </>
      );
    }

    return (
      <>
        <ThumbUpOffAltIcon
          sx={{ fontSize: 16 }}
          className={`text-textActivity group-hover:text-textActivityHover ${isReacted ? "animate-pop" : ""}`}
        />
        <span className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover">
          Like
        </span>
      </>
    );
  };

  return (
    <ReactionPicker onSelectReaction={handleReactionInternal}>
      <button
        className="flex items-center gap-1 p-2 hover:bg-buttonIconHover hover:transition-all duration-200 w-full justify-center group"
        onClick={() => handleReactionInternal(initReactValue || "Like")}
        disabled={isLoading}
      >
        {renderButtonContent()}
      </button>
    </ReactionPicker>
  );
};

export default LikeButton;

import { useState } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import reactionIcons from "../../../../GenericComponents/reactionIcons";
import ReactionPicker from "../../../../GenericComponents/ReactionPicker";

const LikeButton = ({ initReactValue, handleReaction }) => {
  const handleReactionInternal = (reactionType) => {
    if (initReactValue === null) {
      handleReaction && handleReaction(reactionType, null);
    } else if (initReactValue === reactionType) {
      handleReaction && handleReaction(null, reactionType);
    } else {
      handleReaction && handleReaction(reactionType, initReactValue);
    }
  };

  const renderButtonContent = () => {
    if (initReactValue) {
      const { Icon, color, label } = reactionIcons[initReactValue];
      return (
        <>
          <Icon style={{ color }} className="w-4 h-4 group-hover:text-black" />
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
          className="text-textActivity group-hover:text-textActivityHover"
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
      >
        {renderButtonContent()}
      </button>
    </ReactionPicker>
  );
};

export default LikeButton;

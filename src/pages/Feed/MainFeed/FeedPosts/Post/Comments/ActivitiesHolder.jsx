import { useState, useMemo } from "react";
import reactionIcons from "../../../../GenericComponents/reactionIcons";
import ReactionPicker from "../../../../GenericComponents/ReactionPicker";

const ActivitiesHolder = ({
  currentReaction,
  reactions,
  handleReaction,
  setShowReactions,
  isReply = false,
  replies,
  setShowReplies,
}) => {
  // Memoized calculations
  const { topReactions, totalLikes } = useMemo(() => {
    const filtered = Object.entries(reactions)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    return {
      topReactions: filtered.slice(0, 3),
      totalLikes: filtered.reduce((acc, [_, count]) => acc + count, 0),
    };
  }, [reactions]);

  const handleReactionInternal = (reactionType) => {
    if (currentReaction === null) {
      handleReaction(reactionType, null);
    } else if (currentReaction === reactionType) {
      handleReaction(null, reactionType);
    } else {
      handleReaction(reactionType, currentReaction);
    }
  };

  // Reaction display component
  const ReactionDisplay = () => {
    if (!currentReaction)
      return (
        <span className="text-sm font-semibold text-textLightActivity">
          Like
        </span>
      );
    const { _, color, label } = reactionIcons[currentReaction];
    return (
      <div className="flex items-center">
        <span style={{ color }} className="text-sm font-semibold">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center text-textLightActivity">
      {/* Reactions Section */}
      <div className="flex items-center">
        <ReactionPicker onSelectReaction={handleReactionInternal}>
          <button
            className="flex px-1 items-center rounded-md hover:bg-buttonIconHover transition-all duration-200"
            onClick={() => handleReactionInternal(currentReaction || "Like")}
          >
            <ReactionDisplay />
          </button>
        </ReactionPicker>

        {totalLikes > 0 && (
          <div className="flex items-center">
            <div
              className="flex -space-x-2 cursor-pointer hover:transition-all group"
              onClick={setShowReactions}
            >
              {topReactions.map(([reactionType]) => {
                const { Icon, _ } = reactionIcons[reactionType];
                return (
                  <div key={reactionType} className="relative">
                    <Icon className="w-4 h-4" />
                  </div>
                );
              })}
              <span className="text-xs pl-2.5 group-hover:text-textPlaceholderHover group-hover:underline">
                {totalLikes}
              </span>
            </div>
          </div>
        )}
      </div>

      <span className="text-textLightActivity pl-1 text-xs font-semibold">
        |
      </span>
      <button
        className="text-sm font-semibold text-textLightActivity px-1 rounded-md hover:bg-buttonIconHover transition-all duration-200"
        onClick={setShowReplies}
      >
        Reply
      </button>

      {/* Reply Button */}
      {!isReply && replies > 0 && (
        <>
          <span className="text-textLightActivity pr-1 text-xs font-light">
            •
          </span>
          <span className="text-xs font-normal text-textLightActivity py-1 rounded-md">
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
        </>
      )}
    </div>
  );
};

export default ActivitiesHolder;

import React from "react";

const CommentThreadWrapper = ({
  children,
  hasReplies = false,
  isLastReply = false,
}) => {
  return (
    <div className="relative px-4 flex w-full">
      {/* Thread line that connects comments */}
      {hasReplies ? (
        <div className="mx-[15px] relative flex-shrink-0">
          {isLastReply ? (
            <div className="absolute top-0 left-0 h-1/2 flex items-end">
              <div className="h-full w-0.5 bg-mainBackground" />
              <div
                className="h-0.5 w-4 bg-mainBackground rounded-bl-lg"
                style={{ borderBottomLeftRadius: "4px" }}
              />
            </div>
          ) : (
            <div className="w-0.5 h-full bg-mainBackground" />
          )}
        </div>
      ) : (
        <div className="w-[15px] flex-shrink-0" />
      )}

      {/* Fixed: Full-width children container */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default CommentThreadWrapper;

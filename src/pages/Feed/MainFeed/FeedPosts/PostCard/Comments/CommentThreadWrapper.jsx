import React from 'react';

const CommentThreadWrapper = ({
    children,
    hasReplies = false,
    isLastReply = false
}) => {
    return (
        <div className="relative px-4 flex">
            {/* Thread line that connects comments */}
            {hasReplies ? (
                <div className="px-[15px] min-w-1" />
            ) : (
                <div className="pl-8" />
            )}
            
            {/* Comment content with proper margins */}
            <div className="relative full-w">
                {children}
            </div>
        </div>
    );
};

export default CommentThreadWrapper;
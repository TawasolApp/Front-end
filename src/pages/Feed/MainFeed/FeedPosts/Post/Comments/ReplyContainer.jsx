import { useState, useEffect } from "react";
import { usePost } from "../../PostContext";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CommentThreadWrapper from "./CommentThreadWrapper";
import AddForm from "./AddForm";
import Reply from "./Reply";

const ReplyContainer = ({ commentId }) => {
  const { replies, fetchReplies, handleAddReplyToComment } = usePost();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchReplies = async () => {
    setIsLoading(true);
    await fetchReplies(commentId);
    setIsLoading(false);
  }

  useEffect(() => {
    handleFetchReplies();
  }, [commentId]);

  const actualReplies = replies[commentId];
  const hasMoreReplies = actualReplies?.hasMore;

  return (
    <>
      {/* Fetch Replies */}
      {!isLoading && hasMoreReplies && (
        <CommentThreadWrapper hasReplies={true}>
          <div className="my-2 flex items-center">
            <button
              onClick={() => handleFetchReplies(commentId)}
              className="flex items-center p-1 rounded-xl hover:bg-buttonIconHover transition-colors"
            >
              <OpenInFullIcon className="text-icon" fontSize="small" />
              <span className="text-xs font-medium text-icon pl-1">
                Load more Replies
              </span>
            </button>
          </div>
        </CommentThreadWrapper>
      )}

      {isLoading && (
        <CommentThreadWrapper hasReplies={true}>
          <div className="pl-2 pt-2 space-y-4 animate-pulse">
            {[...Array(1)].map((_, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="w-1/4 h-2 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="w-5/6 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CommentThreadWrapper>
      )}

      {/* Replies */}
      {actualReplies &&
        actualReplies.data &&
        actualReplies.data.length > 0 &&
        actualReplies.data.map((singleReply, index) => (
          <CommentThreadWrapper key={singleReply.id} hasReplies={true}>
            <div className="pl-2">
              <Reply commentId={commentId} reply={singleReply} />
            </div>
          </CommentThreadWrapper>
        ))}

      {/* Add Reply */}
      <CommentThreadWrapper hasReplies={true} isLastReply={true}>
        <div className="pt-2 px-2">
          <AddForm
            handleAddFunction={(text, taggedUsers) =>
              handleAddReplyToComment(commentId, text, taggedUsers)
            }
            type="Reply"
          />
        </div>
      </CommentThreadWrapper>
    </>
  );
};

export default ReplyContainer;

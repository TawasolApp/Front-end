import { useEffect } from "react";
import { usePost } from "../../PostContext";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CommentThreadWrapper from "./CommentThreadWrapper";
import AddForm from "./AddForm";
import Reply from "./Reply";

const ReplyContainer = ({ commentId }) => {
  const { replies, fetchReplies, handleAddReplyToComment } = usePost();

  useEffect(() => {
    fetchReplies(commentId);
  }, [commentId]);

  const actualReplies = replies[commentId];
  const hasMoreReplies = actualReplies?.hasMore;

  return (
    <>
      {/* Fetch Replies */}
      {hasMoreReplies && (
        <CommentThreadWrapper hasReplies={true}>
          <div className="my-3 flex items-center">
            <button
              onClick={() => fetchReplies(commentId)}
              className="flex items-center px-1 py-1 space-x-1 rounded-xl hover:bg-buttonIconHover transition-colors"
            >
              <OpenInFullIcon className="text-icon" fontSize="small" />
              <span className="text-xs font-medium text-icon pl-1">
                Load more Replies
              </span>
            </button>
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

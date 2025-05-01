import { useState, useEffect } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { usePost } from "../../PostContext";
import AddForm from "./AddForm";
import Comment from "./Comment";

const CommentsContainer = () => {
  const { post, hasMoreComments, comments, fetchComments, handleAddComment } =
    usePost();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialComments = async () => {
      if (post.id) {
        setIsLoading(true);
        await fetchComments();
        setIsLoading(false);
      }
    };
    loadInitialComments();
  }, [post.id]);

  const handleFetchComments = async () => {
    setIsLoading(true);
    await fetchComments();
    setIsLoading(false);
  };

  return (
    <>
      <div className="px-4">
        <AddForm handleAddFunction={handleAddComment} type="Comment" />
      </div>

      {comments &&
        comments.length > 0 &&
        comments.map((comment, index) => (
          <div key={index} data-testid="CommentContainer" className="py-2">
            <Comment comment={comment} />
          </div>
        ))}

      {!isLoading && hasMoreComments && (
        <div className="ml-4 py-2 flex items-center">
          <button
            onClick={handleFetchComments}
            className="flex items-center px-1 py-1 space-x-1 rounded-xl hover:bg-buttonIconHover transition-colors"
          >
            <OpenInFullIcon className="text-icon" fontSize="small" />
            <span className="text-xs font-medium text-icon pl-1">
              Load more comments
            </span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="px-4 space-y-4 animate-pulse py-2">
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
      )}
    </>
  );
};

export default CommentsContainer;

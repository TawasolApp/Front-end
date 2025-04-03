import { useEffect, useState, useRef } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import AddForm from "./AddForm";
import Comment from "./Comment";
import { usePost } from "../../PostContext";

const CommentsContainer = () => {
  const { post, hasMoreComments, comments, fetchComments, handleAddComment } =
    usePost();

  useEffect(() => {
    if (post.id) {
      fetchComments();
    }
  }, [post.id]);

  return (
    <>
      <AddForm handleAddFunction={handleAddComment} type="Comment" />

      {comments &&
        comments.length > 0 &&
        comments.map((comment, index) => (
          <div key={index} className="py-2">
            <Comment comment={comment} />
          </div>
        ))}

      {hasMoreComments && (
        <div className="ml-4 my-3 flex items-center">
          <button
            onClick={fetchComments}
            className="flex items-center px-1 py-1 space-x-1 rounded-xl hover:bg-buttonIconHover transition-colors"
          >
            <OpenInFullIcon className="text-icon" fontSize="small" />
            <span className="text-xs font-medium text-icon pl-1">
              Load more comments
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default CommentsContainer;

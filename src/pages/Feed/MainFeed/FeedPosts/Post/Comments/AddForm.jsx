import { useState, useRef, useEffect } from "react";
import { Avatar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { usePost } from "../../PostContext";
import TextEditor from "../../../../GenericComponents/TextEditor";

const AddForm = ({
  handleAddFunction,
  initialText = "",
  initialTaggedUsers = [],
  close = null,
  type,
}) => {
  const { currentAuthorPicture } = usePost();
  const [commentText, setCommentText] = useState(initialText);
  const [taggedUsers, setTaggedUsers] = useState(initialTaggedUsers);
  const [loading, setLoading] = useState(false); // New loading state
  const hasText = commentText.trim().length > 0;
  const textareaRef = useRef(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";

      // Set the new height based on whether there's text or it's a Reply type
      if (hasText || (type !== "Comment" && type !== "Reply")) {
        // Set the new height based on scrollHeight (with a min expanded height)
        const newHeight = Math.max(64, textareaRef.current.scrollHeight);
        textareaRef.current.style.height = `${newHeight}px`;
      } else {
        // When no text and not a Reply, collapse to default height
        textareaRef.current.style.height = "32px";
      }
    }
  }, [commentText, hasText, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setLoading(true);
      try {
        await handleAddFunction(commentText, taggedUsers);
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
      setLoading(false); // Set loading to false once done
    }
  };

  // Determine whether to show expanded or collapsed view
  const isExpanded = hasText || (type !== "Comment" && type !== "Reply");

  return (
    <div className="flex items-start pt-1 pb-2">
      <div className="mr-2 h-9 w-8">
        <Avatar
          sx={{ width: 32, height: 32 }}
          className="relative rounded-full top-0 left-0"
          src={currentAuthorPicture}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative" role="form">
        <TextEditor
          placeholder={
            type === "Comment"
              ? "Add a comment..."
              : type === "Edit Comment"
                ? "Edit Comment..."
                : "Add a Reply..."
          }
          className={`w-full px-3 py-1.5 bg-form ${isExpanded ? "rounded-xl" : "rounded-2xl"} border border-itemBorder focus:outline-none focus:border-itemBorderFocus ${isExpanded ? "pb-8" : "pb-1.5"} resize-none transition-all duration-200 overflow-hidden min-w-0 break-words text-textContent`}
          text={commentText}
          setText={setCommentText}
          taggedUsers={taggedUsers}
          setTaggedUsers={setTaggedUsers}
          externalTextareaRef={textareaRef}
          rows={1}
          style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        />

        <div
          className={`absolute right-2 ${isExpanded ? "bottom-3.5" : "hidden"} flex space-x-2`}
        >
          {(type === "Edit Reply" || type === "Edit Comment") && (
            <button
              type="button"
              onClick={close}
              className="px-3 py-1 text-sm font-medium text-buttonSubmitText bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-lg"
            >
              Cancel
            </button>
          )}

          {(hasText || type === "Reply") && (
            <button
              type="submit"
              className="px-3 py-1 text-sm font-medium text-buttonSubmitText bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                type
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddForm;

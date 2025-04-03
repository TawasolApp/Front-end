import { useState, useRef, useEffect } from "react";
import { Avatar } from "@mui/material";
import TextEditor from "../../../../GenericComponents/TextEditor";

const AddForm = ({
  handleAddFunction,
  initialText = "",
  initialTaggedUsers = [],
  close = null,
  type,
}) => {
  // TODO: change this to redux states
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";


  const [commentText, setCommentText] = useState(initialText);
  const [taggedUsers, setTaggedUsers] = useState(initialTaggedUsers);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      handleAddFunction(commentText, taggedUsers);
      setCommentText("");
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
              className="px-3 py-1 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

          {(hasText || type === "Reply") && (
            <button
              type="submit"
              className="px-3 py-1 text-sm font-medium text-buttonSubmitText bg-buttonSubmitEnable rounded-lg hover:bg-buttonSubmitEnableHover"
            >
              {type}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddForm;

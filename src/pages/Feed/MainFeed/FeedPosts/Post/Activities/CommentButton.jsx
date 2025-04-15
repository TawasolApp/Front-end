import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const CommentButton = ({ setShowComments }) => {
  return (
    <button
      className="p-2 flex items-center justify-center gap-1 hover:bg-buttonIconHover hover:transition-all duration-200 group"
      onClick={setShowComments}
    >
      <ChatBubbleOutlineIcon
        sx={{ fontSize: 16 }}
        className="text-textActivity group-hover:text-textActivityHover"
      />
      <span data-testid="postComment" className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover hidden sm:inline">
        Comment
      </span>
    </button>
  );
};

export default CommentButton;

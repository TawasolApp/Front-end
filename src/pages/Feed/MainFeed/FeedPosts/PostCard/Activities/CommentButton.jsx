import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const CommentButton = ({ setShowComments }) => {

    return (
        <button
            className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded"
            onClick={() => setShowComments(true)}
        >
            <ChatBubbleOutlineIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Comment</span>
        </button>
    );
};

export default CommentButton;
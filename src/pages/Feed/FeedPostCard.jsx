import { Avatar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import SendIcon from '@mui/icons-material/Send';

const FeedPostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
      {/* Repost Header */}
      {post.isRepost && (
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <RepeatIcon className="w-4 h-4 mr-1" />
          <span>{post.repostAuthor} reposted</span>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        {/* Author Header */}
        <div className="flex items-start gap-2">
          <Avatar 
            src={post.author.avatar}
            sx={{ width: 44, height: 44 }}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                <p className="text-xs text-gray-500">{post.author.title}</p>
              </div>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>
            
            {/* Post Text */}
            {post.content && (
              <p className="text-gray-800 mt-2">{post.content}</p>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-between text-gray-500 pt-3 mt-2 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-xs">{post.likes} likes</span>
          <span className="text-xs">{post.comments} comments</span>
          <span className="text-xs">{post.reposts} reposts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-3 mt-2">
        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
          <FavoriteBorderIcon className="w-5 h-5" />
          <span className="text-sm">Like</span>
        </button>

        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
          <ChatBubbleOutlineIcon className="w-5 h-5" />
          <span className="text-sm">Comment</span>
        </button>

        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
          <RepeatIcon className="w-5 h-5" />
          <span className="text-sm">Repost</span>
        </button>

        <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
          <SendIcon className="w-5 h-5" />
          <span className="text-sm">Send</span>
        </button>
      </div>
    </div>
  );
};

export default FeedPostCard;
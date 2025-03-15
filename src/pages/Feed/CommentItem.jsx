import { Avatar } from '@mui/material';

const CommentItem = ({ comment }) => {
  return (
    <div className="flex items-start gap-2 py-2 border-t border-gray-100">
      <Avatar 
        src={comment.author.avatar} 
        sx={{ width: 32, height: 32 }}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="text-sm font-semibold">{comment.author.name}</h4>
          <span className="text-xs text-gray-500">{comment.author.title}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">
            {new Date(comment.timestamp).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-800 mt-0.5">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;

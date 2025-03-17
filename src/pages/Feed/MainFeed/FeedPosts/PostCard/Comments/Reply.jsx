import { Avatar } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';

const Reply = ({ reply }) => {
  return (
    <div className="flex items-start gap-2 py-2">
      <Avatar 
        src={reply.author?.avatar}
        sx={{ width: 24, height: 24 }}
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold">
            {reply.author?.name}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(reply.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          
          <div className="ml-auto">
            <DropdownMenu
              trigger={
                <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1">
                  <MoreHorizIcon fontSize="small" />
                </button>
              }
              position="right-0"
            >
              <button className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Report
              </button>
            </DropdownMenu>
          </div>
        </div>
        
        <p className="text-sm text-gray-800 mt-0.5">{reply.text}</p>
        
        <div className="mt-1">
          <ReactionPicker onSelectReaction={(type) => console.log('Reply reaction:', type)}>
            <button className="text-xs text-gray-500 hover:text-blue-600">
              Like
            </button>
          </ReactionPicker>
        </div>
      </div>
    </div>
  );
};

export default Reply;
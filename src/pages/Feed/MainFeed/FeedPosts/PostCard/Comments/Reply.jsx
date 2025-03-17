import { useState } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';
import ActorHeader from '../../../../GenericComponents/ActorHeader';
import ActivitiesHolder from './ActivitiesHolder';

const Reply = ({ reply }) => {


  const [localReply, setLocalReply] = useState(reply);

  const menuItems = [
    {
      text: 'Report post',
      onClick: () => console.log('Reported post'),
      icon: FlagIcon
    },
  ];

  const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
    setLocalReply(prev => {
        const newReactions = { ...prev.reactions };

        if (reactionTypeAdd) {
            newReactions[reactionTypeAdd] += 1;
        }
        if (reactionTypeRemove) {
            newReactions[reactionTypeRemove] -= 1;
        }

        return { ...prev, reactions: newReactions };
    });
  };


  return (
    <div className="items-start">
      <div className="flex">
        <div>
          <ActorHeader author={reply.author} iconSize={32} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {new Date(reply.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <DropdownMenu menuItems={menuItems} position="right-0">
            <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1">
              <MoreHorizIcon className="w-5 h-5" />
            </button>
          </DropdownMenu>
        </div>
      </div>

      {/* Comment Text */}
      <p className="text-sm text-gray-800 mt-1">{reply.text}</p>

      {/* Actions Row */}
      <div className="flex items-center gap-2 mt-1">
        <ActivitiesHolder
          reactions={localReply.reactions}
          onReactionChange={handleReaction}
        />
        <span className="text-gray-300">·</span>
        <button className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1 -mx-2 rounded-sm">
          Reply
        </button>
      </div>
    </div>
  );
};
export default Reply;
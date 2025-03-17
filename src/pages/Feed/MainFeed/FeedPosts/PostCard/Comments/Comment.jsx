import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlagIcon from '@mui/icons-material/Flag';
import ActorHeader from '../../../../GenericComponents/ActorHeader';
import DropdownMenu from '../../../../GenericComponents/DropdownMenu';
import ActivitiesHolder from './ActivitiesHolder';


const Comment = ({ comment }) => {

  const [localComment, setLocalComment] = useState(comment);
  const [showReplies, setShowReplies] = useState(false);

  const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
    setLocalComment(prev => {
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

  const menuItems = [
    {
      text: 'Report post',
      onClick: () => console.log('Reported post'),
      icon: FlagIcon
    },
  ];

  return (
    <article>

      {/* Header Part */}
      <div className="flex px-4 pt-1 pb-2">
        <div>
          <ActorHeader author={localComment.author} iconSize={32} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {new Date(localComment.timestamp).toLocaleDateString('en-US', {
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

      {/* Content Part */}
      <div className="px-4">
        {/* First div - handles padding and thread line */}

        {/* Second div - content with left padding */}
        <div>
          {/* Your content goes here */}
          <p>{localComment.content}</p>
        </div>
      </div>

      {/* Activities and Metrics Part */}
      <div className="px-4">
        {/* First div - handles padding and thread line */}
        
        {/* Second div - Actual holder */}
        <ActivitiesHolder
          reactions={localComment.reactions}
          onReactionChange={handleReaction}
          replies={localComment.replies.length}
          setShowReplies={setShowReplies}
        />
      </div>

      
    </article>
  );
};

export default Comment;
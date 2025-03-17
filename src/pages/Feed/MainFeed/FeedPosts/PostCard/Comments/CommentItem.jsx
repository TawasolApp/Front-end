import { useState } from 'react';
import { Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoodIcon from '@mui/icons-material/Mood';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const reactionIcons = {
  like: { Icon: ThumbUpIcon, color: '#0a66c2', label: 'Like' },
  celebrate: { Icon: CelebrationIcon, color: '#c37d0a', label: 'Celebrate' },
  support: { Icon: VolunteerActivismIcon, color: '#c20a66', label: 'Support' },
  love: { Icon: FavoriteIcon, color: '#c20a0a', label: 'Love' },
  insightful: { Icon: LightbulbIcon, color: '#0ac2ae', label: 'Insightful' },
  funny: { Icon: MoodIcon, color: '#7dc20a', label: 'Funny' },
};

const CommentItem = ({ comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  // Reactions logic
  const topReactions = Object.entries(localComment.reactions)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const totalReactions = Object.values(localComment.reactions).reduce((a, b) => a + b, 0);
  const replyCount = localComment.replies?.length || 0;

  // Reply display logic
  const visibleReplies = showAllReplies 
    ? localComment.replies 
    : localComment.replies?.slice(-1);

  return (
    <div className="py-2">
      <div className="flex items-start gap-2 px-4">
        {/* Avatar */}
        <Avatar 
          src={localComment.author?.avatar} 
          sx={{ width: 32, height: 32 }}
          className="mt-1"
        />
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-baseline gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {localComment.author?.name}
              </h3>
              <p className="text-xs text-gray-500">
                {localComment.author?.title}
              </p>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(localComment.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <button 
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                onClick={() => setShowOptions(!showOptions)}
              >
                <MoreHorizIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-sm text-gray-800 mt-1">{localComment.content}</p>

          {/* Reactions and Reply */}
          <div className="flex items-center gap-4 mt-2">
            <div 
              className="relative flex items-center gap-1 group"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              <span className="text-xs text-gray-500 cursor-pointer hover:text-blue-600">
                Likes
              </span>
              {totalReactions > 0 && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <div className="flex items-center -space-x-1">
                    {topReactions.map(([reactionType]) => {
                      const { Icon, color } = reactionIcons[reactionType];
                      return (
                        <Icon 
                          key={reactionType}
                          style={{ color, fontSize: 16 }}
                          className="bg-white rounded-full p-0.5"
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-500">{totalReactions}</span>
                </>
              )}

              {/* Reaction Picker */}
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-white rounded-full shadow-lg p-1 border border-gray-200 z-10">
                  {Object.entries(reactionIcons).map(([reactionType, { Icon, color }]) => (
                    <button
                      key={reactionType}
                      className="hover:scale-125 transition-transform"
                      onClick={() => handleReaction(reactionType)}
                    >
                      <Icon style={{ color }} className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-300">|</span>
              <button
                className="text-xs text-gray-500 hover:text-blue-600"
                onClick={() => setShowReply(!showReply)}
              >
                Reply
              </button>
              {replyCount > 0 && (
                <span className="text-xs text-gray-500">
                  • {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
          </div>

          {/* Replies Thread */}
          {localComment.replies?.length > 0 && (
            <div className="ml-6 border-l-2 border-gray-100 pl-3 mt-2">
              {!showAllReplies && localComment.replies.length > 1 && (
                <button
                  className="text-xs text-blue-600 hover:underline mb-2"
                  onClick={() => setShowAllReplies(true)}
                >
                  Show previous replies
                </button>
              )}

              {visibleReplies?.map((reply, index) => (
                <div key={index} className="flex items-start gap-2 py-2">
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
                    </div>
                    <p className="text-sm text-gray-800 mt-0.5">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Input */}
          {showReply && (
            <div className="mt-2 flex items-start gap-2">
              <Avatar sx={{ width: 32, height: 32 }} />
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1 text-sm border rounded-full focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          <button className="px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
            Report
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
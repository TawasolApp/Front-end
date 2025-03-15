import { useState } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import SendIcon from '@mui/icons-material/Send';
import FeedPostCardHeader from './FeedPostCardHeader';
import EngagementMetrics from './EngagementMetrics';
import LikeButton from './LikeButton';
import MediaDisplay from './MediaDisplay';

const FeedPostCard = ({ post }) => {
    const [localPost, setLocalPost] = useState(post);

    const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
        setLocalPost(prev => {
            const newReactions = { ...prev.reactions };
            console.log(newReactions);

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
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-4">
            {localPost.isRepost && (
                <div className="flex items-center text-xs text-gray-500 mb-2 px-4 pt-2">
                    <RepeatIcon className="w-4 h-4 mr-1" />
                    <span>{localPost.repostAuthor} reposted</span>
                </div>
            )}

            <FeedPostCardHeader author={localPost.author} timestamp={localPost.timestamp} />

            {localPost.content && (
                <p className="text-gray-800 px-4 pb-2">{localPost.content}</p>
            )}


            {post.media && post.media.length > 0 && (
                <MediaDisplay media={post.media} />
            )}

            <EngagementMetrics
                reactions={localPost.reactions}
                comments={localPost.comments}
                reposts={localPost.reposts}
            />

            <div className="grid grid-cols-4 gap-0 px-4 py-2 border-t border-gray-200">
                <LikeButton onChange={handleReaction} />

                <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
                    <ChatBubbleOutlineIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Comment</span>
                </button>

                <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
                    <RepeatIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Repost</span>
                </button>

                <button className="flex items-center justify-center gap-1 hover:bg-gray-100 p-2 rounded">
                    <SendIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Send</span>
                </button>
            </div>
        </div>
    );
};

export default FeedPostCard;
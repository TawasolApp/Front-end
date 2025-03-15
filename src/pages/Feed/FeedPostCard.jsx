import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import SendIcon from '@mui/icons-material/Send';
import FeedPostCardHeader from './FeedPostCardHeader';
import EngagementMetrics from './EngagementMetrics';


const FeedPostCard = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-4">
            {/* Repost Header */}
            {post.isRepost && (
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <RepeatIcon className="w-4 h-4 mr-1" />
                    <span>{post.repostAuthor} reposted</span>
                </div>
            )}

            <FeedPostCardHeader author={post.author} timestamp={post.timestamp} />

            {/* Post Text */}
            {post.content && (
                <p className="text-gray-800 mx-4">{post.content}</p>
            )}

            <div>
                {/* Engagement Metrics */}
                <EngagementMetrics
                    reactions={post.reactions}
                    comments={post.comments}
                    reposts={post.reposts}
                />

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2 px-4 py-1">
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

        </div>
    );
};

export default FeedPostCard;
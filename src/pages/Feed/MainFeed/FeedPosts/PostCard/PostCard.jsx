import { useState } from 'react';

import PostCardHeader from './Header/PostCardHeader';
import PostContent from './Content/PostContent';
import EngagementMetrics from './Metrics/EngagementMetrics';
import ActivitiesHolder from './Activities/ActivitiesHolder';
import CommentsContainer from './Comments/CommentsContainer';

const PostCard = ({ post }) => {

    const [localPost, setLocalPost] = useState(post);

    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReposts, setShowReposts] = useState(false);
    
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

    const rerenderCommentsNumber = () => {
        setLocalPost(prev => ({
            ...prev,
            comments: prev.comments + 1
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-4">

            <PostCardHeader
                author={localPost.author}
                timestamp={localPost.timestamp}
            />

            <PostContent
                content={localPost.content}
                media={localPost.media}
            />

            <EngagementMetrics
                reactions={localPost.reactions}
                comments={localPost.comments}
                reposts={localPost.reposts}
                setShowLikes={setShowLikes}
                setShowComments={setShowComments}
                setShowrReposts={setShowReposts}
            />

            <ActivitiesHolder
                onChange={handleReaction}
                setShowComments={setShowComments}
            />

            {showComments && <CommentsContainer
                postId={post.id}
                rerender={rerenderCommentsNumber}
            />}

        </div>
    );
};

export default PostCard;
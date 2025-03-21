import { useState } from 'react';

import PostCardHeader from './Header/PostCardHeader';
import PostContent from './Content/PostContent';
import EngagementMetrics from './Metrics/EngagementMetrics';
import ActivitiesHolder from './Activities/ActivitiesHolder';
import CommentsContainer from './Comments/CommentsContainer';
import ReactionsModal from '../ReactionModal/ReactionsModal';

import { axiosInstance } from '../../../../../apis/axios';

const PostCard = ({ post }) => {

    const [localPost, setLocalPost] = useState(post);

    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReposts, setShowReposts] = useState(false);

    const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
        try {
            // TODO: Check with Mohab about the request body
            // axiosInstance.post(`posts/${localPost.id}/react`);
            setLocalPost(prev => {
                const newReactions = { ...prev.reactions };
                if (reactionTypeAdd) newReactions[reactionTypeAdd] += 1;
                if (reactionTypeRemove) newReactions[reactionTypeRemove] -= 1;
                return { ...prev, reactions: newReactions };
            });
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
        }
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
                authorName={localPost.authorName}
                authorBio={localPost.authorBio}
                authorPicture={localPost.authorPicture}
                timestamp={localPost.timestamp}
                visibility={localPost.visibility}
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
                setShowReposts={setShowReposts}
            />

            <ActivitiesHolder
                onChange={handleReaction}
                setShowComments={setShowComments}
            />

            {showComments && <CommentsContainer
                postId={post.id}
                rerender={rerenderCommentsNumber}
            />}

            {showLikes && (
                <ReactionsModal
                    apiUrl="////"
                    setShowLikes={() => setShowLikes(false)}
                />
            )}

        </div>
    );
};

export default PostCard;
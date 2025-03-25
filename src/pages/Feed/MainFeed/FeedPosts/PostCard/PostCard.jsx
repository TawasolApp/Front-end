import { useState } from 'react';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FlagIcon from '@mui/icons-material/Flag';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PostCardHeader from './Header/PostCardHeader';
import PostContent from './Content/PostContent';
import EngagementMetrics from './Metrics/EngagementMetrics';
import ActivitiesHolder from './Activities/ActivitiesHolder';
import CommentsContainer from './Comments/CommentsContainer';
import ReactionsModal from '../ReactionModal/ReactionsModal';

import { axiosInstance } from '../../../../../apis/axios';
import TextModal from '../../SharePost/TextModal';
import DeletePostModal from '../DeleteModal/DeletePostModal';

const PostCard = ({
    post,
    deletePost
}) => {

    // TODO: change this to redux states
    const currentAuthorId = "mohsobh";
    const currentAuthorName = "Mohamed Sobh";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Computer Engineering Student at Cairo University";
    const currentAuthorType = "User";

    const [localPost, setLocalPost] = useState(post);
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReposts, setShowReposts] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    let menuItems = [
        {
          text: localPost.isSaved ? 'Unsave post' : 'Save post', 
          onClick: () => {savePost()},
          icon: localPost.isSaved ? BookmarkIcon : BookmarkBorderIcon // Import and use actual icon component
        },
        {
          text: 'Report post',
          onClick: () => console.log('Reported post'),
          icon: FlagIcon
        },
        {
          text: `Unfollow ${localPost.authorName}`,
          onClick: () => console.log('User unfollowed'),
          icon: HighlightOffIcon
        },
        {
          text: "Copy link to post",
          onClick: () => {copyPost()},
          icon: LinkIcon
        },
    ];

    const updatePost = async (text, visibility) => {

        try {
            await axiosInstance.patch(`/posts/${localPost.id}`, {
                authorId: currentAuthorId,
                content: text,
                media: [],
                taggedUsers: [],
                visibility: visibility
            });
            setLocalPost(prev => ({ 
                ...prev,
                content: text,
                visibility: visibility
            }));
        } catch (e) {
            setShowEditModal(false);
            console.log(e.message);
        }
    }

    if (localPost.authorId === currentAuthorId) {
        menuItems.push({
            text: 'Edit post',
            onClick: () => {setShowEditModal(true)},
            icon: EditIcon
        });
        menuItems.push({
            text: 'Delete post',
            onClick: () => setShowDeleteModal(true),
            icon: DeleteIcon
        });
    }

    const savePost = () => {
        try {
            if (localPost.isSaved)
                axiosInstance.delete(`posts/save/${localPost.id}`);
            else
                axiosInstance.post(`posts/save/${localPost.id}`);

            setLocalPost(prev => {
                return { ...prev, isSaved: !prev.isSaved};
            })
        } catch (e) {
            console.log(`ERROR: ${e.message}`);
        }
    }

    const copyPost = async () => {
        await navigator.clipboard.writeText(`http://localhost:5173/posts/${localPost.id}`);
    }

    const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
        
        let reacts = {};
        if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
        if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;
        try {
            axiosInstance.post(`posts/react/${localPost.id}`, {
                reactions: reacts,
                postType: "Post"
            });

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

    const incrementCommentsNumber = (incOrDec) => {
        setLocalPost(prev => ({
            ...prev,
            comments: prev.comments + (incOrDec === "inc" ? 1 : -1)
        }));
    };


    return (
        <div className="bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder mb-4">

            <PostCardHeader
                authorId={localPost.authorId}
                authorName={localPost.authorName}
                authorBio={localPost.authorBio}
                authorPicture={localPost.authorPicture}
                timestamp={localPost.timestamp}
                visibility={localPost.visibility}
                menuItems={menuItems}
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
                initReactValue={localPost.reactType}
                onChange={handleReaction}
                setShowComments={setShowComments}
            />

            {showComments && <CommentsContainer
                postId={post.id}
                incrementCommentsNumber={incrementCommentsNumber}
                commentsCount={post.comments}
            />}

            {showLikes && (
                <ReactionsModal
                    APIURL={`/posts/reactions/${localPost.id}`}
                    setShowLikes={() => setShowLikes(false)}
                />
            )}

            {showEditModal && (
                <TextModal
                    currentAuthorName={currentAuthorName}
                    currentAuthorPicture={currentAuthorPicture}
                    setIsModalOpen={() => setShowEditModal(false)}
                    sharePost={updatePost}
                    initialText={localPost.content}
                />
            )}

            {showDeleteModal && (
                <DeletePostModal
                    closeModal={() => setShowDeleteModal(false)}
                    deleteFunc={async () => {
                        await deletePost(localPost.id);
                        setShowDeleteModal(false);
                    }}
                    commentOrPost="Post"
                />
            )}

        </div>
    );
};

export default PostCard;
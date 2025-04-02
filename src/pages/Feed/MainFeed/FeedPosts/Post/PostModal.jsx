import { useState, useEffect } from "react";

import PostCardHeader from "./Header/PostCardHeader";
import PostContent from "./Content/PostContent";
import EngagementMetrics from "./Metrics/EngagementMetrics";
import ActivitiesHolder from "./Activities/ActivitiesHolder";
import CommentsContainer from "./Comments/CommentsContainer";
import ReactionsModal from "../ReactionModal/ReactionsModal";


const PostModal = ({
  post,
  handleReaction,
  incrementCommentsNumber,
  handleClosePostModal
}) => {

  useEffect(() => {
    // Disable scrolling on the body when the modal opens
    document.body.style.overflow = "hidden";
    return () => {
      // Restore scrolling when the modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

  const mediaUrl = post.media[0]; // Assuming single media for now

  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReposts, setShowReposts] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={handleClosePostModal}
    >
      {/* Main modal container */}
      <div
        className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media container with black space */}
        <div className="flex-1 bg-cardBackground flex items-center justify-center relative">
          <div className="max-w-full max-h-full">
            <img
              src={mediaUrl}
              alt="Post media"
              className="max-h-[80vh] object-contain"
            />
          </div>
        </div>

        {/* Post card container */}
        <div className="w-[500px] flex-shrink-0 border-l border-cardBorder h-full bg-cardBackground overflow-y-auto">
          <div className="bg-cardBackground rounded-none">
            <PostCardHeader
              authorId={post.authorId}
              authorName={post.authorName}
              authorBio={post.authorBio}
              authorPicture={post.authorPicture}
              timestamp={post.timestamp}
              visibility={post.visibility}
              modal={true}
              handleClosePostModal={handleClosePostModal}
            />
            <PostContent
              content={post.content}
              taggedUsers={post.taggedUsers}
              media={post.media}
              modal={true}
            />
            <EngagementMetrics
              reactions={post.reactions}
              comments={post.comments}
              reposts={post.reposts}
              setShowLikes={() => setShowLikes(true)}
              setShowComments={() => setShowComments(true)}
              setShowReposts={() => setShowReposts(true)}
            />
            <ActivitiesHolder
              initReactValue={post.reactType}
              handleReaction={handleReaction}
              setShowComments={() => setShowComments(true)}
            />
            {showComments && (
              <CommentsContainer
                postId={post.id}
                incrementCommentsNumber={incrementCommentsNumber}
                commentsCount={post.comments}
              />
            )}
            {showLikes && (
              <ReactionsModal
                APIURL={`/posts/reactions/${post.id}`}
                setShowLikes={() => setShowLikes(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;

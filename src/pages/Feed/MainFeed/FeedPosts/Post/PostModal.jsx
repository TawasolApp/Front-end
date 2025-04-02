import { useState, useEffect } from "react";

import PostCardHeader from "./Header/PostCardHeader";
import PostContent from "./Content/PostContent";
import EngagementMetrics from "./Metrics/EngagementMetrics";
import ActivitiesHolder from "./Activities/ActivitiesHolder";
import CommentsContainer from "./Comments/CommentsContainer";
import ReactionsModal from "../ReactionModal/ReactionsModal";
import MediaCarousel from "./MediaCarousel/MediaCarousel";

const PostModal = ({
  post,
  mediaIndex,
  handleReaction,
  incrementCommentsNumber,
  handleClosePostModal,
}) => {
  useEffect(() => {
    // Disable scrolling on the body when the modal opens
    document.body.style.overflow = "hidden";
    return () => {
      // Restore scrolling when the modal unmounts
      document.body.style.overflow = "";
    };
  }, []);

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
        className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media container with black space */}
        <div className="md:flex-1 w-full h-[60%] md:h-full bg-black flex items-center justify-center relative">
          <MediaCarousel media={post.media} mediaIndex={mediaIndex} />
        </div>

        {/* Post card container */}
        <div className="w-full md:w-[500px] flex-shrink-0 border-t md:border-l md:border-t-0 border-cardBorder h-[40%] md:h-full bg-cardBackground overflow-y-auto">
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

import { useState, useEffect } from "react";

import PostCardHeader from "./Header/PostCardHeader";
import PostContent from "./Content/PostContent";
import EngagementMetrics from "./Metrics/EngagementMetrics";
import ActivitiesHolder from "./Activities/ActivitiesHolder";
import CommentsContainer from "./Comments/CommentsContainer";
import ReactionsModal from "../ReactionModal/ReactionsModal";
import MediaCarousel from "./MediaCarousel/MediaCarousel";
import SilentRepostHeader from "./Header/SilentRepostHeader";
import { usePost } from "../PostContext";

const PostModal = ({ mediaIndex, handleClosePostModal }) => {
  const { post } = usePost();

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
        <div className="md:flex-1 w-full h-[70vh] md:h-full bg-black flex items-center justify-center relative">
          <MediaCarousel
            media={
              post.repostedComponents
                ? post.repostedComponents.media
                : post.media
            }
            mediaIndex={mediaIndex}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Post card container */}
        <div className="w-full md:w-[500px] flex-shrink-0 border-t md:border-l md:border-t-0 border-cardBorder h-[40%] md:h-full bg-cardBackground overflow-y-auto">
          {post.headerData && (
            <SilentRepostHeader
              authorId={post.headerData.authorId}
              authorPicture={post.headerData.authorPicture}
              authorName={post.headerData.authorName}
            />
          )}

          <div className="bg-cardBackground rounded-none">
            <PostCardHeader
              modal={true}
              handleClosePostModal={handleClosePostModal}
            />

            <PostContent modal={true} />

            {post.repostedComponents && (
              <div className="mx-4 mb-2 border rounded-md border-cardBorder">
                <PostCardHeader noRightItems={true} />
                <PostContent modal={true} reposted={true} />
              </div>
            )}

            <EngagementMetrics
              setShowLikes={() => setShowLikes(true)}
              setShowComments={() => setShowComments(true)}
            />

            <ActivitiesHolder setShowComments={() => setShowComments(true)} />

            {showComments && <CommentsContainer />}

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

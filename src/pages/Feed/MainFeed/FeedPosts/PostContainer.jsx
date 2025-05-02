import { useState } from "react";
import { PostProvider } from "./PostContext";
import PostCard from "./Post/PostCard";
import PostModal from "./Post/PostModal";

const PostContainer = ({
  post,
  handleSharePost,
  handleDeletePost,
  currentAuthorId,
  currentAuthorName,
  currentAuthorPicture,
  isAdmin,
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

  return (
    <PostProvider
      initialPost={post}
      handleSharePost={handleSharePost}
      handleDeletePostExternal={handleDeletePost}
      currentAuthorId={currentAuthorId}
      currentAuthorName={currentAuthorName}
      currentAuthorPicture={currentAuthorPicture}
      isAdmin={isAdmin}
    >
      <PostCard
        setShowPostModal={() => setShowPostModal(true)}
        setMediaIndex={setMediaIndex}
      />
      {showPostModal && (
        <PostModal
          mediaIndex={mediaIndex}
          handleClosePostModal={() => setShowPostModal(false)}
        />
      )}
    </PostProvider>
  );
};

export default PostContainer;

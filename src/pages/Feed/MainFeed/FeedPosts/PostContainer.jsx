import { useState } from "react";
import { PostProvider } from "./PostContext";
import PostCard from "./Post/PostCard";
import PostModal from "./Post/PostModal";

const PostContainer = ({ post, handleSharePost, handleDeletePost }) => {

  const [showPostModal, setShowPostModal] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

  return (
    <PostProvider
      initialPost={post}
      handleSharePost={handleSharePost}
      handleDeletePost={handleDeletePost}
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

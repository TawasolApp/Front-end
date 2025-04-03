import { useState } from "react";
import { PostProvider } from "./PostContext";
import PostCard from "./Post/PostCard";
import PostModal from "./Post/PostModal";

const PostContainer = ({ post, handleDeletePost }) => {
  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";
  const currentAuthorType = "User";

  const [showPostModal, setShowPostModal] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

  return (
    <PostProvider initialPost={post} handleDeletePost={handleDeletePost}>
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

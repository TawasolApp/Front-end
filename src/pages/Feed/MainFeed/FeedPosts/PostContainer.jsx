import { useState } from "react";
import PostCard from "./Post/PostCard";
import PostModal from "./Post/PostModal";
import { axiosInstance } from "../../../../apis/axios";

const PostContainer = ({ post, handleDeletePost }) => {
  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";
  const currentAuthorType = "User";

  const [localPost, setLocalPost] = useState(post);
  const [showPostModal, setShowPostModal] = useState(false);

  const handleEditPost = async (text, media, visibility, taggedUsers) => {
    await axiosInstance.patch(`/posts/${localPost.id}`, {
      authorId: currentAuthorId,
      content: text,
      // TODO ADD MEDIA HERE
      taggedUsers: taggedUsers,
      visibility: visibility,
    });

    setLocalPost((prev) => ({
      ...prev,
      content: text,
      taggedUsers: taggedUsers,
      visibility: visibility,
    }));
  };

  const handleSavePost = () => {
    try {
      if (localPost.isSaved) axiosInstance.delete(`posts/save/${localPost.id}`);
      else axiosInstance.post(`posts/save/${localPost.id}`);

      setLocalPost((prev) => {
        return { ...prev, isSaved: !prev.isSaved };
      });
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  };

  const handleReaction = (reactionTypeAdd, reactionTypeRemove) => {
    let reacts = {};
    if (reactionTypeAdd) reacts[reactionTypeAdd] = 1;
    if (reactionTypeRemove) reacts[reactionTypeRemove] = 0;
    try {
      axiosInstance.post(`posts/react/${localPost.id}`, {
        reactions: reacts,
        postType: "Post",
      });

      setLocalPost((prev) => {
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
    setLocalPost((prev) => ({
      ...prev,
      comments: prev.comments + (incOrDec === "inc" ? 1 : -1),
    }));
  };

  return (
    <>
      <PostCard
        post={localPost}
        handleSavePost={handleSavePost}
        handleDeletePost={handleDeletePost}
        handleReaction={handleReaction}
        handleEditPost={handleEditPost}
        incrementCommentsNumber={incrementCommentsNumber}
        setShowPostModal={() => setShowPostModal(true)}
      />
    </>
  );
};

export default PostContainer;

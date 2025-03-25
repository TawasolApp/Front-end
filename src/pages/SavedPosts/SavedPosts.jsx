import { useEffect, useState } from "react";
import { axiosInstance } from "../../apis/axios";
import PostCard from "../Feed/MainFeed/FeedPosts/PostCard/PostCard";

const SavedPosts = () => {
  const [localPosts, setLocalPosts] = useState([]);

  const fetchSavedPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts/saved");
      setLocalPosts(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/delete/${postId}`);
      setLocalPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId),
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <>
      {localPosts &&
        localPosts.length > 0 &&
        localPosts.map((post) => {
          return (
            <div key={post.id}>
              <PostCard post={post} deletePost={deletePost} />
            </div>
          );
        })}
    </>
  );
};

export default SavedPosts;

import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { axiosInstance } from "../../../../apis/axios.js";
import PostContainer from "../../../Feed/MainFeed/FeedPosts/PostContainer.jsx";

function PostsSlider() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useOutletContext(); // Access user from context
  const userId = user?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn("User ID is missing, skipping posts fetch.");
      return;
    }

    console.log("Fetching posts for userId:", userId);
    setLoading(true);

    axiosInstance
      .get(`/posts/${userId}/user/${userId}`, {
        params: { limit: 5 },
      })
      .then((response) => {
        console.log("Fetched posts response:", response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const handlePostClick = (postId) => {
    console.log("Navigating to post:", postId);
    navigate(`/feed/${postId}`);
  };

  if (posts.length === 0) {
    console.log("No posts to display.");
    return null;
  }

  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 relative"
      data-testid="posts-slider"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-boxheading">Page Posts</h1>
        <div className="flex space-x-2">
          <button
            className="bg-modalbackground p-2 rounded-full hover:bg-sliderbutton transition border border-white shadow-sm"
            aria-label="scroll-left"
            onClick={handleScrollLeft}
          >
            <AiOutlineLeft size={20} className="text-text" />
          </button>
          <button
            className="bg-modalbackground p-2 rounded-full hover:bg-sliderbutton transition border border-white shadow-sm"
            aria-label="scroll-right"
            onClick={handleScrollRight}
          >
            <AiOutlineRight size={20} className="text-text" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className="flex space-x-4 overflow-x-scroll no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.slice(0, 4).map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[400px] min-h-[400px] bg-boxbackground border border-gray-700 rounded-xl shadow-sm p-4"
              onClick={() => handlePostClick(post.id)}
            >
              <PostContainer post={post} />
            </div>
          ))}

          <div className="bg-boxbackground rounded-2xl border border-gray-700 p-4 w-[350px] flex-shrink-0 flex flex-col justify-between min-h-[400px] h-auto">
            <HiOutlineDocumentText className="text-gray-500 w-12 h-12 mb-3" />
            <p className="text-normaltext text-center mb-4">Show all posts</p>
            <button
              className="border border-blue-600 text-blue-600 py-2 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-2 transition"
              onClick={() => {
                console.log("Navigating to all posts");
                navigate(`/users/${userId}/posts`);
              }}
            >
              Show all →
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-3 space-x-2">
        {posts.slice(0, 4).map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full transition-all duration-300 bg-gray-400"
          />
        ))}
      </div>

      <button
        className="w-full py-2 text-navbuttons border-t border-gray-300 mt-4"
        onClick={() => {
          console.log("Clicked footer Show all posts");
          navigate(`/users/${userId}/posts`);
        }}
      >
        Show all posts →
      </button>
    </div>
  );
}

export default PostsSlider;

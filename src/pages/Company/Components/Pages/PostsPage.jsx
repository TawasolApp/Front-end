import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios.js";
import AddPosts from "../PostsPage/AddPosts";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import PostCard from "../../../Feed/MainFeed/FeedPosts/PostCard/PostCard.jsx";

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentFilter = searchParams.get("feedView") || "All";
  const [activeFilter, setActiveFilter] = useState(currentFilter);
  const postIdFromUrl = searchParams.get("postId");
  const filters = ["All", "Images", "Videos", "Articles", "Documents"];

  const { company, showAdminIcons, setShowAdminIcons } = useOutletContext();
  const { companyId } = useParams();
  const [loading, setLoading] = useState(!company);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setSearchParams({ feedView: activeFilter });
  }, [activeFilter, setSearchParams]);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      axiosInstance
        .get("/posts")
        .then((response) => {
          const filteredPosts = response.data.filter(
            (post) => post.authorId?.toString() === companyId
          );
          setPosts(filteredPosts);

          if (postIdFromUrl) {
            const post = filteredPosts.find((p) => p.id === postIdFromUrl);
            setSelectedPost(post);
          }
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [companyId]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleSharePost = async (text, visibility) => {
    try {
      const response = await axiosInstance.post("/posts", {
        authorId: String(companyId),
        authorName: company.name,
        authorPicture: company.logo,
        authorBio: "",
        content: text,
        media: [],
        taggedUsers: [],
        visibility,
      });

      const newPost = response.data;

      if (newPost.authorId?.toString() === companyId) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Scroll to the specific post when it's selected
  useEffect(() => {
    if (selectedPost) {
      const postElement = document.getElementById(`post-${selectedPost.id}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedPost]);
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {showAdminIcons && (
        <AddPosts
          logo={company.logo}
          name={company.name}
          companyId={company.companyId}
          onPostSuccess={handleSharePost}
        />
      )}

      {/* Filters Box */}
      <div className="bg-boxbackground p-6 shadow-md rounded-md">
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-2 border-b pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold transition border border-white text-navbuttons shadow-md ${
                  activeFilter === filter
                    ? "bg-green-700 text-white"
                    : "bg-postsbuttoncolor text-gray-700 hover:border-2"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} id={`post-${post.id}`}>
              <PostCard
                key={post.id}
                post={post}
                handleDeletePost={handleDeletePost}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostsPage;

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios.js";
import AddPosts from "../PostsPage/AddPosts";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import PostCard from "../../../Feed/MainFeed/FeedPosts/PostCard/PostCard.jsx";

function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAdmin = true;
  const currentFilter = searchParams.get("feedView") || "All";
  const [activeFilter, setActiveFilter] = useState(currentFilter);
  const filters = ["All", "Images", "Videos", "Articles", "Documents"];

  const location = useLocation();
  const { companyId } = useParams();
  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setSearchParams({ feedView: activeFilter });
  }, [activeFilter, setSearchParams]);

  useEffect(() => {
    if (!company) {
      setLoading(true);
      axiosInstance
        .get(`/companies/${companyId}`)
        .then((response) => {
          setCompany(response.data);
        })
        .catch((error) => console.error("Error fetching company:", error))
        .finally(() => setLoading(false));
    }
  }, [company, companyId]);

  useEffect(() => {
    if (companyId) {
      axiosInstance
        .get(`/companies/${companyId}/posts`)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [companyId]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleAddPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {isAdmin && (
        <AddPosts
          logo={company.logo}
          name={company.name}
          companyId={company.companyId}
          onPostSuccess={handleAddPost}
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
            <PostCard
              key={post.id}
              post={post}
              handleDeletePost={handleDeletePost}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostsPage;

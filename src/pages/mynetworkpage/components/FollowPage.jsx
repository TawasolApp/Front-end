import React, { useState, useEffect } from "react";
import { axiosInstance } from '../../../apis/axios';

const FollowPage = () => {
  const [activeTab, setActiveTab] = useState("following");
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  // Fetch data when component mounts and when tab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "following") {
          const response = await axiosInstance.get("/connections/following");
          setFollowing(response.data);
        } else {
          const response = await axiosInstance.get("/connections/followers");
          setFollowers(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleUnfollow = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/unfollow/${userId}`);
      setFollowing(following.filter(user => user.userId !== userId));
      setShowUnfollowModal(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollow = async (user) => {
    try {
      console.log("Attempting to follow user:", user.userId); // Debug log
      
      const response = await axiosInstance.post("/connections/follow", {
        userId: user.userId // Make sure this matches what your server expects
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Follow response:", response); // Debug log
      
      if (response.status === 201) {
        setFollowing([...following, response.data]);
      }
    } catch (error) {
      console.error("Detailed follow error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    }
  };

  const promptUnfollow = (user) => {
    setUserToUnfollow(user);
    setShowUnfollowModal(true);
  };

  const closeConfirmation = () => {
    setShowUnfollowModal(false);
  };

  const isFollowing = (userId) => {
    return following.some(user => user.userId === userId);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && userToUnfollow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 relative">
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold pb-2 border-b border-gray-200 pr-8">
              Unfollow
            </h3>
            <p className="text-gray-700 py-3 border-b border-gray-200">
              You are about to unfollow {userToUnfollow.username}
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={closeConfirmation}
                className="px-3 py-1 border-2 border-blue-700 text-blue-700 hover:bg-blue-100 rounded-3xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnfollow(userToUnfollow.userId)}
                className="px-3 py-1 bg-blue-700 text-white hover:bg-blue-800 rounded-3xl text-sm"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md w-[900px] mx-auto">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-xl font-semibold">Omar's Network</h1>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-semibold ${activeTab === "following" ? "text-green-800 border-b-2 border-green-800" : "text-gray-500"}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`px-4 py-2 font-semibold ${activeTab === "followers" ? "text-green-800 border-b-2 border-green-800" : "text-gray-500"}`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>

        {activeTab === "following" ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              You are following {following.length} people out of your network
            </p>
            
            <div className="pt-2">
              {following.length > 0 ? (
                following.map(user => (
                  <div key={user.userId} className="mb-4 pb-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="w-3/4 overflow-hidden">
                        <h3 className="font-bold">{user.username}</h3>
                        <p className="text-sm text-gray-600 truncate">
                          {user.headline}
                        </p>
                      </div>
                      <button
                        onClick={() => promptUnfollow(user)}
                        className="px-5 py-2 text-sm font-semibold text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-full hover:bg-gray-100 hover:font-bold shrink-0 transition-all"
                      >
                        Following
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You're not following anyone yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {followers.length} people are following you
            </p>
            
            {followers.length > 0 ? (
              followers.map(user => (
                <div key={user.userId} className="mb-4 pb-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="w-3/4 overflow-hidden">
                      <h3 className="font-bold">{user.username}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {user.headline}
                      </p>
                    </div>
                    {isFollowing(user.userId) ? (
                      <button
                        onClick={() => promptUnfollow(user)}
                        className="px-5 py-2 text-sm font-semibold text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-full hover:bg-gray-100 hover:font-bold shrink-0 transition-all"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user)}
                        className="px-5 py-2 text-sm font-semibold text-blue-600 border-2 border-blue-300 hover:border-blue-400 rounded-full hover:bg-blue-50 hover:font-bold shrink-0 transition-all"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">You don't have any followers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPage;
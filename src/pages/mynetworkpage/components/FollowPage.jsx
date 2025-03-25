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
      console.log("Attempting to follow user:", user.userId);
      
      const response = await axiosInstance.post("/connections/follow", {
        userId: user.userId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Follow response:", response);
      
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
    <div className="min-h-screen bg-stone-100 dark:bg-black p-4 sm:p-6">
      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && userToUnfollow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e2229] p-4 rounded-lg shadow-lg w-full mx-4 sm:w-80 sm:mx-0 relative border border-gray-200 dark:border-[#2a3038]">
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 p-2 text-gray-600 dark:text-[#959ea9] hover:bg-gray-100 dark:hover:bg-[#2a3038] rounded-full focus:outline-none transition-colors"
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
            
            <h3 className="text-lg font-semibold pb-2 border-b border-gray-200 dark:border-[#2a3038] pr-8 dark:text-[#f0f2f5]">
              Unfollow
            </h3>
            <p className="text-gray-700 dark:text-[#c1c9d4] py-3 border-b border-gray-200 dark:border-[#2a3038]">
              You are about to unfollow {userToUnfollow.username}
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={closeConfirmation}
                className="px-3 py-1 border-2 border-blue-700 dark:border-[#3d7bc8] text-blue-700 dark:text-[#3d7bc8] hover:bg-blue-100 dark:hover:bg-[#2a3038] rounded-3xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnfollow(userToUnfollow.userId)}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-3xl text-sm"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e2229] p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-full sm:max-w-[900px] border border-gray-200 dark:border-[#2a3038]">
        <div className="border-b border-gray-200 dark:border-[#2a3038] pb-4 mb-4">
          <h1 className="text-xl font-semibold dark:text-[#f0f2f5]">Omar's Network</h1>
        </div>

        <div className="flex border-b border-gray-200 dark:border-[#2a3038] mb-4">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${activeTab === "following" ? "text-green-800 dark:text-green-500 border-b-2 border-green-800 dark:border-green-500" : "text-gray-500 dark:text-[#959ea9]"}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${activeTab === "followers" ? "text-green-800 dark:text-green-500 border-b-2 border-green-800 dark:border-green-500" : "text-gray-500 dark:text-[#959ea9]"}`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>

        {activeTab === "following" ? (
          <div>
            <p className="text-sm text-gray-500 dark:text-[#959ea9] mb-4">
              You are following {following.length} people out of your network
            </p>
            
            <div className="pt-2">
              {following.length > 0 ? (
                following.map(user => (
                  <div key={user.userId} className="mb-4 pb-4 border-b border-gray-200 dark:border-[#2a3038]">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="w-full sm:w-3/4 overflow-hidden">
                        <h3 className="font-bold dark:text-[#f0f2f5]">{user.username}</h3>
                        <p className="text-sm text-gray-600 dark:text-[#c1c9d4] truncate">
                          {user.headline}
                        </p>
                      </div>
                      <button
                        onClick={() => promptUnfollow(user)}
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-gray-700 dark:text-[#c1c9d4] border-2 border-gray-300 dark:border-[#2a3038] hover:border-gray-400 dark:hover:border-[#3a4048] rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3038] hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Following
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-[#959ea9]">You're not following anyone yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-[#959ea9] mb-4">
              {followers.length} people are following you
            </p>
            
            {followers.length > 0 ? (
              followers.map(user => (
                <div key={user.userId} className="mb-4 pb-4 border-b border-gray-200 dark:border-[#2a3038]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="w-full sm:w-3/4 overflow-hidden">
                      <h3 className="font-bold dark:text-[#f0f2f5]">{user.username}</h3>
                      <p className="text-sm text-gray-600 dark:text-[#c1c9d4] truncate">
                        {user.headline}
                      </p>
                    </div>
                    {isFollowing(user.userId) ? (
                      <button
                        onClick={() => promptUnfollow(user)}
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-gray-700 dark:text-[#c1c9d4] border-2 border-gray-300 dark:border-[#2a3038] hover:border-gray-400 dark:hover:border-[#3a4048] rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3038] hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user)}
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-blue-600 dark:text-[#3d7bc8] border-2 border-blue-300 dark:border-[#3d7bc8] hover:border-blue-400 dark:hover:border-[#4d8bff] rounded-full hover:bg-blue-50 dark:hover:bg-[#2a3038] hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-[#959ea9]">You don't have any followers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPage;
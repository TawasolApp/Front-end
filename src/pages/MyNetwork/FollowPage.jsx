import React, { useState, useEffect, useRef, useCallback } from "react";
import { axiosInstance } from "../../apis/axios";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";

const FollowPage = () => {
  const [activeTab, setActiveTab] = useState("following");
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const observer = useRef();
  const isFetching = useRef(false);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current) return;
      
      setLoading(true);
      setError(null);
      isFetching.current = true;

      try {
        const endpoint = activeTab === "following" 
          ? "/connections/following" 
          : "/connections/followers";
        
        const response = await axiosInstance.get(endpoint, {
          params: { page, limit }
        });

        const newData = response.data;
        
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          if (page === 1) {
            activeTab === "following" 
              ? setFollowing(newData) 
              : setFollowers(newData);
          } else {
            activeTab === "following" 
              ? setFollowing(prev => [...prev, ...newData]) 
              : setFollowers(prev => [...prev, ...newData]);
          }
        }
      } catch (error) {
        setError(`Failed to load ${activeTab} list.`);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchData();
  }, [activeTab, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setFollowing([]);
    setFollowers([]);
  }, [activeTab]);

  const handleUnfollow = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/unfollow/${userId}`);
      setFollowing(following.filter((user) => user.userId !== userId));
      setShowUnfollowModal(false);
    } catch (error) {
      setError("Failed to unfollow user.");
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollow = async (user) => {
    try {
      setFollowing(prev => [...prev, user]);
      const response = await axiosInstance.post(
        "/connections/follow",
        { userId: user.userId },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const [followingRes, followersRes] = await Promise.all([
        axiosInstance.get("/connections/following", {
          params: { page: 1, limit: limit * page }
        }),
        axiosInstance.get("/connections/followers", {
          params: { page: 1, limit: limit * page }
        })
      ]);
  
      setFollowing(followingRes.data);
      setFollowers(followersRes.data);
  
    } catch (error) {
      setFollowing(prev => prev.filter(u => u.userId !== user.userId));
      setError("Failed to follow user.");
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
    return following.some((user) => user.userId === userId);
  };

  return (
    <div className="min-h-screen bg-mainBackground p-4 sm:p-6">
      {showUnfollowModal && userToUnfollow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cardBackground p-4 rounded-lg shadow-lg w-full mx-4 sm:w-80 sm:mx-0 relative border border-cardBorder">
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 p-2 text-icon hover:bg-buttonIconHover rounded-full focus:outline-none transition-colors"
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

            <h3 className="text-lg font-semibold pb-2 border-b border-cardBorder pr-8 text-textHeavyTitle">
              Unfollow
            </h3>
            <p className="text-textContent py-3 border-b border-cardBorder">
              You are about to unfollow {userToUnfollow.firstName} {userToUnfollow.lastName}
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={closeConfirmation}
                className="px-3 py-1 border-2 border-buttonSubmitEnable text-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-3xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnfollow(userToUnfollow.userId)}
                className="px-3 py-1 bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText rounded-3xl text-sm"
                data-testid="unfollow2"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-cardBackground p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-full sm:max-w-[900px] border border-cardBorder">
        <div className="border-b border-cardBorder pb-4 mb-4">
          <h1 className="text-xl font-semibold text-textHeavyTitle">
            My Network
          </h1>
        </div>

        <div className="flex border-b border-cardBorder mb-4">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "following"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => setActiveTab("following")}
            data-testid="followingButton"
          >
            Following 
          </button>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "followers"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers 
          </button>
        </div>

        {loading && page === 1 ? (
          <p className="text-center text-textPlaceholder mt-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-error mt-4">{error}</p>
        ) : activeTab === "following" ? (
          <div>
            <p className="text-sm text-textPlaceholder mb-4">
              You are following {following.length} people
            </p>

            <div className="pt-2">
              {following.length > 0 ? (
                following.map((user, index) => (
                  <div
                    key={`${user.userId}-${index}`}
                    ref={index === following.length - 1 ? lastElementRef : null}
                    className="mb-4 pb-4 border-b border-cardBorder"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-3 w-full sm:w-3/4 overflow-hidden">
                        <img
                          src={user.profilePicture || defaultProfilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-textHeavyTitle">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-textActivity truncate">
                            {user.headline}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => promptUnfollow(user)}
                        data-testid="followingButton2"
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-textActivity border-2 border-itemBorder hover:border-itemBorderHover rounded-full hover:bg-buttonIconHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Following
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-textPlaceholder p-4 text-center">
                  You're not following anyone yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-textPlaceholder mb-4">
              {followers.length} people are following you
            </p>

            {followers.length > 0 ? (
              followers.map((user, index) => (
                <div
                  key={`${user.userId}-${index}`}
                  ref={index === followers.length - 1 ? lastElementRef : null}
                  className="mb-4 pb-4 border-b border-cardBorder"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-3 w-full sm:w-3/4 overflow-hidden">
                      <img
                        src={request.profilePicture || defaultProfilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-textHeavyTitle">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-textActivity truncate">
                          {user.headline}
                        </p>
                      </div>
                    </div>
                    {isFollowing(user.userId) ? (
                      <button
                        onClick={() => promptUnfollow(user)}
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-textActivity border-2 border-itemBorder hover:border-itemBorderHover rounded-full hover:bg-buttonIconHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user)}
                        className="px-4 py-1 sm:px-5 sm:py-2 text-sm font-semibold text-buttonSubmitEnable border-2 border-buttonSubmitEnable hover:border-buttonSubmitEnableHover rounded-full hover:bg-buttonSubmitEnableHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-textPlaceholder p-4 text-center">
                You don't have any followers yet.
              </p>
            )}
          </div>
        )}

        {loading && page > 1 && (
          <div className="flex justify-center p-4">
            <div className="loader">Loading more...</div>
          </div>
        )}

        {!hasMore && (following.length > 0 || followers.length > 0) && (
          <div className="text-center p-4 text-header">
            You've reached the end of your {activeTab} list
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPage;
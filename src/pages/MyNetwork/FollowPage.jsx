import React, { useState, useEffect, useRef, useCallback } from "react";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";

const FollowPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("following");
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState({
    following: true,
    followers: true,
  });
  const [page, setPage] = useState({
    following: 1,
    followers: 1,
  });
  const limit = 10; // Increased from 5 to 10 for better user experience

  const observer = useRef();
  const isFetching = useRef(false);

  // Intersection Observer callback for infinite scroll
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore[activeTab] &&
          !isFetching.current
        ) {
          setPage((prev) => ({ ...prev, [activeTab]: prev[activeTab] + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, activeTab],
  );

  // Fetch data when activeTab or page changes
  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current) return;

      setLoading(true);
      setError(null);
      isFetching.current = true;

      try {
        const endpoint =
          activeTab === "following"
            ? "/connections/following"
            : "/connections/followers";

        const currentPage = page[activeTab];
        const response = await axiosInstance.get(endpoint, {
          params: { page: currentPage, limit },
        });

        const newData = response.data;

        if (newData.length < limit) {
          setHasMore((prev) => ({ ...prev, [activeTab]: false }));
        }

        if (currentPage === 1) {
          activeTab === "following"
            ? setFollowing(newData)
            : setFollowers(newData);
        } else {
          activeTab === "following"
            ? setFollowing((prev) => [...prev, ...newData])
            : setFollowers((prev) => [...prev, ...newData]);
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

  // Reset data when tab changes
  const resetTabData = (tab) => {
    if (tab === "following") {
      setFollowing([]);
      setPage((prev) => ({ ...prev, following: 1 }));
      setHasMore((prev) => ({ ...prev, following: true }));
    } else {
      setFollowers([]);
      setPage((prev) => ({ ...prev, followers: 1 }));
      setHasMore((prev) => ({ ...prev, followers: true }));
    }
  };

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      resetTabData(tab);
      setActiveTab(tab);
    }
  };

  const promptUnfollow = (user) => {
    setUserToUnfollow(user);
    setShowUnfollowModal(true);
  };

  const handleNameClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const closeConfirmation = () => {
    setShowUnfollowModal(false);
  };

  const handleUnfollow = async () => {
    if (!userToUnfollow) return;

    try {
      await axiosInstance.delete(
        `/connections/unfollow/${userToUnfollow.userId}`,
      );
      setFollowing((prev) =>
        prev.filter((user) => user.userId !== userToUnfollow.userId),
      );
      setShowUnfollowModal(false);
      setUserToUnfollow(null);
    } catch (error) {
      setError("Failed to unfollow user.");
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollow = async (user) => {
    try {
      await axiosInstance.post(
        "/connections/follow",
        { userId: user.userId },
        { headers: { "Content-Type": "application/json" } },
      );

      // Refresh both lists to keep data consistent
      const [followingRes, followersRes] = await Promise.all([
        axiosInstance.get("/connections/following", {
          params: { page: 1, limit: limit * page.following },
        }),
        axiosInstance.get("/connections/followers", {
          params: { page: 1, limit: limit * page.followers },
        }),
      ]);

      setFollowing(followingRes.data);
      setFollowers(followersRes.data);
      setHasMore({
        following: followingRes.data.length >= limit * page.following,
        followers: followersRes.data.length >= limit * page.followers,
      });
    } catch (error) {
      setError("Failed to follow user.");
      console.error("Error following user:", error);
    }
  };

  const isFollowing = (userId) => {
    return following.some((user) => user.userId === userId);
  };

  const currentData = activeTab === "following" ? following : followers;
  const currentCount =
    activeTab === "following" ? following.length : followers.length;

  return (
    <div className="min-h-screen bg-mainBackground p-4 sm:p-6">
      {/* Unfollow Confirmation Modal */}
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
              You are about to unfollow {userToUnfollow.firstName}{" "}
              {userToUnfollow.lastName}
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={closeConfirmation}
                className="px-3 py-1 border-2 border-buttonSubmitEnable text-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-3xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUnfollow}
                className="px-3 py-1 bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText rounded-3xl text-sm"
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

        {/* Tab Navigation */}
        <div className="flex border-b border-cardBorder mb-4">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "following"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => handleTabChange("following")}
          >
            Following
          </button>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "followers"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => handleTabChange("followers")}
          >
            Followers
          </button>
        </div>

        {/* Content Area */}
        {loading && page[activeTab] === 1 ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-listSelected"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-error">
            {error}
            <button
              onClick={() => setPage((prev) => ({ ...prev, [activeTab]: 1 }))}
              className="ml-2 text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            {currentData.length > 0 ? (
              <div className="divide-y divide-cardBorder">
                {currentData.map((user, index) => (
                  <div
                    key={`${user.userId}-${index}`}
                    ref={
                      index === currentData.length - 1 ? lastElementRef : null
                    }
                    className="py-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-3 w-full sm:w-3/4 overflow-hidden">
                        <img
                          src={user.profilePicture || defaultProfilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultProfilePicture;
                          }}
                        />
                        <div className="min-w-0">
                          <h3
                            className="font-bold text-textHeavyTitle truncate hover:underline"
                            onClick={() => handleNameClick(user.userId)}
                          >
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-textActivity truncate">
                            {user.headline || "No headline provided"}
                          </p>
                        </div>
                      </div>
                      {activeTab === "following" ? (
                        <button
                          onClick={() => promptUnfollow(user)}
                          className="px-4 py-2 text-sm font-semibold text-textActivity border-2 border-itemBorder hover:border-itemBorderHover rounded-full hover:bg-buttonIconHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                        >
                          Following
                        </button>
                      ) : isFollowing(user.userId) ? (
                        <button
                          onClick={() => promptUnfollow(user)}
                          className="px-4 py-2 text-sm font-semibold text-textActivity border-2 border-itemBorder hover:border-itemBorderHover rounded-full hover:bg-buttonIconHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(user)}
                          className="px-4 py-2 text-sm font-semibold text-buttonSubmitEnable border-2 border-buttonSubmitEnable hover:border-buttonSubmitEnableHover rounded-full hover:bg-buttonSubmitEnableHover hover:font-bold shrink-0 transition-all w-full sm:w-auto text-center"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-textPlaceholder">
                {activeTab === "following"
                  ? "You're not following anyone yet."
                  : "You don't have any followers yet."}
              </div>
            )}
          </div>
        )}

        {/* Loading more indicator */}
        {loading && page[activeTab] > 1 && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-listSelected"></div>
          </div>
        )}

        {/* End of list indicator */}
        {!hasMore[activeTab] && currentData.length > 0 && (
          <div className="text-center p-4 text-textPlaceholder">
            You've reached the end of your {activeTab} list
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPage;

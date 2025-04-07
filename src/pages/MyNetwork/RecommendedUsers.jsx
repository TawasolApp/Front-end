import React, { useState, useEffect, useRef, useCallback } from "react";
import { axiosInstance } from "../../apis/axios";

const RecommendedUsers = ({ onConnect, sentRequests }) => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 9; // Items per load

  const observer = useRef();
  const isFetching = useRef(false);

  // Fetch initial recommended users
  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const response = await axiosInstance.get("/connections/recommended", {
          params: { page: 1, limit: 8 } // Initial load of 8 items
        });
        setRecommendedUsers(response.data);
        setHasMore(response.data.length === 8); // If we got 8, there might be more
      } catch (err) {
        setError("Failed to load recommended users.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, []);

  // Infinite scroll observer for modal
  const lastUserElementRef = useCallback(
    (node) => {
      if (modalLoading || !showModal) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          loadMoreUsers();
        }
      });

      if (node) observer.current.observe(node);
    },
    [modalLoading, hasMore, showModal]
  );

  // Function to load more users when modal is open
  const loadMoreUsers = async () => {
    if (!hasMore || modalLoading || isFetching.current) return;

    try {
      setModalLoading(true);
      isFetching.current = true;
      const nextPage = page + 1;

      const response = await axiosInstance.get("/connections/recommended", {
        params: { page: nextPage, limit }
      });

      const newUsers = response.data;
      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        setRecommendedUsers((prev) => [...prev, ...newUsers]);
        setPage(nextPage);
        setHasMore(newUsers.length === limit); // If we got full limit, there might be more
      }
    } catch (err) {
      setError("Failed to load more users.");
    } finally {
      setModalLoading(false);
      isFetching.current = false;
    }
  };

  const isRequestSent = (userId) => {
    return sentRequests.some((request) => request.userId === userId);
  };

  const handleShowAll = () => {
    setShowModal(true);
    // Reset pagination when opening modal
    if (recommendedUsers.length <= 8) {
      loadMoreUsers();
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const visibleUsers = recommendedUsers.slice(0, 8);

  return (
    <>
      <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-cardBorder">
          <h2 className="text-m font-semibold text-textHeavyTitle">
            People you may know based on your recent activity
          </h2>
          <button
            onClick={handleShowAll}
            className="text-sm text-buttonSubmitEnable hover:underline"
          >
            Show all
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-textPlaceholder">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-error">{error}</div>
        ) : visibleUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {visibleUsers.map((user) => (
              <div
                key={user.userId}
                className="bg-cardBackgroundHover p-3 rounded-lg border border-cardBorder hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h3 className="font-semibold text-textHeavyTitle truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-textPlaceholder line-clamp-2">
                      {user.headline}
                    </p>
                  </div>
                  <button
                    onClick={() => onConnect(user.userId)}
                    className={`w-full mt-2 px-4 py-1 text-sm font-medium rounded-3xl transition-colors ${
                      isRequestSent(user.userId)
                        ? "text-textActivity hover:bg-buttonIconHover"
                        : "text-buttonSubmitEnable border-2 border-buttonSubmitEnable hover:bg-buttonSubmitEnableHover"
                    }`}
                  >
                    {isRequestSent(user.userId) ? "Pending" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-textPlaceholder">
            No recommended users found
          </div>
        )}
      </div>

      {/* Modal with infinite scroll */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-cardBackground rounded-lg shadow-xl w-[90%] max-w-3xl h-[80vh] overflow-hidden border border-cardBorder flex flex-col">
            <div className="sticky top-0 bg-cardBackground border-b border-cardBorder px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-textHeavyTitle">
                People you may know
              </h2>
              <button
                className="text-gray-500 text-xl hover:text-red-600"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                {recommendedUsers.map((user, index) => (
                  <div
                    key={`${user.userId}-${index}`}
                    ref={index === recommendedUsers.length - 1 ? lastUserElementRef : null}
                    className="bg-cardBackgroundHover p-2 rounded-lg border border-cardBorder hover:shadow-md transition-shadow flex flex-col justify-between h-[170px]"
                  >
                    <div className="flex flex-col items-center text-center space-y-1">
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="w-full px-1">
                        <h3 className="font-semibold text-sm text-textHeavyTitle truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-textPlaceholder line-clamp-2">
                          {user.headline}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onConnect(user.userId)}
                      className={`w-full mt-2 px-2 py-1 text-sm font-medium rounded-3xl transition-colors ${
                        isRequestSent(user.userId)
                          ? "text-textActivity hover:bg-buttonIconHover"
                          : "text-buttonSubmitEnable border-2 border-buttonSubmitEnable hover:bg-buttonSubmitEnableHover"
                      }`}
                    >
                      {isRequestSent(user.userId) ? "Pending" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
              {modalLoading && (
                <div className="flex justify-center p-4">
                  <div className="loader">Loading more users...</div>
                </div>
              )}
              {!hasMore && recommendedUsers.length > 0 && (
                <div className="text-center p-4 text-textPlaceholder">
                  You've seen all recommended users
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedUsers;
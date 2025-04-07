import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import LoadingPage from "../../../LoadingScreen/LoadingPage";

function FollowersModal({ show, onClose, companyId }) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch followers with pagination
  const fetchFollowers = async () => {
    if (loading || !hasMore) return; // Prevent fetching if already loading or no more data

    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/companies/${companyId}/followers?page=${page}&limit=3`
      );

      setFollowers((prev) => [...prev, ...data]);

      if (data.length < 3) {
        setHasMore(false); // No more followers
      }

      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setFollowers([]); // Reset followers when modal is opened
      setPage(1);
      setHasMore(true);
      setError(null);
      fetchFollowers(); // Fetch followers on modal open
    }
  }, [show, companyId]);

  // Load more button click handler
  const handleLoadMore = () => {
    fetchFollowers();
  };
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-modalbackground backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-boxbackground rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[85vh] overflow-y-auto shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-text">
            Followers
          </h2>
          <button onClick={onClose} className="text-text text-xl">
            ✖
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingPage />
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : followers.length === 0 ? (
          <p className="text-companysubheader text-sm">No followers yet.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {followers.map((follower) => (
                <li
                  key={follower.userId}
                  className="flex items-center gap-4 border border-companysubheader p-3 rounded-md"
                >
                  <img
                    src={follower.profilePicture}
                    alt={follower.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-text font-medium text-sm sm:text-base">
                      {follower.firstName} {follower.lastName}
                    </span>
                    <span className="text-sm text-companysubheader">
                      {follower.headline}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FollowersModal;

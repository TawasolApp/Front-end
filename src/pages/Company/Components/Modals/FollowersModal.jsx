import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import LoadingPage from "../../../LoadingScreen/LoadingPage";

function FollowersModal({ show, onClose, companyId }) {
  const [page] = useState(1);
  const limit = 10;
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";

      const fetchFollowers = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axiosInstance.get(
            `/companies/${companyId}/followers`,
            { params: { page, limit } }
          );

          setFollowers(response.data);
        } catch (err) {
          setError("Failed to load followers.");
          setFollowers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFollowers();
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, companyId]);

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
        )}
      </div>
    </div>
  );
}

export default FollowersModal;

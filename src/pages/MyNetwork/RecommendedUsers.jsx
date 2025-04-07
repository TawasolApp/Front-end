// RecommendedUsers.jsx
import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../apis/axios";

const RecommendedUsers = ({ onConnect, sentRequests }) => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  });

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const response = await axiosInstance.get("/connections/recommended", {
          params: {
            page: pagination.page,
            limit: pagination.limit
          }
        });
        setRecommendedUsers(response.data);
      } catch (err) {
        setError("Failed to load recommended users.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, [pagination.page, pagination.limit]);

  const isRequestSent = (userId) => {
    return sentRequests.some(request => request.userId === userId);
  };

  return (
    <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder overflow-hidden">
      <div className="p-6 border-b border-cardBorder">
        <h2 className="text-m font-semibold text-textHeavyTitle">
          People you may know based on your recent activity
        </h2>
      </div>

      {loading ? (
        <div className="p-6 text-center text-textPlaceholder">Loading...</div>
      ) : error ? (
        <div className="p-6 text-center text-error">{error}</div>
      ) : recommendedUsers.length > 0 ? (
        <div className="divide-y divide-cardBorder">
          {recommendedUsers.map((user) => (
            <div key={user.userId} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-textHeavyTitle">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-textPlaceholder">
                      {user.headline}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onConnect(user.userId)}
                  className={`px-4 py-2 text-sm font-medium rounded-3xl transition-colors ${
                    isRequestSent(user.userId)
                      ? "text-textActivity hover:bg-buttonIconHover"
                      : "text-buttonSubmitEnable bg-cardBackground border-2 border-buttonSubmitEnable hover:bg-buttonSubmitEnableHover"
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

      {/* Pagination Controls */}
      {recommendedUsers.length > 0 && (
        <div className="flex justify-center p-4 border-t border-cardBorder">
          <button
            onClick={() => setPagination(prev => ({...prev, page: prev.page - 1}))}
            disabled={pagination.page === 1}
            className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page}
          </span>
          <button
            onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
            disabled={recommendedUsers.length < pagination.limit}
            className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendedUsers;
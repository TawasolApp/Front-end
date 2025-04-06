import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

const ManageConnections = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "received") {
          const response = await axiosInstance.get("/connections/pending", {
            params: {
              page: pagination.page,
              limit: pagination.limit
            }
          });
          setPendingRequests(response.data);
        } else {
          const response = await axiosInstance.get("/connections/sent", {
            params: {
              page: pagination.page,
              limit: pagination.limit
            }
          });
          setSentRequests(response.data);
        }
      } catch (err) {
        setError(`Failed to load ${activeTab} requests.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, pagination.page, pagination.limit]);

  const handleAccept = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: true });
      setPendingRequests(prev => prev.filter(request => request.userId !== userId));
    } catch (error) {
      console.error("Failed to accept connection:", error);
      setError("Failed to accept connection. Please try again.");
    }
  };

  const handleIgnore = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: false });
      setPendingRequests(prev => prev.filter(request => request.userId !== userId));
    } catch (error) {
      console.error("Failed to ignore connection:", error);
      setError("Failed to ignore connection. Please try again.");
    }
  };

  const handleWithdraw = async (userId) => {
    
      setError("Failed to withdraw request. Please try again.");
    
  };

  return (
    <div className="min-h-screen bg-mainBackground p-4 sm:p-6">
      <div className="bg-cardBackground p-4 sm:p-6 rounded-lg shadow-md w-full mx-auto max-w-full sm:max-w-[900px] border border-cardBorder">
        <div className="border-b border-cardBorder pb-4 mb-4">
          <div className="flex items-center justify-start">
            <h1 className="text-lg font-semibold text-textHeavyTitle">
              Manage Invitations
            </h1>
          </div>
        </div>

        <div className="flex border-b border-cardBorder mb-4">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "received"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => {
              setActiveTab("received");
              setPagination(prev => ({...prev, page: 1}));
            }}
          >
            Received 
          </button>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "sent"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => {
              setActiveTab("sent");
              setPagination(prev => ({...prev, page: 1}));
            }}
          >
            Sent 
          </button>
        </div>

        {loading ? (
          <p className="text-center text-textPlaceholder mt-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-error mt-4">{error}</p>
        ) : activeTab === "received" ? (
          <div>
            {pendingRequests.length > 0 ? (
              <div className="space-y-0">
                {pendingRequests.map((request, index) => (
                  <div key={request.userId}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.profilePicture}
                            alt={`${request.firstName} ${request.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-textHeavyTitle">
                              {request.firstName} {request.lastName}
                            </h3>
                            <p className="text-sm text-textPlaceholder">
                              {request.headline}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleIgnore(request.userId)}
                            className="px-4 py-2 text-sm font-medium text-textActivity hover:bg-buttonIconHover rounded-3xl transition-colors"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => handleAccept(request.userId)}
                            className="px-4 py-2 text-sm font-medium text-buttonSubmitEnable bg-cardBackground border-2 border-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-3xl transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                    {index !== pendingRequests.length - 1 && (
                      <div className="border-t border-cardBorder"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-textPlaceholder p-6 text-center">
                No pending invitations
              </p>
            )}
          </div>
        ) : (
          <div>
            {sentRequests.length > 0 ? (
              <div className="space-y-0">
                {sentRequests.map((request, index) => (
                  <div key={request.userId}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.profilePicture}
                            alt={`${request.firstName} ${request.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-textHeavyTitle">
                              {request.firstName} {request.lastName}
                            </h3>
                            <p className="text-sm text-textPlaceholder">
                              {request.headline}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleWithdraw(request.userId)}
                          className="px-4 py-2 text-sm font-medium text-textActivity hover:bg-buttonIconHover rounded-3xl transition-colors"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                    {index !== sentRequests.length - 1 && (
                      <div className="border-t border-cardBorder"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-textPlaceholder p-6 text-center">
                No sent requests
              </p>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
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
            disabled={(activeTab === "received" ? pendingRequests : sentRequests).length < pagination.limit}
            className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageConnections;
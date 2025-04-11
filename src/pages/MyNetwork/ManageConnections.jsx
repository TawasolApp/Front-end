import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";

const ManageConnections = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const observer = useRef();
  const isFetching = useRef(false);
  const navigate = useNavigate();

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
    [loading, hasMore],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current) return;

      setLoading(true);
      setError(null);
      isFetching.current = true;

      try {
        const endpoint =
          activeTab === "received"
            ? "/connections/pending"
            : "/connections/sent";

        const response = await axiosInstance.get(endpoint, {
          params: { page, limit },
        });

        const newData = response.data;

        if (newData.length === 0) {
          setHasMore(false);
        } else {
          if (page === 1) {
            activeTab === "received"
              ? setPendingRequests(newData)
              : setSentRequests(newData);
          } else {
            activeTab === "received"
              ? setPendingRequests((prev) => [...prev, ...newData])
              : setSentRequests((prev) => [...prev, ...newData]);
          }
        }
      } catch (err) {
        setError(`Failed to load ${activeTab} requests.`);
        console.error(err);
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
    setPendingRequests([]);
    setSentRequests([]);
  }, [activeTab]);

  const handleAccept = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: true });
      setPendingRequests((prev) =>
        prev.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      setError("Failed to accept connection. Please try again.");
    }
  };

  const handleNameClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleIgnore = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: false });
      setPendingRequests((prev) =>
        prev.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      setError("Failed to ignore connection. Please try again.");
    }
  };

  const handleWithdraw = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/${userId}/pending`);
      setSentRequests((prev) =>
        prev.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      setError("Failed to withdraw connection request. Please try again.");
    }
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
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base ${
              activeTab === "sent"
                ? "text-listSelected border-b-2 border-listSelected"
                : "text-textPlaceholder"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent
          </button>
        </div>

        {loading && page === 1 ? (
          <p className="text-center text-textPlaceholder mt-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-error mt-4">{error}</p>
        ) : activeTab === "received" ? (
          <div>
            {pendingRequests.length > 0 ? (
              <div className="space-y-0">
                {pendingRequests.map((request, index) => (
                  <div
                    key={`${request.userId}-${index}`}
                    ref={
                      index === pendingRequests.length - 1
                        ? lastElementRef
                        : null
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              request.profilePicture || defaultProfilePicture
                            }
                            alt={`${request.firstName} ${request.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3
                              className="font-semibold text-textHeavyTitle hover:underline"
                              onClick={() => handleNameClick(request.userId)}
                            >
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
                  <div
                    key={`${request.userId}-${index}`}
                    ref={
                      index === sentRequests.length - 1 ? lastElementRef : null
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              request.profilePicture || defaultProfilePicture
                            }
                            alt={`${request.firstName} ${request.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3
                              className="font-semibold text-textHeavyTitle hover:underline"
                              onClick={() => handleNameClick(request.userId)}
                            >
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

        {loading && page > 1 && (
          <div className="flex justify-center p-4">
            <div className="loader">Loading more...</div>
          </div>
        )}

        {!hasMore &&
          (pendingRequests.length > 0 || sentRequests.length > 0) && (
            <div className="text-center p-4 text-header">
              You've reached the end of your {activeTab} requests
            </div>
          )}
      </div>
    </div>
  );
};

export default ManageConnections;

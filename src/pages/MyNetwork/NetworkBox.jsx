import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import PeopleIcon from "@mui/icons-material/People";
import BlockIcon from "@mui/icons-material/Block";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import RecommendedUsers from "./RecommendedUsers";
import defaultProfilePicture from "../../assets/images/defaultProfilePicture.png";

const NetworkBox = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  });
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPagination(prev => ({
          ...prev,
          page: prev.page + 1
        }));
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        const [pendingRes, sentRes] = await Promise.all([
          axiosInstance.get("/connections/pending", {
            params: {
              page: pagination.page,
              limit: pagination.limit
            }
          }),
          axiosInstance.get("/connections/sent", {
            params: {
              page: pagination.page,
              limit: pagination.limit
            }
          })
        ]);

        setPendingRequests(prev => [...prev, ...pendingRes.data]);
        setSentRequests(sentRes.data);
        setHasMore(pendingRes.data.length === pagination.limit);
      } catch (err) {
        setError("Failed to load connection requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [pagination.page, pagination.limit]);

  const handleAccept = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, {
        isAccept: true,
      });
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      console.error(
        "Failed to accept connection:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleIgnore = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: false });
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId),
      );
    } catch (error) {
      console.error(
        "Failed to ignore connection:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleConnect = async (userId) => {
    try {
      // Check if request already sent
      const isAlreadySent = sentRequests.some(request => request.userId === userId);
      
      if (isAlreadySent) {
        // Immediately remove from UI
        setSentRequests(prev => prev.filter(request => request.userId !== userId));
        await axiosInstance.delete(`/connections/${userId}/pending`);
      } else {
        // Immediately add to sent requests in UI (with minimal data)
        setSentRequests(prev => [...prev, { userId }]);
        await axiosInstance.post("/connections", { userId });
      }
  
      // Refresh both pending and sent connections
      const [pendingRes, sentRes] = await Promise.all([
        axiosInstance.get("/connections/pending", {
          params: {
            page: 1,
            limit: pagination.limit * pagination.page
          }
        }),
        axiosInstance.get("/connections/sent", {
          params: {
            page: 1,
            limit: pagination.limit * pagination.page
          }
        })
      ]);
  
      setPendingRequests(pendingRes.data);
      setSentRequests(sentRes.data);
  
    } catch (error) {
      console.error(
        "Failed to handle connection:",
        error.response?.data?.message || error.message,
      );
      // Revert UI changes if request fails
      setSentRequests(prev => isAlreadySent 
        ? [...prev, { userId }] 
        : prev.filter(request => request.userId !== userId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-mainBackground p-8 flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <div className="bg-cardBackground p-6 rounded-lg shadow-md border border-cardBorder w-full sm:w-[360px] h-fit">
          <h2 className="text-xl font-bold mb-6 text-textHeavyTitle">
            Manage my network
          </h2>

          <div className="space-y-2">
            <div
              onClick={() => navigate("/connections")}
              className="flex items-center p-4 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors"
            >
              <PeopleIcon className="text-textActivity text-2xl mr-4" />
              <span className="text-textActivity font-medium">
                Connections
              </span>
            </div>

            <div
              onClick={() => navigate("/follow")}
              className="flex items-center p-4 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors"
            >
              <SwitchAccountIcon className="text-textActivity text-2xl mr-4" />
              <span className="text-textActivity font-medium">
                Following & Followers
              </span>
            </div>

            <div
              onClick={() => navigate("/blocked")}
              className="flex items-center p-4 hover:bg-cardBackgroundHover rounded-lg cursor-pointer transition-colors"
            >
              <BlockIcon className="text-textActivity text-2xl mr-4" />
              <span className="text-textActivity font-medium">
                Blocked
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder overflow-hidden">
            <div className="p-6 border-b border-cardBorder flex justify-between items-center">
              <h2 className="text-xl font-semibold text-textHeavyTitle">
                Invitations{" "}
                <span className="text-textPlaceholder">
                  ({pendingRequests.length})
                </span>
              </h2>
              <Link 
                to="/manage-connections"
                className="px-4 py-2 text-medium font-medium text-textActivity hover:bg-buttonIconHover rounded-3xl transition-colors"
              >
                Manage
              </Link>
            </div>

            {loading && pagination.page === 1 ? (
              <div className="p-6 text-center text-textPlaceholder">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-error">{error}</div>
            ) : pendingRequests.length > 0 ? (
              <div className="divide-y divide-cardBorder">
                {pendingRequests.map((request, index) => {
                  const isLast = index === pendingRequests.length - 1;
                  return (
                    <div
                      key={request.userId}
                      className="p-6"
                      ref={isLast ? lastElementRef : null}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.profilePicture || defaultProfilePicture}
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
                  );
                })}
                {loading && (
                  <div className="p-6 text-center text-textPlaceholder">Loading more...</div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-textPlaceholder">
                No pending invitations
              </div>
            )}
          </div>

          <RecommendedUsers 
            onConnect={handleConnect} 
            sentRequests={sentRequests} 
          />

          <div className="bg-cardBackground rounded-lg shadow-md border border-cardBorder p-6">
            <h2 className="text-xl font-bold mb-3 text-textHeavyTitle">
              Grow your career faster
            </h2>
            <p className="text-textContent mb-3">
              Stand out for a role with personalized cover letters and resume
              tips.
            </p>
            <p className="text-textPlaceholder mb-4">
              Millions of members use Premium
            </p>
            <button className="px-4 py-2 bg-amberLight hover:bg-amberLightHover text-amberTextLight dark:text-amberTextDark font-medium rounded-lg transition-colors">
              Try Premium for EGPO
            </button>
            <p className="text-textPlaceholder mt-3 text-sm">
              1-month free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkBox;

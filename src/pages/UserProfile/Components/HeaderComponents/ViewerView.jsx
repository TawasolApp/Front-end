import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance as axios } from "../../../../apis/axios.js";
import ConfirmModal from "../ReusableModals/ConfirmModal.jsx";
import ReportBlockModal from "../ReportAndBlockModals/ReportBlockModal.jsx";
import NewMessageModal from "../../../Messaging/New Message Modal/NewMessageModal.jsx";
import FlagIcon from "@mui/icons-material/Flag";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import { toast } from "react-toastify";

function ViewerView({
  user,
  viewerId,
  initialConnectStatus,
  initialFollowStatus,
}) {
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(false);

  const [connectStatus, setConnectStatus] = useState(initialConnectStatus);
  const [isFollowing, setIsFollowing] = useState(
    initialFollowStatus === "Following" || initialConnectStatus === "Connection"
  );
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (connectStatus === "Connection") {
      setIsFollowing(true);
    } else if (connectStatus === "No Connection") {
      setIsFollowing(false);
    }
  }, [connectStatus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // if (isBlocking) {
  //   return <LoadingPage message="Redirecting to feed..." />;
  // }

  const connectionStatusLabel = {
    Connection: "Connected",
    Pending: "Pending",
    Request: "Accept", // Changed from "Request" to "Accept" for better UX
    "No Connection": "Connect",
  };

  const handleFollow = async () => {
    if (!isFollowing) {
      try {
        const res = await axios.post("/connections/follow", {
          userId: user._id,
        });
        console.log("Followed successfully:", res.data);
        // toast.success("You are now following this user.");
        setIsFollowing(true);
      } catch (err) {
        console.error("Follow error:", err.response?.data || err.message);
        // toast.error("Failed to follow user.");
      }
    } else {
      setShowUnfollowModal(true);
    }
  };

  const confirmUnfollow = async () => {
    try {
      const res = await axios.delete(`/connections/unfollow/${user._id}`);
      console.log("Unfollowed successfully:", res.status);
      toast.success("You have unfollowed this user.");
      setIsFollowing(false);
    } catch (err) {
      console.error("Unfollow error:", err.response?.data || err.message);
      toast.error("Failed to unfollow user.");
    } finally {
      setShowUnfollowModal(false);
    }
  };
  const handleConnect = async () => {
    try {
      if (connectStatus === "Connection") {
        // Handle disconnection
        await axios.delete(`/connections/${user._id}`);
        setConnectStatus("No Connection"); // Update state immediately
        toast.success("Connection removed.");

        // Try to unfollow after disconnecting, but ignore 404 errors
        try {
          await axios.delete(`/connections/unfollow/${user._id}`);
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Unfollow error:", err.response?.data || err.message);
          }
        }
        setIsFollowing(false);
      } else if (connectStatus === "No Connection") {
        // Send connection request
        const res = await axios.post("/connections", {
          userId: user._id,
        });
        if (res.status === 201) {
          console.log("Connection request sent:", res.data);
          toast.success("Connection request sent.");

          setConnectStatus("Pending"); // Update state immediately
        }
      } else if (connectStatus === "Request") {
        // Show modal for accepting connection request
        setShowAcceptModal(true);
      } else if (connectStatus === "Pending") {
        // Handle canceling a pending request
        await axios.delete(`/connections/${user._id}/pending`);
        setConnectStatus("No Connection"); // Update state immediately after successful deletion
        toast.success("Your invitation to connect was withdrawn");
      }
    } catch (err) {
      console.error("Connection error:", err.response?.data || err.message);
      if (err.response?.status === 409) {
        alert("Connection request already exists");
      }
    }
  };
  const confirmAcceptConnection = async () => {
    try {
      // Optimistically update UI first
      setConnectStatus("Connection");
      setIsFollowing(true);
      setShowAcceptModal(false);

      // 1. First accept the connection
      const connectionRes = await axios.patch(`/connections/${user._id}`, {
        isAccept: true,
      });

      if (connectionRes.status !== 200) {
        throw new Error("Failed to accept connection");
      }

      // 2. Then follow the user (only if connection was successful)
      try {
        const followRes = await axios.post("/connections/follow", {
          userId: user._id,
        });

        if (followRes.status !== 201) {
          console.warn("Connection accepted but follow failed");
          // Don't revert connection status, just the follow state
          setIsFollowing(false);
        }
      } catch (followError) {
        console.warn(
          "Follow failed but connection succeeded:",
          followError.response?.data || followError.message
        );
        setIsFollowing(false);
      }

      console.log("Connection successfully accepted");
      toast.success("Connection accepted.");
    } catch (err) {
      // Revert everything if connection acceptance fails
      setConnectStatus("Request");
      setIsFollowing(false);
      console.error(
        "Accept connection error:",
        err.response?.data || err.message
      );
      toast.error("Failed to accept connection.");

      if (err.response?.status === 409) {
        alert("Connection already exists");
      } else {
        alert("Failed to accept connection");
      }
    }
  };

  const handleMessage = () => {
    setShowMessageModal(true);
  };

  return (
    <div
      data-testid="viewer-view"
      className=" flex gap-2 flex-wrap sm:flex-nowrap"
    >
      <button
        className="px-4 py-0 h-8 bg-blue-600 text-boxbackground   rounded-full text-sm"
        onClick={handleMessage}
        aria-label="Send message"
      >
        Message
      </button>

      <button
        className={`px-4 py-0 h-8 border rounded-full text-sm capitalize transition-all duration-300 ease-in-out ${
          ["Connection", "Pending", "Request"].includes(connectStatus)
            ? "bg-blue-600 text-boxbackground  "
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleConnect}
        aria-label={connectionStatusLabel[connectStatus] || "Connect"}
      >
        {connectionStatusLabel[connectStatus] || "Connect"}
      </button>

      {/* <button
        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ease-in-out ${
          isFollowing
            ? "bg-blue-600 text-boxbackground  "
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleFollow}
        aria-label={isFollowing ? "Unfollow user" : "Follow user"}
      >
        {isFollowing ? "✓ Following" : "+ Follow"}
      </button> */}

      {/* More dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="h-8 py-0 px-4 text-sm border border-text text-hoverOutlineColor rounded-full hover:outline hover:outline-1 hover:outline-text hover:bg-moreHoverBg transition duration-200"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          More
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => {
                handleFollow();
                setDropdownOpen(false);
              }}
              aria-label={isFollowing ? "Unfollow user" : "Follow user"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
              onClick={() => {
                setDropdownOpen(false);
                setShowReportModal(true);
              }}
              aria-label="Report or block this user"
            >
              <FlagIcon fontSize="small" />
              Report / Block
            </button>
          </div>
        )}
      </div>

      {/* Modals */}

      {showUnfollowModal && (
        <ConfirmModal
          title={`Unfollow ${user.firstName} ${user.lastName}`}
          message={`Stop seeing posts from ${user.firstName} on your feed. They won't be notified that you've unfollowed.`}
          isOpen={showUnfollowModal}
          onCancel={() => setShowUnfollowModal(false)}
          onConfirm={confirmUnfollow}
          confirmLabel="Unfollow"
          cancelLabel="Cancel"
        />
      )}
      {showAcceptModal && (
        <ConfirmModal
          title={`Accept Connection Request from ${user.firstName} ${user.lastName}`}
          message={`Would you like to connect with ${user.firstName} and see their posts in your feed?`}
          isOpen={showAcceptModal}
          onCancel={() => setShowAcceptModal(false)}
          onConfirm={confirmAcceptConnection}
          confirmLabel="Accept"
          cancelLabel="Cancel"
        />
      )}
      {/* <ReportBlockModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onBlock={() => {
          console.log("Block logic here");
          setShowReportModal(false);
        }}
        onReport={() => {
          console.log("Report logic here");
          setShowReportModal(false);
        }}
        fullName={`${user.firstName} ${user.lastName}`}
      /> */}
      <ReportBlockModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        fullName={`${user.firstName} ${user.lastName}`}
        userId={user._id} // the user being viewed (target)
        viewerId={viewerId} // logged-in user
        onBlocked={() => {
          // setIsBlocking(true); // show loading first
          setTimeout(() => navigate("/feed"), 1000); // then redirect
        }}
      />

      {showMessageModal && (
        <NewMessageModal
          recipient={user}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}

export default ViewerView;

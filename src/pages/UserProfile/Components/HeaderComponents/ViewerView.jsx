import React, { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import ConfirmModal from "../ReusableModals/ConfirmModal.jsx";

function ViewerView({
  user,
  viewerId,
  initialConnectStatus,
  initialFollowStatus,
}) {
  const [connectStatus, setConnectStatus] = useState(initialConnectStatus);
  const [isFollowing, setIsFollowing] = useState(
    initialFollowStatus === "Following" || initialConnectStatus === "Connection"
  );
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  useEffect(() => {
    if (connectStatus === "Connection") {
      setIsFollowing(true);
    } else if (connectStatus === "No Connection") {
      setIsFollowing(false);
    }
  }, [connectStatus]);

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
        setIsFollowing(true);
      } catch (err) {
        console.error("Follow error:", err.response?.data || err.message);
      }
    } else {
      setShowUnfollowModal(true);
    }
  };

  const confirmUnfollow = async () => {
    try {
      const res = await axios.delete(`/connections/unfollow/${user._id}`);
      console.log("Unfollowed successfully:", res.status);
      setIsFollowing(false);
    } catch (err) {
      console.error("Unfollow error:", err.response?.data || err.message);
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
          setConnectStatus("Pending"); // Update state immediately
        }
      } else if (connectStatus === "Request") {
        // Show modal for accepting connection request
        setShowAcceptModal(true);
      } else if (connectStatus === "Pending") {
        // Handle canceling a pending request
        await axios.delete(`/connections/${user._id}/pending`);
        setConnectStatus("No Connection"); // Update state immediately after successful deletion
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
      const res = await axios.patch(`/connections/${user._id}`, {
        isAccept: true,
      });
      if (res.status === 200) {
        console.log("Connection accepted:", res.data);
        setConnectStatus("Connection");
      }
    } catch (err) {
      console.error(
        "Accept connection error:",
        err.response?.data || err.message
      );
    } finally {
      setShowAcceptModal(false);
    }
  };

  const handleMessage = () => {
    console.log("Message clicked");
  };

  return (
    <div
      data-testid="viewer-view"
      className=" flex gap-2 flex-wrap sm:flex-nowrap"
    >
      <button
        className="px-4 py-2 bg-blue-600 text-boxbackground   rounded-full text-sm"
        onClick={handleMessage}
        aria-label="Send message"
      >
        Message
      </button>

      <button
        className={`px-4 py-2 border rounded-full text-sm capitalize transition-all duration-300 ease-in-out ${
          ["Connection", "Pending", "Request"].includes(connectStatus)
            ? "bg-blue-600 text-boxbackground  "
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleConnect}
        aria-label={connectionStatusLabel[connectStatus] || "Connect"}
      >
        {connectionStatusLabel[connectStatus] || "Connect"}
      </button>

      <button
        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ease-in-out ${
          isFollowing
            ? "bg-blue-600 text-boxbackground  "
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleFollow}
        aria-label={isFollowing ? "Unfollow user" : "Follow user"}
      >
        {isFollowing ? "✓ Following" : "+ Follow"}
      </button>

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
    </div>
  );
}

export default ViewerView;

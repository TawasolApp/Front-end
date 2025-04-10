import React, { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import ConfirmModal from "../GenericDisplay/ConfirmModal";

function ViewerView({ user, viewerId, initialStatus }) {
  const [isFollowing, setIsFollowing] = useState(initialStatus === "Following");
  const [status, setStatus] = useState(initialStatus);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  const connectionStatusLabel = {
    Connection: "Connected",
    Pending: "Pending",
    Request: "Accept", // Changed from "Request" to "Accept" for better UX
    "No Connection": "Connect",
  };

  useEffect(() => {
    if (status === "Connection") {
      setIsFollowing(true);
    }
  }, [status]);

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
      if (status === "Connection") {
        // Handle disconnection
        await axios.delete(`/connections/${user._id}`);
        setStatus("No Connection"); // Update state immediately
      } else if (status === "No Connection") {
        // Send connection request
        const res = await axios.post("/connections", {
          userId: user._id,
        });
        if (res.status === 201) {
          console.log("Connection request sent:", res.data);
          setStatus("Pending"); // Update state immediately
        }
      } else if (status === "Request") {
        // Show modal for accepting connection request
        setShowAcceptModal(true);
      } else if (status === "Pending") {
        // Handle canceling a pending request
        await axios.delete(`/connections/${user._id}/pending`);
        setStatus("No Connection"); // Update state immediately after successful deletion
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
        isAccept: true
      });
      if (res.status === 200) {
        console.log("Connection accepted:", res.data);
        setStatus("Connection");
      }
    } catch (err) {
      console.error("Accept connection error:", err.response?.data || err.message);
    } finally {
      setShowAcceptModal(false);
    }
  };

  const handleMessage = () => {
    console.log("Message clicked");
  };

  return (
    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <button
        className="px-4 py-2 bg-blue-600 text-boxheading rounded-full text-sm"
        onClick={handleMessage}
      >
        Message
      </button>

      <button
        className={`px-4 py-2 border rounded-full text-sm capitalize transition-all duration-300 ease-in-out ${
          ["Connection", "Pending", "Request"].includes(status)
            ? "bg-blue-600 text-white"
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleConnect}
      >
        {connectionStatusLabel[status] || "Connect"}
      </button>

      <button
        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ease-in-out ${
          isFollowing
            ? "bg-blue-600 text-boxheading"
            : "text-blue-600 border-blue-600"
        } hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleFollow}
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
    </div>
  );
}

export default ViewerView;
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
    Request: "Request",
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
        const res = await axios.delete(`/connections/${user._id}`);
        console.log("Disconnected successfully:", res.status);
        setStatus("No Connection");
      } else if (status === "No Connection") {
        const res = await axios.post("/connections", {
          userId: user._id,
        });
        console.log("Connection request sent:", res.data);
        setStatus("Pending");
      }
    } catch (err) {
      console.error("Connect error:", err.response?.data || err.message);
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
          message={`Stop seeing posts from ${user.firstName} on your feed. They won’t be notified that you’ve unfollowed.`}
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

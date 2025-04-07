import React, { useState, useEffect } from "react";
import axios from "axios";
// TODOs
//1) call connect/follow apis to patch/delete connections in handle connect--> Omar
//2)do message modal in handleMessage  ==>Khaled

function ViewerView({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Handle follow/unfollow logic
  useEffect(() => {
    if (!viewerId || !user?._id || viewerId === user._id) return;

    // check if current user is following this user
    // Check following status
    axios.get("/connections/following").then((res) => {
      const followed = res.data.some(
        (item) =>
          item.sending_party === viewerId &&
          item.receiving_party === user._id &&
          item.status === "Following"
      );
      setIsFollowing(followed);
    });

    // Check connection status
    axios.get("/connections").then((res) => {
      const connected = res.data.some(
        (item) =>
          item.sending_party === viewerId &&
          item.receiving_party === user._id &&
          item.status === "Connected"
      );
      setIsConnected(connected);
    });
  }, [user._id, viewerId]);

  // Follow handler
  const handleFollow = async () => {
    try {
      if (!isFollowing) {
        await axios.post("/connections/follow", {
          sending_party: viewerId,
          receiving_party: user._id,
          status: "Following",
        });
      } else {
        await axios.delete("/connections/follow", {
          data: {
            sending_party: viewerId,
            receiving_party: user._id,
            status: "Following",
          },
        });
      }
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow error:", err.response?.data || err.message);
    }
  };

  // Connect handler
  const handleConnect = async () => {
    try {
      if (!isConnected) {
        await axios.post("/connections", {
          sending_party: viewerId,
          receiving_party: user._id,
        });
      } else {
        await axios.delete(`/connections/${user._id}`);
      }
      setIsConnected((prev) => !prev);
    } catch (err) {
      console.error("Connect error:", err.response?.data || err.message);
    }
  };

  const handleMessage = () => {
    console.log("Message clicked");
  };

  return (
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm"
        onClick={handleMessage}
      >
        Message
      </button>

      {/* Connect Button */}
      <button
        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ease-in-out
        ${isConnected ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600"}
        hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleConnect}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>

      {/* Follow Button */}
      <button
        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ease-in-out
        ${isFollowing ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600"}
        hover:bg-blue-100 hover:text-blue-700`}
        onClick={handleFollow}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default ViewerView;

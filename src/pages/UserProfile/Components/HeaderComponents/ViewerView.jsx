import React, { useState } from "react";

// TODOs
//1) call connect/follow apis to patch/delete connections in handle connect--> Omar
//2)do message modal in handleMessage  ==>Khaled

function ViewerView({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Handle connect/disconnect logic
  const handleConnect = () => {
    setIsConnected((prevState) => !prevState);
    // Logic to connect or disconnect the user (can update API or state)
  };

  // Handle message button click
  const handleMessage = () => {
    console.log("Message clicked");
    // Logic for opening message modal
  };
  // Handle follow/unfollow logic
  const handleFollow = () => {
    setIsFollowing((prevState) => !prevState);
    // You can also call an API or update a global state (like Redux) to save the follow status
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

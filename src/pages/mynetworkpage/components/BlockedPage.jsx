import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BlockedPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State to manage blocked users
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: 1,
      imageUrl: "",
      username: "Ahmed Ali",
      experience: "Data Scientist at Microsoft",
    },
    {
      id: 2,
      imageUrl: "",
      username: "Mona Hassan",
      experience: "UI/UX Designer at Apple",
    },
  ]);

  // Function to handle "Unblock" button
  const handleUnblock = (id) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-[600px]">
        <h2 className="text-xl font-bold mb-4">Blocked Users</h2>

        {/* Display Blocked Users */}
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border-b border-gray-200"
            >
              <div className="flex items-center">
                <img
                  src={user.imageUrl}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.experience}</p>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(user.id)}
                className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blocked users</p>
        )}
      </div>
    </div>
  );
};

export default BlockedPage;
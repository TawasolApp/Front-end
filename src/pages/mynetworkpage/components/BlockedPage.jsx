import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block"; // Import the Block icon

const BlockedPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State to manage blocked users
  const [blockedUsers, setBlockedUsers] = useState([
    // Example blocked users (empty for testing)
    {
      id: 1,
      username: "Ahmed Ali",
    },
    {
      id: 2,
      username: "Mona Hassan",
    },
  ]);

  // Function to handle "Unblock" button
  const handleUnblock = (id) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  // Function to navigate back to the previous page
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-[700px] mx-auto">
        {/* Back Arrow */}
        <button
          onClick={handleBack}
          className="text-gray-500 hover:text-gray-700 mb-2 flex items-center text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-1">Blocking</h2> {/* Reduced margin-bottom */}

        {/* Dynamic Line */}
        <p className="text-sm text-gray-500 mb-4">
          You’re currently blocking {blockedUsers.length} person
          {blockedUsers.length !== 1 ? "s" : ""}.
        </p>

        {/* Display Blocked Users */}
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center">
                {/* Block Sign */}
                <BlockIcon className="text-black text-xs mr-1" /> {/* Smaller and black */}
                <p className="font-semibold">{user.username}</p>
              </div>
              <button
                onClick={() => handleUnblock(user.id)}
                className="px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg"
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-500 mb-4">You’re currently not blocking anyone.</p>
            <p className="text-sm text-gray-500">
              Need to block or report someone? Go to the profile of the person you want to block and select “Block/Report” from the drop-down menu at the top of the profile summary.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              After you’ve blocked the person, any previous profile views of yours and of the other person will disappear from each of your "Who‘s Viewed My Profile" sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedPage;
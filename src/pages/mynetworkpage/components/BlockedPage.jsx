import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block";

const BlockedPage = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, username: "Ahmed Ali" },
    { id: 2, username: "Mona Hassan" },
  ]);

  const handleUnblock = (id) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black p-4 sm:p-8">
      <div className="bg-white dark:bg-[#1e2229] p-4 sm:p-6 rounded-lg shadow-md w-full max-w-[700px] mx-auto border border-gray-200 dark:border-[#2a3038]">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-gray-500 dark:text-[#959ea9] hover:text-gray-700 dark:hover:text-white mb-2 flex items-center text-sm"
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
        <h2 className="text-lg font-bold dark:text-[#f0f2f5]">Blocking</h2>
        <p className="text-sm text-gray-500 dark:text-[#959ea9] mb-4">
          You're currently blocking {blockedUsers.length} person
          {blockedUsers.length !== 1 ? "s" : ""}.
        </p>

        {/* Blocked Users List */}
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-[#2a3038]"
            >
              <div className="flex items-center">
                <BlockIcon className="text-black dark:text-red-500 text-xs mr-1" />
                <p className="font-semibold dark:text-[#f0f2f5]">
                  {user.username}
                </p>
              </div>
              <button
                onClick={() => handleUnblock(user.id)}
                className="px-3 py-1 text-sm font-semibold text-blue-700 dark:text-[#3d7bc8] hover:bg-blue-50 dark:hover:bg-[#2a3038] rounded-lg"
              >
                Unblock
              </button>
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-500 dark:text-[#959ea9] mb-4">
              You're currently not blocking anyone.
            </p>
            <p className="text-sm text-gray-500 dark:text-[#c1c9d4]">
              Need to block or report someone? Go to their profile and select
              "Block/Report" from the menu.
            </p>
            <p className="text-sm text-gray-500 dark:text-[#c1c9d4] mt-2">
              Once blocked, any profile views will disappear from each other's
              "Who's Viewed My Profile" sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedPage;

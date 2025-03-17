import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People"; // Import the People icon
import BlockIcon from "@mui/icons-material/Block"; // Import the Block icon

const NetworkBox = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State to manage pending connection requests
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      imageUrl: "",
      username: "Omar Salah",
      experience: "Software Engineer at Google",
    },
    {
      id: 2,
      imageUrl: "",
      username: "Ziad Asar",
      experience: "Product Manager at Meta",
    },
  ]);

  // Function to handle "Accept" button
  const handleAccept = (id) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id));
    // Add logic to add the connection to your connections list
  };

  // Function to handle "Ignore" button
  const handleIgnore = (id) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8 flex items-center justify-center">
      <div className="flex space-x-6">
        {/* Existing Network Box */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xs self-start">
          {/* Title */}
          <h2 className="text-xl font-bold mb-4">Manage my network</h2>

          {/* Divider Line */}
          <hr className="border-t border-gray-200 mb-4" />

          {/* Connections Option with Material UI People Icon */}
          <div
            onClick={() => navigate("/connections")} // Navigate to /connections
            className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <div className="flex items-center">
              {/* Material UI People Icon */}
              <PeopleIcon className="text-gray-700 text-3xl mr-2" />
              <span className="text-gray-700">Connections</span>
            </div>
          </div>

          {/* Blocked Button with Material UI Block Icon */}
          <div
            onClick={() => navigate("/blocked")} // Navigate to /blocked
            className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer mt-2"
          >
            <div className="flex items-center">
              {/* Material UI Block Icon */}
              <BlockIcon className="text-gray-700 text-3xl mr-2" />
              <span className="text-gray-700">Blocked</span>
            </div>
          </div>
        </div>

        {/* Pending Requests Box - Expanded Horizontally */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-[600px]">
          <h2 className="text-xl font-bold mb-4">Pending Invitations</h2>

          {/* Display Pending Requests */}
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <img
                    src={request.imageUrl}
                    alt={request.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{request.username}</p>
                    <p className="text-sm text-gray-500">{request.experience}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleIgnore(request.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pending invitations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkBox;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import PeopleIcon from "@mui/icons-material/People";
import BlockIcon from "@mui/icons-material/Block";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

const NetworkBox = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get("/connections/pending");
        setPendingRequests(response.data);
      } catch (err) {
        setError("Failed to load pending requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAccept = async (userId) => {
    try {
      const response = await axiosInstance.patch(`/connections/${userId}`, { isAccept: true });
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId)
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Failed to accept connection:", error.response?.data?.message || error.message);
    }
  };
  
  const handleIgnore = async (userId) => {
    try {
      await axiosInstance.patch(`/connections/${userId}`, { isAccept: false });
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request.userId !== userId)
      );
      console.log(`Connection with userId ${userId} ignored successfully`);
    } catch (error) {
      console.error("Failed to ignore connection:", error.response?.data?.message || error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-stone-100 p-8 flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        
        {/* Left Sidebar: Manage My Network */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full sm:w-[360px] h-fit">
          <h2 className="text-xl font-bold mb-6">Manage my network</h2>
          
          <div className="space-y-2">
            {/* Connections */}
            <div
              onClick={() => navigate("/connections")}
              className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <PeopleIcon className="text-gray-700 text-2xl mr-4" />
              <span className="text-gray-700 font-medium">Connections</span>
            </div>

            {/* Following & Followers */}
            <div
              onClick={() => navigate("/follow")}
              className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <SwitchAccountIcon className="text-gray-700 text-2xl mr-4" />
              <span className="text-gray-700 font-medium">Following & Followers</span>
            </div>

            {/* Blocked */}
            <div
              onClick={() => navigate("/blocked")}
              className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <BlockIcon className="text-gray-700 text-2xl mr-4" />
              <span className="text-gray-700 font-medium">Blocked</span>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="flex-1 space-y-6">
          {/* Invitations Box */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Invitations <span className="text-gray-500">({pendingRequests.length})</span>
              </h2>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={request.imageUrl}
                          alt={request.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{request.username}</h3>
                          <p className="text-sm text-gray-500">{request.experience}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleIgnore(request.userId)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleAccept(request.userId)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No pending invitations
              </div>
            )}
          </div>

          {/* Career Growth Box */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-3">Grow your career faster</h2>
            <p className="text-gray-700 mb-3">
              Stand out for a role with personalized cover letters and resume tips.
            </p>
            <p className="text-gray-500 mb-4">Millions of members use Premium</p>
            <button className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-lg transition-colors">
              Try Premium for EGPO
            </button>
            <p className="text-gray-500 mt-3 text-sm">
              1-month free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkBox;
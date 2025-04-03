import React, { useState } from "react";
import { axiosInstance } from "../../../../apis/axios";

function AddManagerModal({ show, onClose, companyId }) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleModalClose = () => {
    setUserId("");
    setMessage("");
    setIsError(false);
    onClose();
  };

  const handleAddManager = async () => {
    if (!userId.trim()) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/companies/${companyId}/managers`, {
        userId: userId.trim(),
      });
      setMessage("Manager added successfully.");
      setIsError(false);
      setTimeout(() => {
        onClose();
        setUserId("");
        setMessage("");
      }, 1000); // 1 second delay
    } catch (err) {
      setIsError(true);
      const backendMsg = err.response?.data?.message;
      setMessage(backendMsg || "Failed to add manager. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add Manager
        </h2>

        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none"
        />

        {message && (
          <div className="text-sm mb-2 text-center text-green-600">
            {message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddManager}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddManagerModal;

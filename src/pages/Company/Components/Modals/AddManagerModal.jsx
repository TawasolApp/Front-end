import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../../apis/axios";

function AddManagerModal({ show, onClose, companyId }) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [managers, setManagers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch current company managers
  const fetchManagers = async (reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    try {
      setLoading(true);

      const currentPage = reset ? 1 : page;
      const { data } = await axiosInstance.get(
        `/companies/${companyId}/managers?page=${currentPage}&limit=2`
      );

      const managerProfiles = data.map((user) => ({
        id: user.userId,
        name: `${user.firstName} ${user.lastName}`,
      }));

      if (reset) {
        setManagers(managerProfiles);
      } else {
        setManagers((prev) => [...prev, ...managerProfiles]);
      }

      if (data.length < 2) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching manager profiles:", err);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setManagers([]);
      setPage(1);
      setHasMore(true);
      fetchManagers(true);
    }
  }, [show, companyId]);

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

      await axiosInstance.post(`/companies/${companyId}/managers`, {
        newUserId: userId.trim(),
      });

      setMessage("Manager added successfully.");
      setIsError(false);

      await fetchManagers();

      setTimeout(() => {
        onClose();
        setUserId("");
        setMessage("");
      }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-modalbackground">
      <div className="bg-boxbackground p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-text">Add Manager</h2>

        {managers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-text mb-2">
              Current Managers
            </p>
            <div className="space-y-2">
              {managers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 bg-boxbackground p-2 rounded-md border border-gray-700"
                >
                  {/* Avatar initials */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm uppercase">
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  {/* Name */}
                  <p className="text-sm text-normaltext">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasMore && (
          <div className="mt-2 text-center">
            <button
              onClick={() => fetchManagers()}
              className="text-sm text-blue-600 hover:underline"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}

        <h2 className="text-text mb-2">Add new manager</h2>
        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border bg-boxbackground border-gray-300 rounded-md text-text px-4 py-2 mb-4 focus:outline-none"
        />

        {message && (
          <div
            className={`text-sm mb-2 text-center ${
              isError ? "text-red-500" : "text-green-600"
            }`}
          >
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

import React, { useEffect, useState } from "react";
import ConnectionCard from "./components/ConnectionCard";
import { axiosInstance } from "../../apis/axios";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("recentlyAdded");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axiosInstance.get("/connections/list");
        setConnections(response.data);
      } catch (err) {
        setError("Failed to load connections.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleRemoveConnection = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/${userId}`);
      setConnections((prevConnections) =>
        prevConnections.filter((connection) => connection.userId !== userId),
      );
    } catch (error) {
      console.error("Failed to remove connection:", error);
      alert("Error: Unable to remove connection.");
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Sort connections
  const sortedConnections = [...connections].sort((a, b) => {
    if (sortBy === "recentlyAdded") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "firstName") {
      return a.username.split(" ")[0].localeCompare(b.username.split(" ")[0]);
    } else if (sortBy === "lastName") {
      const lastNameA = a.username.split(" ")[1] || a.username;
      const lastNameB = b.username.split(" ")[1] || b.username;
      return lastNameA.localeCompare(lastNameB);
    }
    return 0;
  });

  // Filter connections
  const filteredConnections = sortedConnections.filter((connection) =>
    connection.username.toLowerCase().includes(searchQuery),
  );

  return (
    <div className="p-4 bg-stone-100 dark:bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="bg-white dark:bg-[#1e2229] border border-gray-200 dark:border-[#2a3038] rounded-t-lg shadow-sm p-4 border-b-0">
          <h1 className="text-xl dark:text-[#f0f2f5]">
            {filteredConnections.length} Connection
            {filteredConnections.length !== 1 ? "s" : ""}
          </h1>

          {/* Sort and Search Controls */}
          <div className="mt-2 flex items-center justify-between">
            {/* Sort Dropdown */}
            <div className="flex items-center relative">
              <label
                htmlFor="sortBy"
                className="text-sm text-gray-600 dark:text-[#959ea9]"
              >
                Sort by:
              </label>
              <div className="ml-2 relative">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="pl-2 pr-7 py-1 text-sm text-gray-600 dark:text-[#c1c9d4] bg-white dark:bg-[#1e2229] border border-gray-300 dark:border-[#2a3038] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option
                    value="recentlyAdded"
                    className="dark:bg-[#1e2229] dark:text-[#c1c9d4]"
                  >
                    Recently added
                  </option>
                  <option
                    value="firstName"
                    className="dark:bg-[#1e2229] dark:text-[#c1c9d4]"
                  >
                    First name
                  </option>
                  <option
                    value="lastName"
                    className="dark:bg-[#1e2229] dark:text-[#c1c9d4]"
                  >
                    Last name
                  </option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-[#959ea9]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 p-2 pl-10 border border-gray-600 dark:border-[#2a3038] rounded-lg focus:outline-none focus:border-blue-500 text-sm font-semibold dark:bg-[#1e2229] dark:text-[#c1c9d4]"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-[#959ea9]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-[#959ea9] mt-4">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mt-4">
            {error}
          </p>
        )}

        {/* Connections List */}
        {!loading && !error && (
          <div className="space-y-0">
            {filteredConnections.map((connection, index) => (
              <div key={connection.userId}>
                <ConnectionCard
                  imageUrl={connection.profilePicture}
                  username={connection.username}
                  experience={connection.headline}
                  connectionDate={`Connected on ${new Date(connection.createdAt).toLocaleDateString()}`}
                  onRemove={() => handleRemoveConnection(connection.userId)}
                  darkModeColors={{
                    bg: "#1e2229",
                    textPrimary: "#f0f2f5",
                    textSecondary: "#c1c9d4",
                    border: "#2a3038",
                  }}
                />
                {index !== filteredConnections.length - 1 && (
                  <div className="border-t border-gray-200 dark:border-[#2a3038]"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;

import React, { useState, useEffect, useRef, useCallback } from "react";
import ConnectionCard from "./ConnectionCard";
import { axiosInstance } from "../../../apis/axios";

const ConnectionPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(1); // 1: recentlyAdded, 2: firstName, 3: lastName
  const [sortDirection, setSortDirection] = useState(1); // 1: ascending, -1: descending
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const observer = useRef();
  const isFetching = useRef(false);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch connections when sortBy, sortDirection, or page changes
  useEffect(() => {
    const fetchConnections = async () => {
      if (isFetching.current) return;

      setLoading(true);
      setError(null);
      isFetching.current = true;

      try {
        const response = await axiosInstance.get("/connections/list", {
          params: { page, limit, by: sortBy, direction: sortDirection },
        });

        const newData = response.data;

        if (newData.length === 0) {
          setHasMore(false);
        } else {
          if (page === 1) {
            setConnections(newData);
          } else {
            setConnections((prev) => [...prev, ...newData]);
          }
        }
      } catch (err) {
        setError("Failed to load connections.");
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchConnections();
  }, [page, sortBy, sortDirection]); // Fetch new connections when sort or direction changes

  const handleRemoveConnection = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/${userId}`);
      setConnections((prev) => prev.filter((connection) => connection.userId !== userId));
    } catch (error) {
      setError("Unable to remove connection.");
    }
  };

  const handleSortChange = (event) => {
    setSortBy(Number(event.target.value));
    setPage(1); // Reset page when sorting changes
  };

  const handleDirectionChange = (event) => {
    setSortDirection(Number(event.target.value));
    setPage(1); // Reset page when direction changes
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredConnections = connections.filter((connection) => {
    const fullName = `${connection.firstName} ${connection.lastName}`.toLowerCase();
    return fullName.includes(searchQuery);
  });

  return (
    <div className="p-4 bg-mainBackground min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-cardBackground border border-cardBorder rounded-t-lg shadow-sm p-4 border-b-0">
          <h1 className="text-xl text-textHeavyTitle">
            {filteredConnections.length} Connection
            {filteredConnections.length !== 1 ? "s" : ""}
          </h1>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center relative">
              <label htmlFor="sortBy" className="text-sm text-textPlaceholder">
                Sort by:
              </label>
              <div className="ml-2 relative">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="pl-2 pr-7 py-1 text-sm text-textPlaceholder bg-cardBackground border border-cardBorder rounded focus:outline-none focus:ring-1 focus:ring-buttonSubmitEnable appearance-none cursor-pointer"
                >
                  <option value={1}>Recently added</option>
                  <option value={2}>First name</option>
                  <option value={3}>Last name</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-textPlaceholder"
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

            <div className="flex items-center relative">
              <label htmlFor="sortDirection" className="text-sm text-textPlaceholder">
                Direction:
              </label>
              <div className="ml-2 relative">
                <select
                  id="sortDirection"
                  value={sortDirection}
                  onChange={handleDirectionChange}
                  className="pl-2 pr-7 py-1 text-sm text-textPlaceholder bg-cardBackground border border-cardBorder rounded focus:outline-none focus:ring-1 focus:ring-buttonSubmitEnable appearance-none cursor-pointer"
                >
                  <option value={1}>Ascending</option>
                  <option value={-1}>Descending</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-textPlaceholder"
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

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 p-2 pl-10 border border-cardBorder rounded-lg focus:outline-none focus:border-buttonSubmitEnable text-sm font-semibold bg-cardBackground text-textPlaceholder"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-textPlaceholder"
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

        {loading && page === 1 ? (
          <p className="text-center text-textPlaceholder mt-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-error mt-4">{error}</p>
        ) : (
          <>
            <div className="space-y-0">
              {filteredConnections.map((connection, index) => (
                <div
                  key={`${connection.userId}-${index}`}
                  ref={index === filteredConnections.length - 1 ? lastElementRef : null}
                >
                  <ConnectionCard
                    imageUrl={connection.profilePicture}
                    firstName={connection.firstName}
                    lastName={connection.lastName}
                    experience={connection.headline}
                    connectionDate={`Connected on ${new Date(connection.createdAt).toLocaleDateString()}`}
                    onRemove={() => handleRemoveConnection(connection.userId)}
                  />
                  {index !== filteredConnections.length - 1 && (
                    <div className="border-t border-cardBorder"></div>
                  )}
                </div>
              ))}
            </div>

            {loading && page > 1 && (
              <div className="flex justify-center p-4">
                <div className="loader">Loading more connections...</div>
              </div>
            )}

            {!hasMore && filteredConnections.length > 0 && (
              <div className="text-center p-4 border-t border-cardBorder">
                You've reached the end of your connections
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionPage;

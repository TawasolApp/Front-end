import React, { useEffect, useState } from 'react';
import ConnectionCard from './components/ConnectionCard';
import { axiosInstance } from '../../apis/axios';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recentlyAdded');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axiosInstance.get('/connections/list'); 
        setConnections(response.data);
      } catch (err) {
        setError('Failed to load connections.');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleRemoveConnection = async (userId) => {
    try {
      await axiosInstance.delete(`/connections/${userId}`);
      setConnections((prevConnections) => prevConnections.filter((connection) => connection.userId !== userId));
    } catch (error) {
      console.error('Failed to remove connection:', error);
      alert('Error: Unable to remove connection.');
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
    if (sortBy === 'recentlyAdded') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'firstName') {
      return a.username.split(' ')[0].localeCompare(b.username.split(' ')[0]);
    } else if (sortBy === 'lastName') {
      const lastNameA = a.username.split(' ')[1] || a.username;
      const lastNameB = b.username.split(' ')[1] || b.username;
      return lastNameA.localeCompare(lastNameB);
    }
    return 0;
  });

  // Filter connections
  const filteredConnections = sortedConnections.filter((connection) =>
    connection.username.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-4 bg-stone-100 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-t-lg shadow-sm p-4 border-b-0">
          <h1 className="text-xl">
            {filteredConnections.length} Connection{filteredConnections.length !== 1 ? 's' : ''}
          </h1>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="sortBy" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="ml-2 p-1 text-sm text-gray-600 bg-transparent border-none focus:outline-none"
              >
                <option value="recentlyAdded">Recently added</option>
                <option value="firstName">First name</option>
                <option value="lastName">Last name</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 p-2 pl-10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

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
                />
                {index !== filteredConnections.length - 1 && (
                  <div className="border-t border-gray-200"></div>
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
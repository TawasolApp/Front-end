import React, { useState } from 'react';
import ConnectionCard from './components/ConnectionCard';

const Connections = () => {
  const [connections, setConnections] = useState([
    {
      id: 1,
      imageUrl: '',
      username: 'Khalid Ali',
      experience: 'Software Engineer at Tech Corp',
      connectionDate: 'Connected on March 16, 2025',
    },
    {
      id: 2,
      imageUrl: '',
      username: 'Youssef Fawzy',
      experience: 'Product Manager at Innovate LLC',
      connectionDate: 'Connected on April 10, 2025',
    },
    {
      id: 3,
      imageUrl: '',
      username: 'Sobh',
      experience: 'Data Scientist at DataWorks',
      connectionDate: 'Connected on May 5, 2025',
    },
    // Add more connections as needed
  ]);

  const [sortBy, setSortBy] = useState('recentlyAdded'); // Default sorting
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  const handleRemoveConnection = (id) => {
    setConnections(connections.filter((connection) => connection.id !== id));
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Convert search query to lowercase
  };

  // Sort connections based on the selected criteria
  const sortedConnections = [...connections].sort((a, b) => {
    if (sortBy === 'recentlyAdded') {
      return b.id - a.id; // Sort by ID (higher ID first)
    } else if (sortBy === 'firstName') {
      return a.username.split(' ')[0].localeCompare(b.username.split(' ')[0]); // Sort by first name
    } else if (sortBy === 'lastName') {
      return a.username.split(' ')[1].localeCompare(b.username.split(' ')[1]); // Sort by last name
    }
    return 0;
  });

  // Filter connections based on the search query
  const filteredConnections = sortedConnections.filter((connection) =>
    connection.username.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-4 bg-stone-100 min-h-screen flex justify-center">
      {/* Centered horizontally with a slight shift to the left */}
      <div className="w-full max-w-4xl">
        {/* White Box for Connection Count */}
        <div className="bg-white border border-gray-200 rounded-t-lg shadow-sm p-4 border-b-0">
          <h1 className="text-xl">
            {filteredConnections.length} Connection{filteredConnections.length !== 1 ? 's' : ''}
          </h1>

          {/* Sorting Dropdown and Search Bar */}
          <div className="mt-2 flex items-center justify-between">
            {/* Sorting Dropdown */}
            <div className="flex items-center">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="ml-2 p-1 text-sm text-gray-600 bg-transparent border-none focus:outline-none"
              >
                <option value="recentlyAdded" className="font-semibold">
                  Recently added
                </option>
                <option value="firstName" className="font-semibold">
                  First name
                </option>
                <option value="lastName" className="font-semibold">
                  Last name
                </option>
              </select>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 p-2 pl-10 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
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

        {/* Connection Cards with Thin Line Divider */}
        <div className="space-y-0"> {/* Removed space between cards */}
          {filteredConnections.map((connection, index) => (
            <div key={connection.id}>
              <ConnectionCard
                imageUrl={connection.imageUrl}
                username={connection.username}
                experience={connection.experience}
                connectionDate={connection.connectionDate}
                onRemove={() => handleRemoveConnection(connection.id)}
              />
              {/* Add a thin line divider between cards (except after the last one) */}
              {index !== filteredConnections.length - 1 && (
                <div className="border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
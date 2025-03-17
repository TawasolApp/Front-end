import React, { useState } from 'react';

const ConnectionCard = ({ imageUrl, username, experience, connectionDate, onRemove }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRemove = () => {
    onRemove(); // Call the onRemove function passed from the parent component
    setIsMenuOpen(false); // Close the menu after removal
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow w-full">
      {/* Left Section: Profile Image and Details */}
      <div className="flex items-center flex-1">
        <img
          src={imageUrl}
          alt={username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          {/* Username with underline on hover */}
          <h3 className="text-lg font-semibold hover:underline cursor-pointer">
            {username}
          </h3>
          {/* Experience */}
          <p className="text-sm text-gray-700">{experience}</p>
          {/* Connection Date */}
          <p className="text-xs text-gray-500 mt-1">{connectionDate}</p>
        </div>
      </div>

      {/* Right Section: Message Button and Three Dots Menu */}
      <div className="flex items-center space-x-3">
        {/* Message Button */}
        <button className="px-3 py-1.5 bg-transparent border border-blue-700 text-blue-700 rounded-full hover:bg-blue-50 transition-colors text-sm">
          Message
        </button>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-1.5 text-black bold hover:text-black bold focus:outline-none"
          >
            {/* Three Dots Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={handleRemove}
                className="w-full px-4 py-2 text-sm text-black bold hover:bg-gray-100 flex items-center"
              >
                {/* Trash Can Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove Connection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
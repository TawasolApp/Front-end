import React, { useState, useEffect, useRef } from 'react';

const ConnectionCard = ({ imageUrl, username, experience, connectionDate, onRemove }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for confirmation modal
  const menuRef = useRef(null); // Ref for the dropdown menu

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to open the confirmation modal
  const openConfirmation = () => {
    setIsConfirmationOpen(true);
    setIsMenuOpen(false); // Close the dropdown menu
  };

  // Function to close the confirmation modal
  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  // Function to handle the "Remove Connection" action
  const handleRemove = () => {
    onRemove(); // Call the onRemove function passed from the parent component
    setIsConfirmationOpen(false); // Close the confirmation modal
  };

  // Effect to handle clicks outside the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu if the click is outside
      }
    };

    // Add event listener when the menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or the menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]); // Re-run the effect when isMenuOpen changes

  return (
    <>
      {/* Connection Card */}
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
          <button className="px-3 py-1.5 bg-transparent font-semibold border border-blue-700 text-blue-700 rounded-full hover:bg-blue-50 transition-colors text-sm">
            Message
          </button>

          {/* Three Dots Menu */}
          <div className="relative" ref={menuRef}>
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
                  onClick={openConfirmation} // Open the confirmation modal
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

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative"> {/* Added relative for positioning the X button */}
            {/* X Button with Hover Effect */}
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title and Divider */}
            <h2 className="text-xl font-semibold mb-4">Remove Connection</h2>
            <div className="border-t border-gray-200 mb-4"></div> {/* Added divider line */}

            {/* Message */}
            <p className="text-gray-700 mb-4"> {/* Reduced margin-bottom */}
              Are you sure you want to remove {username} as a connection? Don’t worry, {username} won’t be notified by LinkedIn.
            </p>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              {/* Cancel Button */}
              <button
                onClick={closeConfirmation}
                className="px-4 py-2 text-sm text-blue-600 bg-white border border-blue-600 rounded-3xl hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-3xl transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectionCard;
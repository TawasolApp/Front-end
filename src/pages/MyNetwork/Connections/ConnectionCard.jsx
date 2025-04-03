import React, { useState, useEffect, useRef } from "react";

const ConnectionCard = ({
  imageUrl,
  username,
  experience,
  connectionDate,
  onRemove,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openConfirmation = () => {
    setIsConfirmationOpen(true);
    setIsMenuOpen(false);
  };
  const closeConfirmation = () => setIsConfirmationOpen(false);
  const handleRemove = () => {
    onRemove();
    setIsConfirmationOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Connection Card */}
      <div className="flex items-center justify-between p-3 bg-cardBackground border border-cardBorder rounded-lg shadow-sm transition-shadow w-full">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          <img
            src={imageUrl}
            alt={username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold hover:underline cursor-pointer text-textHeavyTitle">
              {username}
            </h3>
            <p className="text-sm text-textActivity">
              {experience}
            </p>
            <p className="text-xs text-textPlaceholder mt-1">
              {connectionDate}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1.5 bg-transparent font-semibold border border-buttonSubmitEnable text-buttonSubmitEnable rounded-full hover:bg-buttonSubmitEnableHover transition-colors text-sm">
            Message
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              data-testid="menu-button"
              className="p-1.5 text-icon hover:text-textHeavyTitle focus:outline-none"
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
                  d="M5 12h.01M12 12h.01M19 12h.01"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cardBackground border border-cardBorder rounded-lg shadow-lg z-10">
                <button
                  onClick={openConfirmation}
                  className="w-full px-4 py-2 text-sm text-textHeavyTitle hover:bg-cardBackgroundHover flex items-center"
                >
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
          <div className="bg-cardBackground p-6 rounded-lg shadow-lg w-[500px] relative border border-cardBorder">
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 p-2 text-icon hover:bg-cardBackgroundHover rounded-full focus:outline-none transition-colors"
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

            <h2 className="text-xl font-semibold mb-4 text-textHeavyTitle">
              Remove Connection
            </h2>
            <div className="border-t border-cardBorder mb-4"></div>

            <p className="text-textContent mb-4">
              Are you sure you want to remove {username} as a connection? Don't
              worry, {username} won't be notified by LinkedIn.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmation}
                className="px-4 py-2 text-sm text-buttonSubmitEnable bg-cardBackground border border-buttonSubmitEnable rounded-3xl hover:bg-buttonSubmitEnableHover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 text-sm text-buttonSubmitText bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover rounded-3xl transition-colors"
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
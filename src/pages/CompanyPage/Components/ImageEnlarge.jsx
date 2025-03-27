import React from "react";
import { FiX } from "react-icons/fi"; // Import close icon

function ImageEnlarge({ profilePicture, isOpen, onClose }) {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      role="dialog"
      aria-label="Enlarged Image Modal"
    >
      {/* Prevent Closing When Clicking Inside the Modal */}
      <div
        className="relative bg-black p-4 rounded-lg max-w-[90%] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          onClick={onClose}
          aria-label="Close enlarged image"
        >
          <FiX />
        </button>

        {/* Large Banner Image */}
        <img
          src={profilePicture}
          alt="Profile Enlarged"
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}

export default ImageEnlarge;

import React, { useEffect } from "react";
import CloseIcon from "../../../assets/icons/exit-icon.svg";

function ImageEnlarge({ profilePicture, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup on modal close
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen || !profilePicture) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      {/* Prevent Closing When Clicking Inside the Modal */}
      <div
        className="relative w-full flex items-center justify-center bg-black p-4 "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          <img src={CloseIcon} alt="Close" className="w-6 h-6" />
        </button>
        {/* Large Profile Image */}
        <img
          src={profilePicture}
          alt="Profile Enlarged"
          className="max-w-full max-h-screen object-contain"
        />
      </div>
    </div>
  );
}

export default ImageEnlarge;

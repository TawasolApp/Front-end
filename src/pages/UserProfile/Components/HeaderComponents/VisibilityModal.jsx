import React, { useState, useEffect } from "react";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can view your profile",
  },
  {
    value: "connections_only",
    label: "Connections Only",
    description: "Only your connections can view your profile",
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can view your profile",
  },
];

const VisibilityModal = ({ isOpen, onClose, currentVisibility, onSave }) => {
  const [selectedVisibility, setSelectedVisibility] =
    useState(currentVisibility);

  useEffect(() => {
    setSelectedVisibility(currentVisibility);
  }, [currentVisibility]);

  //  Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up just in case
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (selectedVisibility) {
      onSave(selectedVisibility);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Edit Profile Visibility</h2>

        {/* Visibility options */}
        <div className="space-y-3 py-2">
          {VISIBILITY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`block cursor-pointer p-3 rounded border ${
                selectedVisibility === option.value
                  ? "border-blue-400 bg-gray-100"
                  : "border-gray-400"
              }`}
              onClick={() => setSelectedVisibility(option.value)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={selectedVisibility === option.value}
                  onChange={() => setSelectedVisibility(option.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm font-semibold">{option.label}</span>
              </div>
              {selectedVisibility === option.value && (
                <p className="text-xs text-gray-600 mt-1 pl-6">
                  {option.description}
                </p>
              )}
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilityModal;

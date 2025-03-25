import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";

function ImageUploadModal({ isOpen, onClose, onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Lock scrolling when the modal is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up when the modal is closed
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]); // Run the effect when isOpen changes

  if (!isOpen) return null; // If modal isn't open, render nothing
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-3">Upload Image</h2>

        {/* Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-4 text-center">
          <label htmlFor="fileUpload" className="cursor-pointer">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <FiUpload className="text-xl font-semibold" />
                  <p className="font-semibold">Choose file</p>
                </div>
                <p className="text-gray-600 text-sm">Upload to see preview</p>
              </>
            )}
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            data-testid="file-input"
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          {selectedImage && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => {
                onUpload(selectedImage);
                onClose();
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploadModal;

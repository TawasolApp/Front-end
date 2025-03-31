import React, { useState, useEffect } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";

function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
  defaultImage,
  uploadType, // 'profile' or 'cover'
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const isDefaultImage = currentImage === defaultImage;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedImage) return;
    setIsSaving(true);
    onUpload(selectedImage);
    setSelectedImage(null);
    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    setIsSaving(true);
    onUpload(null);
    setSelectedImage(null);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-3 text-text">Upload Image</h2>

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
            disabled={isSaving}
          >
            Cancel
          </button>

          {currentImage && currentImage !== defaultImage && !selectedImage && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-1"
              disabled={isSaving}
            >
              <FiTrash2 /> Delete
            </button>
          )}

          {selectedImage && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleSave}
              disabled={isSaving}
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

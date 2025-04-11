import React, { useState, useEffect } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../ReusableModals/ConfirmModal";

function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
  defaultImage,
  uploadType, // 'profile' or 'cover'
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const isDefaultImage = currentImage === defaultImage;
  const hasUnsavedChanges = previewImage && previewImage !== currentImage;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedFile) return;
    setIsSaving(true);
    onUpload(selectedFile);
    setTimeout(() => {
      setSelectedFile(null);
      setPreviewImage(null);
      setIsSaving(false);
      onClose();
    }, 600); // simulate smooth UX
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setIsSaving(true);
    onUpload(null);
    setTimeout(() => {
      setSelectedFile(null);
      setPreviewImage(null);
      setIsSaving(false);
      setShowDeleteConfirm(false);
      onClose();
    }, 600);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-3 text-text">
          Upload {uploadType === "cover" ? "Cover" : "Profile"} Image
        </h2>

        {/* Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded-md">
          <label htmlFor="fileUpload" className="cursor-pointer block">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-600">
                <FiUpload className="text-2xl mb-1" />
                <p className="font-semibold">Choose file</p>
                <p className="text-sm text-gray-500">Upload to see preview</p>
              </div>
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

        {/* Action Buttons */}
        <div className="mt-5 flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition duration-200"
          >
            Cancel
          </button>

          {currentImage && !isDefaultImage && !previewImage && (
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className={`px-4 py-2 text-white rounded-full transition duration-200 ${
                isSaving
                  ? "bg-blue-400 cursor-not-allowed opacity-60"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSaving ? (
                "Deleting..."
              ) : (
                <span className="flex items-center gap-1">Delete</span>
              )}
            </button>
          )}

          {previewImage && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-4 py-2 text-white rounded-full transition duration-200 ${
                !hasUnsavedChanges || isSaving
                  ? "bg-blue-400 cursor-not-allowed opacity-60"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this image? This action cannot be undone."
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}

export default ImageUploadModal;

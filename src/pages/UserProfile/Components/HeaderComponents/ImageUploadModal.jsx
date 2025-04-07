import React, { useState, useEffect } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../GenericDisplay/ConfirmModal";
function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentImage,
  defaultImage,
  uploadType, // 'profile' or 'cover'
}) {
  const [selectedFile, setSelectedFile] = useState(null); // holds actual File object
  const [previewImage, setPreviewImage] = useState(null); // base64 for preview
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal

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
      setSelectedFile(file); //  this is what i send to backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // for preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedFile) return;
    setIsSaving(true);
    onUpload(selectedFile); //  send real File object
    setSelectedFile(null);
    setPreviewImage(null);
    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true); // Show confirmation modal before delete
  };

  const handleDeleteConfirm = () => {
    setIsSaving(true);
    onUpload(null); // tells parent to remove image
    setSelectedFile(null);
    setPreviewImage(null);
    setIsSaving(false);
    setShowDeleteConfirm(false); // Close the delete confirmation modal
    onClose();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false); // Close the delete confirmation modal without deleting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-3 text-text">Upload Image</h2>

        {/* Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-4 text-center">
          <label htmlFor="fileUpload" className="cursor-pointer">
            {previewImage ? (
              <img
                src={previewImage}
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

          {currentImage && currentImage !== defaultImage && !previewImage && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-1"
              disabled={isSaving}
            >
              <FiTrash2 /> Delete
            </button>
          )}

          {previewImage && (
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

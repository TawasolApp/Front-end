import React, { useState, useEffect } from "react";
import ConfirmModal from "../GenericDisplay/ConfirmModal";

function AboutEditingModal({ initialBio, onClose, onSave }) {
  const [bio, setBio] = useState(initialBio || "");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setBio(initialBio || "");
  }, [initialBio]);

  //  Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const hasUnsavedChanges = bio.trim() !== (initialBio ?? "").trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = bio.trim();
    onSave(cleaned);
  };

  const handleCancel = () => {
    const hasChanges = bio.trim() !== (initialBio ?? "").trim();
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-text">Edit About</h2>
          <textarea
            className="w-full h-32 border p-2 rounded-md bg-boxbackground text-companyheader2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={2600}
          />
          <div className="text-sm text-gray-600 text-right mt-1">
            {bio.length}/2600
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-2 rounded-full transition duration-200 ${
                hasUnsavedChanges
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-400 text-white opacity-60 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Discard changes?"
          message="You have unsaved changes. Are you sure you want to discard them?"
          confirmLabel="Discard"
          cancelLabel="Continue Editing"
          onConfirm={handleDiscard}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default AboutEditingModal;

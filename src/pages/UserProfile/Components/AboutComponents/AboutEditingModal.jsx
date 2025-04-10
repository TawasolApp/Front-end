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
      <div className="fixed inset-0 z-50 bg-modalbackground flex items-center justify-center">
        <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-[90%] max-w-md relative ">
          <button
            onClick={handleCancel}
            className="absolute top-2 right-2 text-normaltext hover:text-companyheader p-2 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>

          <h2 className="text-lg font-semibold mb-4 text-text">Edit About</h2>
          <textarea
            className="w-full h-32 border p-2 rounded-md bg-boxbackground text-companyheader"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={2600}
          />
          <div className="text-sm text-normaltext text-right mt-1">
            {bio.length}/2600
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-2 rounded-full transition duration-200 ${
                hasUnsavedChanges
                  ? "bg-blue-600 text-boxheading hover:bg-blue-700"
                  : "bg-blue-400 text-boxheading opacity-60 cursor-not-allowed"
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

import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress"; // Import loading spinner

const DeletePostModal = ({ closeModal, deleteFunc, commentOrPost }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteFunc();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-cardBackground rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-header mb-4">
            Delete {commentOrPost}
          </h3>
          <p className="text-textPlaceholder">
            Are you sure you want to delete this{" "}
            {commentOrPost === "Post" ? "post" : "comment"}?
          </p>
        </div>

        <div className="bg-cardBackground flex items-center justify-end gap-2 px-6 py-4 border-t border-cardBorder">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded font-medium text-buttonSubmitText bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded font-medium text-buttonSubmitText bg-red-600 hover:bg-red-800 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={18} className="text-white" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;

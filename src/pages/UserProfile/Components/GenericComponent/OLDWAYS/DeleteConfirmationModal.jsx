import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isDiscard ? "Discard changes?" : `Delete ${itemName}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-lg">
            ✖
          </button>
        </div>

        {/* Confirmation Text */}
        <p className="text-gray-700 mb-4">
          {isDiscard
            ? "Are you sure you want to discard your changes?"
            : `Are you sure you want to delete your ${itemName}?`}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            No thanks
          </button>
          <button
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            onClick={onConfirm}
          >
            {isDiscard ? "Discard" : "Delete"}
            {/* {!isDiscard && console.log("ma bydas aho")} */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

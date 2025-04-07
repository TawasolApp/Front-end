// ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({
  title = "Are you sure?",
  message = "",
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-boxbackground rounded-lg p-6 w-[90%] sm:w-[400px] shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-text">{title}</h2>
      <p className="text-gray-700 mb-4 text-companyheader2">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onConfirm}
          data-testid="confirm-modal"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;

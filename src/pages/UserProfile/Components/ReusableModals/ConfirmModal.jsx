import React from "react";

const ConfirmModal = ({
  title = "Are you sure?",
  message = "",
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => (
  // modal bachground look bad modalbackground
  <div className="fixed inset-0 bg-modalbackground flex items-center justify-center z-50">
    <div className="bg-boxbackground p-6 rounded-lg shadow-lg w-[90%] sm:w-[350px] relative">
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 text-normaltext hover:text-companyheader p-2 text-2xl"
        aria-label="Close modal"
      >
        &times;
      </button>
      <h2 className="text-lg font-semibold text-text"> {title} </h2>
      <p className="text-companyheader mt-2">{message}</p>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-blue-500 text-unblockText rounded-full hover:bg-unblockBg transition duration-200"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-boxbackground  rounded-full hover:bg-blue-700 transition duration-200"
          data-testid="confirm-modal"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;

import React, { useEffect, useState } from "react";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ConfirmModal from "../ReusableModals/ConfirmModal";
import { axiosInstance as axios } from "../../../../apis/axios";
import ReportUserModal from "./ReportUserModal";
const ReportBlockModal = ({ isOpen, onClose, fullName, userId }) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleBlockUser = async () => {
    try {
      await axios.post("/privacy/block/user", { userId });
      onClose(); // close modal after success
    } catch (err) {
      console.error("Block failed:", err.response?.data || err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Modal Overlay */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        {/* Modal Card */}
        <div className="bg-boxbackground rounded-xl p-6 shadow-lg border border-cardBorder w-full max-w-md mx-4 sm:mx-0 relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-text text-xl"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold text-header mb-2">
            Report or block
          </h2>
          <p className="text-sm font-medium text-textContent mb-3">
            Select an action
          </p>

          {/* Action List */}
          <div className="space-y-1">
            <div
              className="group flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => setShowBlockConfirm(true)}
            >
              <p className="text-textContent font-medium group-hover:text-black">
                Block {fullName}
              </p>
              <ArrowForwardOutlined className="text-textPlaceholder group-hover:text-black" />
            </div>
            <div
              className="group flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => setShowReportModal(true)}
            >
              <p className="text-textContent font-medium group-hover:text-black">
                Report {fullName} or entire account
              </p>
              <ArrowForwardOutlined className="text-textPlaceholder group-hover:text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Block Confirmation */}
      {showBlockConfirm && (
        <ConfirmModal
          title="Block"
          message={`You’re about to block ${fullName}\nYou’ll no longer be connected, and will lose any endorsements or recommendations from this person.`}
          confirmLabel="Block"
          cancelLabel="Back"
          onConfirm={handleBlockUser}
          onCancel={() => setShowBlockConfirm(false)}
        />
      )}
      {showReportModal && (
        <ReportUserModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          fullName={fullName}
          userId={userId} // Pass it down
        />
      )}
    </>
  );
};

export default ReportBlockModal;

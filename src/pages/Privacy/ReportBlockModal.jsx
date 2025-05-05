import React, { useEffect, useState } from "react";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ConfirmModal from "../UserProfile/Components/ReusableModals/ConfirmModal";
import { axiosInstance as axios } from "../../apis/axios";
import { toast } from "react-toastify";
import ReportUserModal from "./UserReportModal";
import { useDispatch } from "react-redux";

const ReportBlockModal = ({
  isOpen,
  onClose,
  fullName,
  userId, // the profile being viewed (target)
  viewerId, // logged-in user (block initiator)
  onBlocked,
}) => {
  const [modalStage, setModalStage] = useState("main"); // "main" | "blockConfirm" | "report"
  const [isBlocking, setIsBlocking] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setModalStage("main"); // reset modal view each time modal is opened
    }
  }, [isOpen]);

  useEffect(() => {
    const shouldLockScroll = isOpen && modalStage !== null;
    document.body.classList.toggle("overflow-hidden", shouldLockScroll);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen, modalStage]);

  const handleBlockUser = async () => {
    console.log("Blocking user:", userId);

    try {
      await axios.post(`/security/block/${userId}`);
      toast.success(`${fullName} has been blocked successfully.`);
      setTimeout(() => {
        onClose();
        if (typeof onBlocked === "function") {
          onBlocked();
        }
      }, 100);
    } catch (err) {
      toast.error("Failed to block user.");
      console.error("Block failed:");
      console.error("Status:", err.response?.status);
      console.error("Message:", err.response?.data || err.message);
      console.error("Full error:", err);
    }
  };

  if (!isOpen) return null;
  if (isBlocking) {
    return <LoadingPage message="Redirecting to feed..." />;
  }

  return (
    <>
      {/* MAIN MODAL */}
      {modalStage === "main" && isOpen && (
        <div
          className="fixed inset-0 z-50 bg-modalbackground flex items-center justify-center"
          data-testid="report-block-modal"
        >
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
                className="group flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-moreHoverBg transition"
                // onClick={() => setShowBlockConfirm(true)}
                onClick={() => setModalStage("blockConfirm")}
              >
                <p className="text-textContent font-medium group-hover:text-text">
                  Block {fullName}
                </p>
                <ArrowForwardOutlined className="text-textPlaceholder group-hover:text-text" />
              </div>
              <div
                className="group flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-moreHoverBg transition"
                // onClick={() => setShowReportModal(true)}
                onClick={() => setModalStage("report")}
              >
                <p className="text-textContent font-medium group-hover:text-text">
                  Report {fullName} or entire account
                </p>
                <ArrowForwardOutlined className="text-textPlaceholder group-hover:text-text" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation */}
      {/* {showBlockConfirm && ( */}
      {modalStage === "blockConfirm" && (
        <ConfirmModal
          title="Block"
          message={`You’re about to block ${fullName}\nYou’ll no longer be connected, and will lose any endorsements or recommendations from this person.`}
          confirmLabel="Block"
          cancelLabel="Back"
          onConfirm={handleBlockUser}
          // onCancel={() => setShowBlockConfirm(false)}
          onCancel={() => setModalStage("main")}
        />
      )}

      {/* Report Modal */}
      {/* {showReportModal && ( */}
      {modalStage === "report" && (
        <ReportUserModal
          // isOpen={showReportModal}
          isOpen={true}
          // onClose={() => setShowReportModal(false)}
          onClose={() => setModalStage("main")}
          onSubmitComplete={() => {
            setModalStage(null); // close modalStage
            onClose(); // close outer modal
          }}
          targetId={userId}
          type="user"
        />
      )}
    </>
  );
};

export default ReportBlockModal;

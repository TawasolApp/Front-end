import React, { useEffect, useState } from "react";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ConfirmModal from "../ReusableModals/ConfirmModal";
import { axiosInstance as axios } from "../../../../apis/axios";
import { toast } from "react-toastify";
import ReportUserModal from "./UserReportModal";
import { useDispatch } from "react-redux";
// import { addBlockedUser } from "../../../../store/authenticationSlice";

const ReportBlockModal = ({
  isOpen,
  onClose,
  fullName,
  userId, // the profile being viewed (target)
  viewerId, // logged-in user (block initiator)

  onBlocked,
}) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const dispatch = useDispatch();
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleBlockUser = async () => {
    console.log("Blocking user:", userId);

    try {
      await axios.post(`/security/block/${userId}`);

      // const cleanupTasks = [];

      // // Remove viewer's endorsements on target user
      // try {
      //   const res = await axios.get(`/profile/skill-endorsements/${userId}`);
      //   const theirSkills = res.data || [];
      //   const skillsEndorsedByViewer = theirSkills.filter((skill) =>
      //     skill.endorsers.includes(viewerId)
      //   );
      //   for (const skill of skillsEndorsedByViewer) {
      //     cleanupTasks.push(
      //       axios
      //         .delete(`/connections/${userId}/endorsement/${skill.name}`)
      //         .catch((err) => {
      //           if (err.response?.status !== 404) {
      //             console.warn(
      //               `Unendorsing ${skill.name} on their profile failed`,
      //               err
      //             );
      //           }
      //         })
      //     );
      //   }
      // } catch (err) {
      //   console.warn(
      //     "Failed to fetch their skills:",
      //     err.response?.data || err.message
      //   );
      // }

      // // 4. Remove their endorsements on viewer
      // try {
      //   const res = await axios.get(`/profile/skill-endorsements/${viewerId}`);
      //   const viewerSkills = res.data || [];
      //   const skillsEndorsedByThem = viewerSkills.filter((skill) =>
      //     skill.endorsers.includes(userId)
      //   );
      //   for (const skill of skillsEndorsedByThem) {
      //     cleanupTasks.push(
      //       axios
      //         .delete(`/connections/${viewerId}/endorsement/${skill.name}`)
      //         .catch((err) => {
      //           if (err.response?.status !== 404) {
      //             console.warn(
      //               `Removing ${skill.name} from your profile failed`,
      //               err
      //             );
      //           }
      //         })
      //     );
      //   }
      // } catch (err) {
      //   console.warn(
      //     "Failed to fetch your skills:",
      //     err.response?.data || err.message
      //   );
      // }

      // await Promise.all(cleanupTasks);
      // // dispatch(addBlockedUser(userId));
      toast.success(`${fullName} has been blocked successfully.`);
      // onClose(); // Close the modal after cleanup
      setTimeout(() => {
        onClose(); // Close modal
        if (typeof onBlocked === "function") {
          onBlocked(); // For example, navigate to feed
        }
      }, 800);
    } catch (err) {
      toast.error("Failed to block user.");

      // console.error("Block failed:", err.response?.data || err.message);
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
      {/* Background Modal Overlay */}
      <div className="fixed inset-0 z-50 bg-modalbackground flex items-center justify-center">
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

      {/* Report Modal */}
      {showReportModal && (
        <ReportUserModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          targetId={userId}
          type="user"
        />
      )}
    </>
  );
};

export default ReportBlockModal;

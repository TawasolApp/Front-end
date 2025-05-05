import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../apis/axios.js";
import { toast } from "react-toastify";

const ReportJobModal = ({ isOpen, onClose, jobId, onSubmitComplete }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const JOB_REASONS = [
    "Scam or fraud",
    "Incorrect job details",
    "Inappropriate or offensive content",
    "Company misrepresentation",
  ];

  const handleSubmit = async () => {
    const reasonToSend = isOtherReason ? customReason.trim() : selectedReason;
    if (!reasonToSend) return toast.error("Please provide a reason.");

    setSubmitting(true);
    try {
      await axios.post(`/security/report/job/${jobId}`, {
        reason: reasonToSend,
      });
      console.log("Job reported successfully:", jobId);
      toast.success("Job reported successfully.");
      if (onSubmitComplete) {
        onSubmitComplete();
      } else {
        handleClose();
      }
    } catch (err) {
      console.error("Failed to report job:", err);
      toast.error("Failed to report job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setIsOtherReason(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-boxbackground rounded-xl p-6 shadow-lg border border-cardBorder w-full max-w-md mx-4 sm:mx-0 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-text text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-header mb-4">Report this job</h2>

        {!isOtherReason ? (
          <>
            <p className="text-sm text-textContent mb-4">Select a reason:</p>
            <div className="space-y-2">
              {JOB_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-itemHoverBackground transition-colors"
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-textContent">{reason}</span>
                </label>
              ))}
              <button
                className="text-sm text-blue-600 mt-3 hover:underline"
                onClick={() => {
                  setIsOtherReason(true);
                  setSelectedReason("");
                }}
              >
                Something else...
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-textContent mb-4">Enter your reason:</p>
            <textarea
              value={customReason}
              onChange={(e) =>
                e.target.value.length <= 300 && setCustomReason(e.target.value)
              }
              rows={4}
              maxLength={300}
              className="w-full border rounded-lg p-2 text-sm bg-boxbackground text-companyheader"
              placeholder="Describe the issue briefly (max 300 characters)"
            />
            <p className="text-xs text-right text-gray-500 mt-1">
              {customReason.length} / 300
            </p>

            <button
              className="text-xs text-blue-600 mt-2 hover:underline"
              onClick={() => {
                setIsOtherReason(false);
                setCustomReason("");
              }}
            >
              ← Go back to predefined reasons
            </button>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-blue-500 text-unblockText rounded-full hover:bg-unblockBg transition"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            disabled={
              submitting ||
              (!isOtherReason && !selectedReason) ||
              (isOtherReason && !customReason.trim())
            }
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-full text-white ${
              (!isOtherReason && selectedReason) ||
              (isOtherReason && customReason.trim())
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 opacity-60 cursor-not-allowed"
            }`}
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportJobModal;

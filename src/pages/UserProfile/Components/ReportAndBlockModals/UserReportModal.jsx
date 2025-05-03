import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import { toast } from "react-toastify";

const ReportModal = ({ isOpen, onClose, targetId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const USER_REASONS = [
    "This person is impersonating someone",
    "This account has been hacked",
    "This account is fake",
    "Harassment or abusive behavior",
  ];

  const handleSubmit = async () => {
    const reasonToSend = isOtherReason ? customReason.trim() : selectedReason;

    if (!reasonToSend) return toast.error("Please provide a reason.");

    const payload = {
      reportedId: targetId,
      reportedType: "Profile",
      reason: reasonToSend,
    };

    console.log("🟦 Reporting user payload:", payload);

    setSubmitting(true);
    try {
      await axios.post("/security/report", payload);
      toast.success("Report submitted successfully.");
      handleClose();
    } catch (err) {
      console.error("Failed to report:", err);
      toast.error("Failed to submit report. Please try again.");
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

        <h2 className="text-xl font-bold text-header mb-4">
          Report this profile
        </h2>

        {!isOtherReason ? (
          <>
            <p className="text-sm text-textContent mb-4">Select a reason:</p>
            <div className="space-y-2">
              {USER_REASONS.map((reason) => (
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
              className="w-full border rounded-lg p-2 text-sm"
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
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
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

export default ReportModal;

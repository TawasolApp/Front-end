import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";

const ReportModal = ({ isOpen, onClose, targetId, type }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const REASONS =
    type === "user"
      ? [
          "This person is impersonating someone",
          "This account has been hacked",
          "This account is fake",
          "Harassment or abusive behavior",
        ]
      : [
          "Spam or scam",
          "Sexually inappropriate content",
          "Hate speech or symbols",
          "Misinformation",
          "Violent or graphic content",
        ];

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitting(true);

    try {
      const endpoint =
        type === "user" ? "/privacy/report/user" : "/privacy/report/post";

      const payload =
        type === "user"
          ? {
              userId: targetId,
              reason: selectedReason,
              details: selectedReason,
            }
          : {
              postId: targetId,
              reason: selectedReason,
              details: selectedReason,
            };

      await axios.post(endpoint, payload);
      onClose();
    } catch (err) {
      console.error("Failed to report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-boxbackground rounded-xl p-6 shadow-lg border border-cardBorder w-full max-w-md mx-4 sm:mx-0 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-header mb-4">
          Report {type === "user" ? "this profile" : "this post"}
        </h2>
        <p className="text-sm text-textContent mb-4">Select a reason:</p>

        <div className="space-y-2">
          {REASONS.map((reason) => (
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
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={!selectedReason || submitting}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-full text-white ${
              selectedReason && !submitting
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

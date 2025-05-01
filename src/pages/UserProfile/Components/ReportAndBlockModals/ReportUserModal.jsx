import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import { ArrowForwardOutlined } from "@mui/icons-material";

const REASONS = [
  "This person is impersonating someone",
  "This account has been hacked",
  "This account is not a real person",
];

const ReportUserModal = ({ isOpen, onClose, userId, fullName }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setSubmitting(true);
    try {
      await axios.post("/privacy/report/user", {
        userId,
        reason: selectedReason,
        details: selectedReason, // Can customize if needed
      });
      onClose(); // Close after submission
    } catch (error) {
      console.error("Failed to report user:", error);
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
          Report this profile
        </h2>
        <p className="text-sm text-textContent mb-4">
          Select an option that applies
        </p>

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

        {/* <div className="mt-4 text-sm text-textPlaceholder">
          If you believe this person is no longer with us, you can{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            let us know this person is deceased
          </span>
        </div> */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
            onClick={onClose}
          >
            Back
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

export default ReportUserModal;

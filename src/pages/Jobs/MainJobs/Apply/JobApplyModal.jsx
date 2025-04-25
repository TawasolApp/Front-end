import { useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const JobApplyModal = ({ jobId, companyName, onClose, isOpen }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/job/apply", {
        jobId: jobId,
        phoneNumber: phoneNumber,
        resumeURL: "",
      });

      toast.success("Application submitted successfully.", {
        position: "bottom-left",
        autoClose: 3000,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="inline-block bg-cardBackground rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-cardBorder">
            <h2 className="text-xl font-semibold text-textContent">
              APPLY TO {companyName.toUpperCase()}
            </h2>
            <button
              onClick={onClose}
              className="text-textPlaceholder hover:text-textContent"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm text-textPlaceholder mb-2">
                Phone Number<span className="text-red-700">*</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-cardBorder rounded-md bg-transparent text-textContent focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your phone number"
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-buttonSubmitEnable text-buttonSubmitText py-2 px-4 rounded-md hover:bg-buttonSubmitEnableHover transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <p className="mt-4 text-xs text-textPlaceholder">
              Submitting this application won't change your Tawasol profile.
              Application powered by Tawasol.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplyModal;

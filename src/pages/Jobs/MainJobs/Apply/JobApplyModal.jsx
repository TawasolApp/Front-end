import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../apis/axios";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";

const JobApplyModal = ({ jobId, companyName, onClose, onApply }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeURL, setResumeURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setLoading(true);
      setError("");
      
      const response = await axiosInstance.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setResumeURL(response.data.url);
      console.log(response.data.url);
      toast.success("Resume uploaded successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
      setResumeFile(null);
      setResumeURL("");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setResumeFile(file);
        handleFileUpload(file);
      } else {
        setError("Only PDF files are allowed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    if (!resumeURL) {
      setError("Please upload your resume first");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/jobs/apply", {
        jobId: jobId,
        phoneNumber: phoneNumber,
        resumeURL: resumeURL,
      });

      toast.success("Application submitted successfully.", {
        position: "bottom-left",
        autoClose: 3000,
      });
      onApply();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

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
            {/* Resume Upload Section */}
            <div className="mb-6">
              <label className="block text-sm text-textPlaceholder mb-2">
                Resume (PDF only)<span className="text-red-700">*</span>
              </label>
              
              <div className="relative border-2 border-dashed border-cardBorder rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                
                <div className="flex flex-col items-center justify-center space-y-2">
                  <UploadFileIcon className="w-8 h-8 text-textPlaceholder" />
                  <p className="text-sm text-textContent">
                    {resumeFile ? resumeFile.name : "Click to upload resume"}
                  </p>
                  <p className="text-xs text-textPlaceholder">
                    PDF files only, max 10MB
                  </p>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="mt-2 bg-cardBackgroundHover rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {resumeURL && (
                <div className="mt-2 flex items-center text-green-500 text-sm">
                  <DescriptionIcon className="w-4 h-4 mr-1" />
                  Resume uploaded successfully
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-6">
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
                disabled={loading}
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading || !resumeURL}
              className="w-full bg-buttonSubmitEnable text-buttonSubmitText py-2 px-4 rounded-md hover:bg-buttonSubmitEnableHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

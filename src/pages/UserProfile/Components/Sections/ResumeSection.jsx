import React, { useRef, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import { FaEye, FaDownload, FaTrash } from "react-icons/fa";
import ConfirmModal from "../GenericDisplay/ConfirmModal"; // Import the ConfirmModal

function ResumeSection({ user, isOwner }) {
  const [resumeUrl, setResumeUrl] = useState(user.resume || "");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state to manage the modal visibility
  const fileInputRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("/api/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadRes.data;

      const patchRes = await axios.patch(`/profile/${user.id}`, {
        resume: fileUrl,
      });

      if (patchRes.status === 200) {
        setResumeUrl(fileUrl);
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const res = await axios.patch(`/profile/${user.id}`, {
        resume: null,
      });
      if (res.status === 200) {
        setResumeUrl("");
      }
    } catch (err) {
      console.error("Resume delete failed:", err);
    }
  };

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto mb-2 relative group">
      <h2 className="text-2xl font-semibold text-text mb-3">Resume</h2>

      {/* ✎ Edit Icon (only shown if resume exists) */}
      {isOwner && resumeUrl && (
        <button
          onClick={() => fileInputRef.current.click()}
          title="Edit Resume"
          className="absolute rounded-full w-8 h-8 top-5 right-5 text-black text-sm hover:bg-gray-200 transition text-text"
        >
          ✎
        </button>
      )}

      {resumeUrl ? (
        <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-md">
          <div className="text-sm font-medium text-companyheader2 truncate max-w-[60%]">
            {resumeUrl.split("/").pop()}
          </div>

          <div className="flex items-center gap-4 text-gray-600 text-lg">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View"
            >
              <FaEye />
            </a>
            <a href={resumeUrl} download title="Download">
              <FaDownload />
            </a>
            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)} // Open the modal when delete is clicked
                title="Delete"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ) : (
        isOwner && (
          <div className="flex flex-col items-center justify-center text-center border border-dashed border-gray-300 rounded-md p-6 bg-white">
            <div className="text-5xl text-gray-400 mb-3">📄</div>
            <p className="text-gray-600 mb-1">
              Add a resume to help recruiters find you
            </p>
            <p className="text-gray-400 text-sm mb-4">
              PDF, DOC, DOCX files up to 10MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="border border-blue-500 px-4 py-2 rounded-full text-blue-500 hover:bg-blue-50 transition"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        )
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Confirm delete"
          message="Are you sure you want to delete this resume? This action cannot be undone."
          onCancel={() => setShowDeleteModal(false)} // Close the modal
          onConfirm={() => {
            handleDeleteResume(); // Delete the resume
            setShowDeleteModal(false); // Close the modal
          }}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}

export default ResumeSection;

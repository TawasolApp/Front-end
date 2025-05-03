import React, { useRef, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import { FaEye, FaDownload, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmModal from "../ReusableModals/ConfirmModal";

function ResumeSection({ user, isOwner }) {
  const [resumeUrl, setResumeUrl] = useState(user.resume || "");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      toast.error("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axiosInstance.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response:", uploadRes.data);
      console.log("Upload response:", uploadRes.data);

      // Safe access to uploaded file URL
      const fileUrl =
        uploadRes.data?.url || uploadRes.data?.file || uploadRes.data;
      const rawUrl =
        typeof fileUrl === "string" ? fileUrl.replace(".pdf", "") : "";

      if (!rawUrl) throw new Error("Upload returned invalid URL");

      const patchRes = await axiosInstance.patch("/profile", {
        resume: rawUrl,
      });

      if (patchRes.status === 200) {
        setResumeUrl(rawUrl);
        toast.success("Resume uploaded successfully.");
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      toast.error("Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const res = await axiosInstance.delete("/profile/resume");

      if (res.status === 200) {
        setResumeUrl("");
        toast.success("Resume deleted.");
      }
    } catch (err) {
      console.error("Resume delete failed:", err);
      toast.error("Failed to delete resume.");
    }
  };

  const fullResumeUrl = resumeUrl ? `${resumeUrl}.pdf` : "";

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto mb-2 relative group">
      <h2 className="text-2xl font-semibold text-text mb-3">Resume</h2>

      {isOwner && resumeUrl && (
        <button
          onClick={() => fileInputRef.current.click()}
          title="Edit Resume"
          className="absolute rounded-full w-8 h-8 top-5 right-5 text-text hover:bg-sliderbutton transition"
        >
          ✎
        </button>
      )}

      {resumeUrl ? (
        <div className="flex items-center justify-between bg-boxbackground border border-sliderbutton p-3 rounded-md">
          <div className="text-sm font-medium text-companyheader truncate max-w-[60%]">
            {fullResumeUrl.split("/").pop()}
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-lg">
            <a
              href={fullResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View"
            >
              <FaEye />
            </a>
            {isOwner && (
              <button onClick={() => setShowDeleteModal(true)} title="Delete">
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ) : (
        isOwner && (
          <div className="flex flex-col items-center bg-boxbackground justify-center text-center border border-dashed border-gray-300 rounded-md p-6 ">
            <div className="text-5xl text-gray-400 mb-3">📄</div>
            <p className="text-normaltext mb-1">
              Add a resume to help recruiters find you
            </p>
            <p className="text-sliderbutton text-sm mb-4">
              PDF, DOC, DOCX files up to 10MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="border border-unblockText px-4 py-2 rounded-full text-unblockText hover:bg-unblockBg Hover transition"
              disabled={isUploading}
            >
              {/*  unblockText: "rgb(var(--unblock-text))",
        unblockBgHover: */}
              {isUploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        )
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />

      {/* Confirm delete modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Confirm delete"
          message="Are you sure you want to delete this resume? This action cannot be undone."
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDeleteResume();
            setShowDeleteModal(false);
          }}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}

export default ResumeSection;

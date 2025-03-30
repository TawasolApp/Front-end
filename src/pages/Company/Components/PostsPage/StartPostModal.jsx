import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { axiosInstance } from "../../../../apis/axios";
import { useParams } from "react-router-dom";

function StartPostModal({ isOpen, onClose, logo, name, onPostSuccess }) {
  const { companyId } = useParams();
  const [content, setContent] = useState("");
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      const res = await axiosInstance.post(`/companies/${companyId}/updates`, {
        content,
        media: [],
        visibility: "Public",
      });

      if (onPostSuccess) {
        onPostSuccess(res.data.post); // pass new post to parent
      }

      onClose();
      setContent("");
    } catch (err) {
      console.error("Error posting update:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-modalbackground flex items-center justify-center z-50">
      <div className="bg-boxbackground w-full max-w-2xl rounded-md shadow-lg p-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text hover:opacity-75"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-500 rounded-sm overflow-hidden">
            <img
              src={logo}
              alt="Company Logo"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="text-text font-semibold">
            {name}
            <div className="text-sm text-gray-400">Post to Anyone</div>
          </div>
        </div>

        {/* Post textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="What do you want to talk about?"
          className="w-full bg-transparent border-none text-text placeholder-gray-400 resize-none focus:outline-none mb-4"
        />

        {/* Post button */}
        <button
          className="bg-blue-500 text-white z-50 px-4 py-2 rounded-full"
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default StartPostModal;

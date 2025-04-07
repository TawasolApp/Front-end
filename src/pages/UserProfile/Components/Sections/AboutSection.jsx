import React, { useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import AboutModal from "../AboutComponents/AboutEditingModal.jsx";

function AboutSection({ user, isOwner }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState(user.bio ?? ""); // don't fallback to default msg
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (newBio) => {
    try {
      const response = await axios.patch(`/profile/${user._id}`, {
        bio: newBio,
      });

      if (response.status === 200) {
        setBio(response.data.bio ?? "");
        setIsModalOpen(false);
        setIsExpanded(false);
      }
    } catch (err) {
      console.error("Failed to update bio:", err);
    }
  };

  const shouldShowToggle = bio?.length > 300;

  // 👇 THIS is the visibility control you need
  const shouldHide = !isOwner && (!bio || bio.trim() === "");
  if (shouldHide) return null;

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto mb-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-text">About</h2>
        {isOwner && (
          <button
            onClick={handleOpenModal}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-text "
          >
            {bio ? "✎" : "+"}
          </button>
        )}
      </div>

      <div
        className={`text-companyheader2 whitespace-pre-wrap text-sm ${
          isExpanded ? "" : "line-clamp-3"
        }`}
      >
        {bio.trim()
          ? bio
          : isOwner
            ? "Let others know more about you by adding a short bio."
            : ""}
      </div>

      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}

      {isModalOpen && (
        <AboutModal
          initialBio={bio}
          userId={user.id}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AboutSection;

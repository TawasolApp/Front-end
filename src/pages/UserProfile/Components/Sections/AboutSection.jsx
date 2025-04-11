// AboutSection.jsx
import React, { useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import AboutModal from "../AboutComponents/AboutEditingModal.jsx";
import ExpandableText from "../ReusableModals/ExpandableText.jsx"; // ✅ Import

function AboutSection({ user, isOwner }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState(user.bio ?? "");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (newBio) => {
    try {
      if (newBio.trim() === "") {
        await axios.delete("/profile/bio");
        setBio("");
      } else {
        const response = await axios.patch("/profile", { bio: newBio });
        setBio(response.data.bio || "");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update bio:", err);
    }
  };

  const isBioEmpty = !bio || bio.trim() === "";
  const shouldHide = !isOwner && isBioEmpty;
  if (shouldHide) return null;

  return (
    <div className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto mb-2 relative ">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-text">About</h2>
        {isOwner && (
          <button
            onClick={handleOpenModal}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-sliderbutton transition text-text absolute top-5 right-5"
          >
            {bio ? "✎" : "+"}
          </button>
        )}
      </div>

      {isBioEmpty && isOwner ? (
        <p className="text-sm text-companyheader italic">
          Let others know more about you by adding a short bio.
        </p>
      ) : (
        <ExpandableText text={bio} maxLines={3} />
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

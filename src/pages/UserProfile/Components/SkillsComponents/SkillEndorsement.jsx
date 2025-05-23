import React, { useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
import SkillEndorsersModal from "./SkillEndorsersModal.jsx";
function SkillEndorsement({
  userId,
  skillName,
  endorsements = [],
  viewerId,
  isOwner,
  connectStatus,
  privacy,
}) {
  const alreadyEndorsed = endorsements.includes(viewerId);
  const [isEndorsed, setIsEndorsed] = useState(alreadyEndorsed);
  const [endorsementCount, setEndorsementCount] = useState(endorsements.length);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEndorse = async () => {
    try {
      setLoading(true);
      await axios.post(`/connections/${userId}/endorse-skill`, { skillName });
      setIsEndorsed(true);
      setEndorsementCount((prev) => prev + 1);
    } catch (err) {
      console.error(
        "Failed to endorse skill:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnendorse = async () => {
    try {
      setLoading(true);
      await axios.delete(`/connections/${userId}/endorsement/${skillName}`);
      setIsEndorsed(false);
      setEndorsementCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(
        "Failed to unendorse skill:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const shouldShowCount =
    isOwner || connectStatus === "Connection" || privacy === "public";
  const shouldShowButton = !isOwner && connectStatus === "Connection";

  return (
    <div>
      {shouldShowCount && endorsementCount > 0 && (
        <p
          className="text-companyheader flex items-center mt-1 hover:underline cursor-pointer w-fit"
          onClick={() => setIsModalOpen(true)}
          title="View who endorsed this skill"
        >
          <span className="mr-2">👥</span>
          {endorsementCount} endorsement{endorsementCount !== 1 ? "s" : ""}
        </p>
      )}
      {shouldShowButton && (
        <button
          onClick={isEndorsed ? handleUnendorse : handleEndorse}
          disabled={loading}
          className={`mt-2 px-4 py-0 h-8 border rounded-full flex items-center justify-center gap-2 w-fit
          ${isEndorsed ? "bg-modalbackground text-normaltext" : "bg-boxbackground text-normaltext"} 
          border-companyheader hover:bg-sliderbutton transition
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          title={
            isEndorsed ? "Click to remove your endorsement" : "Click to endorse"
          }
        >
          {isEndorsed ? "✓  Endorsed" : " Endorse"}
        </button>
      )}
      <SkillEndorsersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        skillName={skillName}
      />
    </div>
  );
}

export default SkillEndorsement;

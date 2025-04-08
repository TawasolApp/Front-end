import React, { useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";
// make navigation correct after implementing api
function SkillEndorsement({ userId, skillName, endorsements = [], viewerId }) {
  const alreadyEndorsed = endorsements.includes(viewerId);
  const [isEndorsed, setIsEndorsed] = useState(alreadyEndorsed);
  const [endorsementCount, setEndorsementCount] = useState(endorsements.length);
  const [loading, setLoading] = useState(false);

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

  const handleViewEndorsers = () => {
    // TODO: Replace this console.log with navigation when API is ready
    console.log(`Navigate to: /users/${userId}/skills/${skillName}/endorsers`);
  };

  return (
    <div>
      <p
        className="text-companyheader2 flex items-center mt-1 hover:underline cursor-pointer w-fit"
        onClick={handleViewEndorsers}
        title="View who endorsed this skill"
      >
        <span className="mr-2">👥</span>
        {endorsementCount} endorsement{endorsementCount !== 1 ? "s" : ""}
      </p>

      <button
        onClick={isEndorsed ? handleUnendorse : handleEndorse}
        disabled={loading}
        className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit
          ${isEndorsed ? "bg-gray-200 text-text2" : "bg-white text-text-text2"} 
          border-companyheader2 hover:bg-gray-300 transition
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={
          isEndorsed ? "Click to remove your endorsement" : "Click to endorse"
        }
      >
        {isEndorsed ? "✓  Endorsed" : " + Endorse"}
      </button>
    </div>
  );
}

export default SkillEndorsement;

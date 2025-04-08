import React, { useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios.js";

function SkillEndorsement({ userId, skillName, endorsements = [], viewerId }) {
  const alreadyEndorsed = endorsements.includes(viewerId);
  const [isEndorsed, setIsEndorsed] = useState(alreadyEndorsed);
  const [endorsementCount, setEndorsementCount] = useState(endorsements.length);
  // const viewerId = "67f417a8262957c2de3609bc"; // Assuming viewerId is passed as a prop
  const handleEndorse = async () => {
    try {
      await axios.post(`/connections/${userId}/endorse-skill`, {
        skillName,
      });

      setIsEndorsed(true);
      setEndorsementCount((prev) => prev + 1);
    } catch (err) {
      console.error("Endorsement failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <p className="text-companyheader2 flex items-center mt-1">
        <span className="mr-2">👥</span>
        {endorsementCount} endorsement{endorsementCount !== 1 ? "s" : ""}
      </p>

      <button
        onClick={handleEndorse}
        disabled={isEndorsed}
        className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit
          ${isEndorsed ? "bg-gray-200 text-text2 cursor-not-allowed" : "bg-white text-text-text2"} 
          border-companyheader2 hover:bg-gray-300 transition`}
        title={
          isEndorsed ? "You've already endorsed this skill" : "Click to endorse"
        }
      >
        {isEndorsed ? "✔ Endorsed" : "Endorse"}
      </button>
    </div>
  );
}

export default SkillEndorsement;

import React, { useState } from "react";
import OwnerActions from "../OwnerActions";

function AboutSection({ user, isOwner, onAddAbout, onEditAbout }) {
  if (!user) return null;
  const [expanded, setExpanded] = useState(false);
  const isClamped = user.about.length > 100;
  const hasAbout = user.about && user.about.trim().length > 0; // Check if About exists

  const handleAddAbout = () => {
    // alert("add About button clicked!");

    if (onAddAbout) onAddAbout();
  };

  const handleEditAbout = () => {
    // alert("Edit About button clicked!");
    if (onEditAbout) onEditAbout();
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold mb-2">About</h2>

        {/* Show Add Button only if there's NO about content */}
        {isOwner && !hasAbout && <OwnerActions onAdd={handleAddAbout} />}

        {/* Show Edit Button only if there IS about content */}
        {isOwner && hasAbout && <OwnerActions onEdit={handleEditAbout} />}
      </div>

      {/* Display About Content if it exists */}
      {hasAbout ? (
        <>
          <p
            className={`font-sans text-lg text-gray-600 tracking-tight ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {user.about}
          </p>
          {isClamped && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-600 font-medium hover:text-blue-400"
            >
              {!expanded ? "see more" : null}
            </button>
          )}
        </>
      ) : (
        // If No About Content, Show a Placeholder
        <p className="text-gray-400 italic">No about information added yet.</p>
      )}
    </div>
  );
}

export default AboutSection;

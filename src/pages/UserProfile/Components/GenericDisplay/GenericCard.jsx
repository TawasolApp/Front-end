import React, { useState } from "react";
import GenericModal from "./GenericModal";

function GenericCard({ item, isOwner, type, onEdit, showEditIcons = false }) {
  const [isEndorsed, setIsEndorsed] = useState(false);
  const [endorsementCount, setEndorsementCount] = useState(
    item.endorsements || 0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEndorse = () => {
    setEndorsementCount((prev) => (isEndorsed ? prev - 1 : prev + 1));
    setIsEndorsed(!isEndorsed);
  };

  const handleSave = (updatedData) => {
    // Placeholder — if you need to update item here you can pass onUpdate
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full flex flex-col space-y-0 relative">
      {/* ✎ Only in section (showEditIcons = true) */}
      {isOwner && showEditIcons && (
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(); // Trigger the modal in parent
          }}
        >
          ✎
        </button>
      )}

      {/* Content Layout */}
      {item.institution && (
        <h3 className="text-lg font-semibold">{item.institution}</h3>
      )}
      {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
      {item.name && <h3 className="text-lg font-semibold">{item.name}</h3>}
      {item.skillName && (
        <h3 className="text-lg font-semibold">{item.skillName}</h3>
      )}
      <p className="text-gray-600">
        {item.degree ||
          item.position ||
          item.company ||
          item.issuingOrganization}
      </p>

      <p className="text-gray-500">
        {item.location || item.field || item.fieldOfStudy}
      </p>

      <p className="text-gray-500">
        {item.startMonth && item.startYear
          ? `${item.startMonth} ${item.startYear}`
          : ""}
        {item.endMonth && item.endYear
          ? ` - ${item.endMonth} ${item.endYear}`
          : ""}
      </p>

      {item.description && (
        <p className="text-gray-700 text-sm">{item.description}</p>
      )}
      {item.grade && (
        <p className="text-gray-500 text-sm">Grade: {item.grade}</p>
      )}

      {/* Skills endorsement */}
      {type === "skills" && item.skillName && (
        <>
          {/* {item.recentEndorsement && (
            <p className="text-gray-500 text-sm flex items-center mt-1">
              {item.recentEndorsement}
            </p>
          )} */}
          <p className="text-gray-600 flex items-center mt-1">
            <span className="mr-2">👥</span> {endorsementCount} endorsement
            {endorsementCount !== 1 ? "s" : ""}
          </p>

          {!isOwner && (
            <button
              onClick={handleEndorse}
              className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit ${
                isEndorsed
                  ? "bg-gray-200 text-gray-800 border-gray-400"
                  : "bg-white text-gray-700 border-gray-500"
              } hover:bg-gray-300 transition`}
            >
              {isEndorsed ? "✔ Endorsed" : "Endorse"}
            </button>
          )}
        </>
      )}

      {/* Hidden modal in page, shown only in section */}
      {isModalOpen && (
        <GenericModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          type={type}
          initialData={item}
        />
      )}
    </div>
  );
}

export default GenericCard;

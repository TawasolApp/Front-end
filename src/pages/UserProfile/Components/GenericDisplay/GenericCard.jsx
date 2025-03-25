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
    <div className="bg-boxbackground p-4 rounded-lg shadow-sm w-full flex flex-col space-y-0 relative">
      {/* ✎ Only in section (showEditIcons = true) */}
      {isOwner && showEditIcons && (
        <button
          className="absolute top-2 right-2 text-companyheader2 hover:text-blue-700"
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
        <h3
          className="text-lg font-semibold text-text"
          data-testid="institution"
        >
          {item.institution}
        </h3>
      )}
      {item.title && (
        <h3 className="text-lg font-semibold text-text">{item.title}</h3>
      )}
      {item.name && (
        <h3 className="text-lg font-semibold text-text">{item.name}</h3>
      )}
      {item.skill && (
        <h3 className="text-lg font-semibold text-text">{item.skill}</h3>
      )}
      <p className="text-text2">
        {item.degree ||
          item.position ||
          item.company ||
          item.issuingOrganization}
      </p>

      <p className="text-text2">
        {item.location || item.field || item.fieldOfStudy}
      </p>

      <p className="text-text2">
        {item.startMonth && item.startYear
          ? `${item.startMonth} ${item.startYear}`
          : ""}
        {item.endMonth && item.endYear
          ? ` - ${item.endMonth} ${item.endYear}`
          : ""}
      </p>

      {item.description && (
        <p className="text-text2 text-sm">{item.description}</p>
      )}
      {item.grade && (
        <p className="text-companyheader2 text-sm" data-testid="grade">
          Grade: {item.grade}
        </p>
      )}

      {/* Skills endorsement */}
      {type === "skills" && item.skill && (
        <>
          {/* {item.recentEndorsement && (
            <p className="text-gray-500 text-sm flex items-center mt-1">
              {item.recentEndorsement}
            </p>
          )} */}
          <p
            className="text-companyheader2 flex items-center mt-1"
            data-testid="endorsement-count"
          >
            <span className="mr-2">👥</span> {endorsementCount} endorsement
            {endorsementCount !== 1 ? "s" : ""}
          </p>

          {!isOwner && (
            <button
              onClick={handleEndorse}
              className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit ${
                isEndorsed
                  ? "bg-gray-200 text-text2 border-companyheader2"
                  : "bg-white text-text-text2 border-companyheader2"
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

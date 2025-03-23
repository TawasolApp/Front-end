import React, { useState } from "react";
import GenericModal from "../Useless/GenericModal";

function GenericCard({ item, isOwner, type, onUpdate }) {
  const [isEndorsed, setIsEndorsed] = useState(false);
  const [endorsementCount, setEndorsementCount] = useState(
    item.endorsements || 0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedData) => {
    if (onUpdate) onUpdate(updatedData);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    alert(
      `Delete ${type}: ${
        item.title || item.institution || item.skill || item.name
      }`
    );
  };

  const handleEndorse = () => {
    setEndorsementCount((prev) => (isEndorsed ? prev - 1 : prev + 1));
    setIsEndorsed(!isEndorsed);
  };

  const renderHeader = () => (
    <h3 className="text-lg font-semibold">
      {item.title || item.institution || item.name || item.skill}
    </h3>
  );

  const renderSub = () => (
    <p className="text-gray-600">
      {item.company ||
        item.degree ||
        item.position ||
        item.issuingOrganization ||
        ""}
    </p>
  );

  const renderLocation = () => (
    <p className="text-gray-500">
      {item.location || item.field || item.fieldOfStudy || ""}
    </p>
  );

  const renderDateRange = () => {
    if (item.startMonth && item.startYear) {
      return (
        <p className="text-gray-500">
          {item.startMonth} {item.startYear} -{" "}
          {item.endMonth && item.endYear
            ? `${item.endMonth} ${item.endYear}`
            : "Present"}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full flex flex-col relative">
      {/* Edit/Delete Buttons */}
      {isOwner && (
        <div className="absolute top-2 right-2 flex gap-2 items-center">
          <button
            onClick={() => {
              console.log("edit clicked");
              setIsModalOpen(true);
            }} // ✅ Open modal
            className="text-gray-500 hover:text-blue-700 p-1"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-blue-700 p-1"
          >
            🗑
          </button>
        </div>
      )}

      {/* Card Content */}
      {renderHeader()}
      {renderSub()}
      {renderLocation()}
      {renderDateRange()}
      {item.description && (
        <p className="text-gray-700 text-sm mt-1">{item.description}</p>
      )}
      {item.grade && (
        <p className="text-gray-500 text-sm">Grade: {item.grade}</p>
      )}

      {/* Skills-specific endorsement UI */}
      {type === "skills" && (
        <>
          <p className="text-gray-600 flex items-center mt-1">
            <span className="mr-2">👥</span>
            {endorsementCount} endorsement{endorsementCount !== 1 ? "s" : ""}
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

      {/* ✅ Generic Modal */}
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

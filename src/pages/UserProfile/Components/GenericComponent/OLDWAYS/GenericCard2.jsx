import React, { useState } from "react";
import GenericModal2 from "./GenericModal2";

function GenericCard({ item, isOwner, type, onEdit, showEditIcons }) {
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
    if ((onUpdate, item.index)) {
      onUpdate(updatedData); // Send the updated data to the parent
    }
    setIsModalOpen(false);
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full flex flex-col space-y-0 relative">
      {/* Edit/Delete Buttons */}
      {isOwner && showEditIcons && (
        <button
          className="absolute top-2 right-2 flex gap-2 items-center"
          onClick={(e) => {
            e.stopPropagation(); // Prevent bubbling
            if (onEdit) onEdit(); // Ensure onEdit is defined
          }}
        >
          ✎
        </button>
      )}

      {/* Common Fields */}
      {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
      {item.institution && (
        <h3 className="text-lg font-semibold">{item.institution}</h3>
      )}
      {item.name && <h3 className="text-lg font-semibold">{item.name}</h3>}

      <p className="text-gray-600">
        {item.company ||
          item.degree ||
          item.position ||
          item.issuingOrganization ||
          ""}
      </p>
      <p className="text-gray-500">{item.location || item.field || ""}</p>

      {/* Certification-Specific Fields */}
      {type === "certifications" && (
        <p className="text-gray-500">
          {item.issueDate
            ? `Issued: ${new Date(item.issueDate).toLocaleDateString()}`
            : ""}
          {item.expirationDate
            ? ` | Expires: ${new Date(
                item.expirationDate
              ).toLocaleDateString()}`
            : ""}
        </p>
      )}
      {/* check for time if it is not included  */}
      <p className="text-gray-500">
        {item.startDate && item.endDate
          ? `${new Date(item.startDate).getFullYear()} - ${new Date(
              item.endDate
            ).getFullYear()}`
          : ""}
      </p>
      <p className="text-gray-700 text-sm">{item.description}</p>
      {item.grade && (
        <p className="text-gray-500 text-sm">Grade: {item.grade}</p>
      )}

      {/* Skills-Specific Section */}
      {type === "skills" && (
        <>
          {item.recentEndorsement && (
            <p className="text-gray-500 text-sm flex items-center mt-1">
              {item.recentEndorsement}
            </p>
          )}
          <p className="text-gray-600 flex items-center mt-1">
            <span className="mr-2">👥</span> {endorsementCount} endorsement
            {endorsementCount !== 1 ? "s" : ""}
          </p>

          {/* Show Endorsement Button Only for Viewers (Not Owners) */}
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
          {isModalOpen && (
            <GenericModal2
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              onDelete={handleDelete} // Make sure to pass this function
              type={type}
              initialData={item}
            />
          )}
        </>
      )}
    </div>
  );
}

export default GenericCard;

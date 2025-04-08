import React, { useState } from "react";
import GenericModal, { displayDate } from "./GenericModal";
import defaultExperienceImage from "../../../../assets/images/defaultExperienceImage.png";
import defaultEducationImage from "../../../../assets/images/defaultEducationImage.png";
import SkillEndorsement from "../SkillsComponents/SkillEndorsement";
import { useSelector } from "react-redux";

// Helper to skip rendering invalid entries
const isCardEmpty = (item, type) => {
  switch (type) {
    case "education":
      return !item?.school;
    case "workExperience":
      return !item?.company && !item?.title;
    case "skills":
      return !item?.skillName;
    case "certification":
      return !item?.name;
    default:
      return false;
  }
};

function GenericCard({
  item,
  isOwner,
  type,
  onEdit,
  showEditIcons = false,
  user,
  connectionStatus,
}) {
  const { userId } = useSelector((state) => state.authentication);
  const viewerId = userId;
  // const [isEndorsed, setIsEndorsed] = useState(false);
  // const [endorsementCount, setEndorsementCount] = useState(
  //   item.endorsements || 0
  // );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isCardEmpty(item, type)) return null;

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const renderExperience = () => (
    <div className="flex items-start gap-3 w-full">
      <img
        src={item.workExperiencePicture || defaultExperienceImage}
        alt={item.company || "Company Logo"}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text">{item.title}</h3>
        <p className="text-sm text-companyheader2 font-medium">
          {item.company}
        </p>

        {/* Location and Location Type */}
        {(item.location || item.locationType) && (
          <p className="text-text2 text-sm">
            {item.location}
            {item.location && item.locationType ? " • " : ""}
            {item.locationType === "on_site" && "On-site"}
            {item.locationType === "remote" && "Remote"}
            {item.locationType === "hybrid" && "Hybrid"}
          </p>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-text2 text-sm">{item.description}</p>
        )}

        {/* Dates */}
        {item.startDate && (
          <p className="text-text2 text-sm mt-1">
            {displayDate(item.startDate)}
            {item.endDate ? ` - ${displayDate(item.endDate)}` : ""}
          </p>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="flex items-start gap-3 w-full ">
      <img
        src={defaultEducationImage}
        alt="Education"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text" data-testid="school">
          {item.school}
        </h3>
        {item.degree && <p className="text-text2">{item.degree}</p>}
        {item.field && <p className="text-text2">{item.field}</p>}
        {item.grade && (
          <p className="text-companyheader2 text-sm" data-testid="grade">
            Grade: {item.grade}
          </p>
        )}
        {item.description && (
          <p className="text-text2 text-sm  whitespace-pre-wrap">
            {item.description}
          </p>
        )}
        {item.startDate && (
          <p className="text-text2 text-sm mt-1">
            {displayDate(item.startDate)}
            {item.endDate ? ` - ${displayDate(item.endDate)}` : ""}
          </p>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="break-all whitespace-pre-wrap w-full">
      <h3 className="text-lg font-semibold text-text">{item.skillName}</h3>

      {/* Position (optional) */}
      {item.position && <p className="text-text2 text-sm">{item.position}</p>}
      {!isOwner && connectionStatus === "Connection" && (
        <SkillEndorsement
          userId={user._id} // profile owner
          skillName={item.skillName}
          endorsements={item.endorsements || []}
          viewerId={viewerId} // logged-in user
        />
      )}
      {/* {!isOwner && (
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
      )} */}
      {/* {!isOwner && (
        <button
          onClick={handleEndorse}
          disabled={isEndorsed}
          className={`mt-2 px-4 py-2 border rounded-full flex items-center justify-center gap-2 w-fit
    ${isEndorsed ? "bg-gray-200 text-text2" : "bg-white text-text-text2"} 
    border-companyheader2 hover:bg-gray-300 transition`}
        >
          {isEndorsed ? "✔ Endorsed" : "Endorse"}
        </button>
      )} */}
    </div>
  );

  const renderCertifications = () => (
    <div className="flex items-start gap-3 w-full">
      <img
        src={item.certificationPicture || defaultExperienceImage}
        alt={item.company || "Certification Logo"}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text">{item.name}</h3>
        {item.company && (
          <p className="text-sm text-companyheader2 font-medium">
            {item.company}
          </p>
        )}
        {/* {item.credentialId && (
          <p className="text-text2 text-sm">ID: {item.credentialId}</p>
        )} */}
        {item.issueDate && (
          <p className="text-text2 text-sm mt-1">
            {displayDate(item.issueDate)}
            {item.expiryDate ? ` - ${displayDate(item.expiryDate)}` : ""}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-boxbackground p-4 rounded-lg shadow-sm w-full flex flex-col space-y-0 relative">
      {isOwner && showEditIcons && (
        <button
          className="absolute top-2 right-2 text-companyheader2 hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
            else setIsModalOpen(true);
          }}
        >
          ✎
        </button>
      )}

      {type === "workExperience" && renderExperience()}
      {type === "education" && renderEducation()}
      {type === "skills" && renderSkills()}
      {type === "certification" && renderCertifications()}

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

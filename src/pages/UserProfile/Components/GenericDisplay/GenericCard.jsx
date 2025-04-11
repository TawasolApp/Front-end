import React, { useState } from "react";
import GenericModal, { displayDate } from "./GenericModal";
import defaultExperienceImage from "../../../../assets/images/defaultExperienceImage.png";
import defaultEducationImage from "../../../../assets/images/defaultEducationImage.png";
import SkillEndorsement from "../SkillsComponents/SkillEndorsement";
import ExpandableText from "../ReusableModals/ExpandableText";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  connectStatus,
}) {
  const { userId } = useSelector((state) => state.authentication);
  const viewerId = userId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isCardEmpty(item, type)) return null;

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const renderExperience = () => (
    <div className="flex items-start gap-3 w-full">
      <img
        src={item.companyLogo || defaultExperienceImage}
        alt={item.company || "Company Logo"}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text">{item.title}</h3>
        {/* <p className="text-sm text-companyheader font-medium">
          {item.company}
          {item.employmentType && (
            <span className="ml-1">• {item.employmentType}</span>
          )}
        </p> */}
        <div className="text-sm text-companyheader font-medium">
          {item.companyId ? (
            <Link
              to={`/company/${item.companyId}`}
              className="text-blue-600 hover:underline"
            >
              {item.company}
            </Link>
          ) : (
            item.company
          )}
          {item.employmentType && (
            <span className="ml-1 text-companysubheader">
              · {item.employmentType}
            </span>
          )}
        </div>

        {/* Location and Location Type */}
        {(item.location || item.locationType) && (
          <p className="text-normaltext text-sm">
            {item.location && <span>{item.location}</span>}
            {item.location && item.locationType && (
              <span className="mx-1">•</span>
            )}
            {item.locationType && (
              <span>
                {item.locationType === "on_site" && "On-site"}
                {item.locationType === "remote" && "Remote"}
                {item.locationType === "hybrid" && "Hybrid"}
              </span>
            )}
          </p>
        )}
        {/* Dates */}
        {item.startDate && (
          <p
            className="text-companysubheader
           text-sm mt-1"
          >
            {displayDate(item.startDate)}
            {item.endDate ? ` - ${displayDate(item.endDate)}` : ""}
          </p>
        )}
        {/* Description */}
        {item.description && (
          <div className="mt-1 text-normaltext">
            <ExpandableText text={item.description} maxLines={3} />
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="flex items-start gap-3 w-full">
      <img
        src={item.companyLogo || defaultEducationImage}
        alt={item.school || "School"}
        className="w-10 h-10 rounded-full object-cover text-text"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text" data-testid="school">
          {item.companyId ? (
            <Link
              to={`/company/${item.companyId}`}
              className="text-blue-600 hover:underline"
            >
              {item.school}
            </Link>
          ) : (
            item.school
          )}
        </h3>

        {(item.degree || item.field) && (
          <p className="text-companyheader">
            {[item.degree, item.field].filter(Boolean).join(", ")}
          </p>
        )}

        {item.startDate && (
          <p className="text-companysubheader text-sm mt-1">
            {displayDate(item.startDate)}
            {item.endDate ? ` - ${displayDate(item.endDate)}` : ""}
          </p>
        )}

        {item.grade && (
          <p className="text-normaltext text-sm" data-testid="grade">
            Grade: {item.grade}
          </p>
        )}

        {item.description && (
          <div className="mt-1 text-normaltext">
            <ExpandableText text={item.description} maxLines={3} />
          </div>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="break-all whitespace-pre-wrap w-full">
      <h3 className="text-lg font-semibold text-text">{item.skillName}</h3>

      {/* Position (optional) */}
      {item.position && (
        <p className="text-companyheader text-sm">{item.position}</p>
      )}
      {!isOwner && connectStatus === "Connection" && (
        <SkillEndorsement
          userId={user._id} // profile owner
          skillName={item.skillName}
          endorsements={item.endorsements || []}
          viewerId={viewerId} // logged-in user
        />
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="flex items-start gap-3 w-full">
      <img
        src={item.companyLogo || defaultExperienceImage}
        alt={item.company || "Certification Logo"}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="break-all whitespace-pre-wrap w-full">
        <h3 className="text-lg font-semibold text-text">{item.name}</h3>
        {item.company && (
          <p className="text-sm text-companyheader font-medium">
            {item.companyId ? (
              <Link
                to={`/company/${item.companyId}`}
                className="text-blue-600 hover:underline"
              >
                {item.company}
              </Link>
            ) : (
              item.company
            )}
          </p>
        )}

        {item.issueDate && (
          <p
            className="text-companysubheader
           text-sm mt-1"
          >
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
          className="absolute top-2 right-2 text-companysubheader hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
            else setIsModalOpen(true);
          }}
        >
          ✎
        </button>
      )}
      <div className="pr-8">
        {type === "workExperience" && renderExperience()}
        {type === "education" && renderEducation()}
        {type === "skills" && renderSkills()}
        {type === "certification" && renderCertifications()}
      </div>

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

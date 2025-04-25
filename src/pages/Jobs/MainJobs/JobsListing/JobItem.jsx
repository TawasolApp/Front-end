import React from "react";

const JobItem = ({ job, isSelected }) => {
  return (
    <div
      className={`group flex items-start gap-3 cursor-pointer p-2 relative ${
        isSelected
          ? "border-l-2 border-selectedBorder bg-selectedBackground"
          : ""
      }`}
    >
      {/* Company Logo */}
      <div className="shrink-0">
        <img
          src={job.companyLogo}
          alt={`${job.companyName} logo`}
          className="w-12 h-12 object-cover mt-2"
        />
      </div>

      {/* Content Wrapper with top border */}
      <div className="flex-1 relative after:content-[''] after:absolute after:left-0 after:right-0 after:top-0 after:border-t after:border-cardBorder after:ml-[-3rem] after:pl-[3rem]">
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-medium text-blue-600 transition-all duration-300 group-hover:underline">
            {job.position}
          </h3>
          <div className="text-textContent">{job.companyName}</div>
          <div className="text-textPlaceholder">
            {job.location} · ({job.locationType})
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobItem;

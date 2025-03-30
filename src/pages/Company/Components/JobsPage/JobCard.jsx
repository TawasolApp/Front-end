import React from "react";

function JobCard({ job, onClick, isSelected, logo, name }) {
  return (
    <div
      className={`p-4 cursor-pointer flex items-center gap-4 ${
        isSelected ? "bg-selectedjob" : ""
      }`}
      onClick={onClick}
    >
      {logo && (
        <img
          src={logo}
          alt={name}
          className="h-10 w-10 object-contain rounded-md"
        />
      )}

      <div>
        <h2 className="font-semibold text-md text-blue-800">{job.title}</h2>
        <p className="text-sm text-text">{name?.toUpperCase()}</p>
        <p className="text-xs text-overviewcomponenttext">{job.location}</p>
      </div>
    </div>
  );
}

export default JobCard;

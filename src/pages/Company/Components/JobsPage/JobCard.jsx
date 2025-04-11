import React from "react";

function JobCard({ job, onClick, isSelected, logo, name }) {
  return (
    <div
      data-testid={`job-card-${job.jobId}`}
      className={`p-3 sm:p-4 cursor-pointer flex items-start sm:items-center gap-3 sm:gap-4 rounded-md transition ${
        isSelected ? "bg-selectedjob" : "hover:bg-cardBackgroundHover"
      }`}
      onClick={onClick}
    >
      {logo && (
        <img
          src={logo}
          alt={name}
          className="h-10 w-10 object-contain rounded-md shrink-0"
        />
      )}

      <div className="flex-1">
        <h2 className="font-semibold text-sm sm:text-md text-blue-800 line-clamp-1">
          {job.position}
        </h2>
        <p className="text-sm text-text truncate">{name?.toUpperCase()}</p>
        <p className="text-xs text-overviewcomponenttext truncate">
          {job.location}
        </p>
      </div>
    </div>
  );
}

export default JobCard;

import React, { useState } from "react";
import ApplyModal from "./ApplyModal";

function JobDetails({ job, logo, name }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  if (!job) return <div className="w-1/2 p-6">Select a job to see details</div>;

  const handleApplyClick = () => {
    setIsApplyOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyOpen(false);
  };

  return (
    <div className="w-1/2 p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-4">
        {logo && (
          <img
            src={logo}
            alt={name}
            className="h-12 w-12 object-contain rounded-md"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-text">{job.title}</h1>
          <p className="text-md text-text">{name?.toUpperCase()}</p>
          <p className="text-sm text-overviewcomponenttext">{job.location}</p>
        </div>
      </div>

      <p className="text-sm text-text">{job.description}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleApplyClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button className="border px-4 py-2 rounded text-text">Save</button>
      </div>

      {isApplyOpen && (
        <ApplyModal onClose={handleCloseModal} job={job} company={name} />
      )}
    </div>
  );
}

export default JobDetails;

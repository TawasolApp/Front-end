import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import ApplyModal from "./ApplyModal";
import { formatDistanceToNow } from "date-fns";

function JobDetails({ job, logo, name }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  if (!job)
    return (
      <div className="w-full md:w-1/2 p-6">Select a job to see details</div>
    );

  const handleApplyClick = () => setIsApplyOpen(true);
  const handleCloseModal = () => setIsApplyOpen(false);

  return (
    <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto text-text bg-boxbackground rounded-md shadow max-h-[70vh] md:max-h-full">
      <div className="flex items-start justify-between flex-wrap">
        <div className="flex items-center gap-3">
          {logo && (
            <img
              src={logo}
              alt={name}
              className="h-10 w-10 rounded-md object-contain"
            />
          )}
          <p className="text-sm font-semibold text-normaltext uppercase">
            {name}
          </p>
        </div>
      </div>

      <h1 className="mt-2 text-2xl font-semibold text-text">{job.position}</h1>

      <p className="text-sm text-companysubheader mt-1">
        {job.location}
        {job.postedAt && (
          <>
            {" • "}
            {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
          </>
        )}
        {typeof job.applicants === "number" && job.applicants > 0 && (
          <> • {job.applicants} people clicked apply</>
        )}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="bg-selectedjob px-3 py-1 rounded-full text-xs text-text">
          {job.locationType || "On-site"}
        </span>
        <span className="bg-selectedjob px-3 py-1 rounded-full text-xs text-text">
          {job.employmentType || "Full-time"}
        </span>
      </div>

      <div className="mt-4">
        <button
          onClick={handleApplyClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-text px-5 py-2 rounded-md text-sm font-medium"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
          Apply
        </button>
      </div>

      {/* About the Job Section (only if description is available) */}
      {job.description && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">About the Job</h3>
          <p className="text-sm text-companysubheader leading-relaxed">
            {job.description}
          </p>
        </div>
      )}

      {/* Experience Section (only if experienceLevel is available) */}
      {job.experienceLevel && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Experience</h3>
          <p className="text-sm text-companysubheader leading-relaxed">
            {job.experienceLevel}
          </p>
        </div>
      )}

      {/* Salary Section (only if salary is available) */}
      {job.salary && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Salary</h3>
          <p className="text-sm text-companysubheader leading-relaxed">
            {job.salary}
          </p>
        </div>
      )}

      {isApplyOpen && (
        <ApplyModal onClose={handleCloseModal} job={job} company={name} />
      )}
    </div>
  );
}

export default JobDetails;

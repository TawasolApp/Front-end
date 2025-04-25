import React from "react";
import { formatDate } from "../../../../utils/dates";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="bg-cardBackground rounded-lg border border-cardBorder shadow-sm hover:shadow-lg">
      <Link 
        to={`/jobs/${job.jobId}`}
        className="block p-4 transition-colors"
      >
        <div className="gap-4">
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="w-20 h-20 object-contain rounded"
          />

          <div className="pt-2 flex-1">
            <h3 className="text-base font-semibold text-header">
              {job.position}
            </h3>
            <div className="mt-1 text-sm font-normal text-textTitle">
              {job.companyName}
            </div>
            <div className="mt-0.5 text-sm font-normal text-textPlaceholder">
              {job.location}
            </div>
            <p className="mt-2 text-xs font-normal text-textPlaceholder">
              {formatDate(job.postedAt)} ago
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default JobCard;

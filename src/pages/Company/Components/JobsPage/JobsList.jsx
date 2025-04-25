import React from "react";
import JobCard from "./JobCard";
import { Link } from "react-router-dom";

const JobsList = ({ jobs, companyId, isAdmin }) => {
  return (
    <div className="border border-cardBorder rounded-lg bg-cardBackground shadow-sm">
      <div className="p-4">
        <h2 className="font-normal text-lg text-header">Recently posted jobs</h2>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex overflow-x-auto pb-2 gap-4 hide-scrollbar">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.jobId} className="min-w-[280px] max-w-[300px] flex-shrink-0">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cardBorder">
        <Link 
          to={`/jobs/company/${companyId}/${isAdmin}`}
          className="flex items-center justify-center gap-2 text-textPlaceholder text-base font-semibold py-4"
        >
          <span>Show all jobs</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default JobsList;

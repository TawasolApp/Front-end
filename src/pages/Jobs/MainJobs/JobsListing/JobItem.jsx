import React from 'react';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { axiosInstance } from '../../../../apis/axios';

const JobItem = ({ job, isSelected }) => {

  const handleSaveJob = async () => {

    if (job.isSaved) {
      await axiosInstance.delete(`/jobs/${job.jobId}/unsave`);
      // add toast here
    } else {
      await axiosInstance.post(`/jobs/${job.jobId}/save`);
      // add toast here
    }
  }

  return (
    <div 
      className={`group flex items-start gap-3 cursor-pointer ${
        isSelected 
          ? 'border-l-2 border-selectedBorder bg-selectedBackground' 
          : ''
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

      {/* Text Content */}
      <div className={`flex-1 ${
        !isSelected ? 'border-b border-cardBorder pb-4' : ''
      }`}>
        <h3 className="text-lg font-medium text-blue-600 transition-all duration-300 group-hover:underline">
          {job.position}
        </h3>
        <div className="mt-1 text-textContent">{job.companyName}</div>
        <div className="text-textPlaceholder">
          {job.location} · ({job.locationType})
        </div>
      </div>

      <button className="shrink-0 text-textActivity transition-colors hover:text-textActivityHover">
        {job.isSaved ? (
          <BookmarkIcon className="!w-6 !h-6" />
        ) : (
          <BookmarkBorderIcon className="!w-6 !h-6" />
        )}
      </button>
    </div>
  );
};

export default JobItem;
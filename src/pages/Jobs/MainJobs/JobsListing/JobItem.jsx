import React from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { axiosInstance } from "../../../../apis/axios";
import { toast } from "react-toastify";

const JobItem = ({ job, isSelected }) => {
  const handleSaveJob = async () => {
    if (job.isSaved) {
      await axiosInstance.delete(`/jobs/${job.jobId}/unsave`);
      toast.success("Job unsaved.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      await axiosInstance.post(`/jobs/${job.jobId}/save`);
      toast.success("Job saved.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  };

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

      <button
        className="shrink-0 text-textActivity transition-colors hover:text-textActivityHover self-start"
        onClick={() => handleSaveJob()}
      >
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

import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosInstance } from "../../../../apis/axios";
import { toast } from "react-toastify";

const JobItem = ({ job, isSelected, isAdmin, onDelete }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/jobs/${job.jobId}`);
      toast.success("Job deleted successfully", {
        position: "bottom-left",
        autoClose: 3000,
      });
      if (onDelete) onDelete(job.jobId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
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

        {/* Admin Delete Button */}
        {isAdmin && (
          <button 
            onClick={handleDelete}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors p-1"
            aria-label="Delete job"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobItem;

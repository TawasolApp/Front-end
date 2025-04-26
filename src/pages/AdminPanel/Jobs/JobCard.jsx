import React from "react";
import { FiTrash2, FiFlag } from "react-icons/fi";
import { axiosInstance as axios } from "../../../apis/axios"; // adjust if needed

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Viewed: "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
  Accepted: "bg-green-100 text-green-700",
};

function JobCard({ job, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/jobs/${job.jobId}`);
      if (onDelete) {
        onDelete(job.jobId);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };
  const handleIgnore = async () => {
    try {
      // your API call here to ignore the job (if exists)
      console.log(`Ignoring job: ${job.jobId}`);
      // maybe call an API: await axios.patch(`/jobs/${job.jobId}/ignore`)
      // and optionally remove the flag from UI if needed
    } catch (error) {
      console.error("Failed to ignore job:", error);
    }
  };
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_0.7fr] gap-y-4 gap-x-6 p-4 bg-boxbackground text-text border-2 ${
        job.isFlagged ? "border-red-600" : "border-card"
      }`}
    >
      {/* Job Details */}
      <div className="flex items-center space-x-3">
        {job.companyLogo && (
          <img
            src={job.companyLogo}
            alt={`${job.companyName} Logo`}
            className="w-10 h-10 object-cover rounded-md"
          />
        )}
        <div>
          <h3 className="font-semibold text-base">{job.position}</h3>
          <p className="text-companysubheader text-sm">
            {job.companyName} • {job.location}
          </p>
          {job.isFlagged && (
            <p className="text-error text-sm mt-1">
              <FiFlag className="inline text-error ml-1" title="Flagged" />{" "}
              Flagged
            </p>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center text-sm text-textContent">
        {new Date(job.postedAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center space-x-2">
        <button
          onClick={handleIgnore}
          className="flex items-center justify-center gap-2 w-24 h-9 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm"
        >
          Ignore
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 w-24 h-9 bg-error hover:bg-red-700 text-white rounded text-sm"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;

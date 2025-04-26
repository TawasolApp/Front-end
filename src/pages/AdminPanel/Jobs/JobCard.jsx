import React from "react";
import { FiEyeOff, FiEdit2, FiTrash2, FiCheck, FiFlag } from "react-icons/fi";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-200 text-gray-700",
  "Pending Review": "bg-yellow-100 text-yellow-800",
};

function JobCard({ job }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 p-4 bg-boxbackground text-text ${
        job.flagged ? "border-2 border-red-600" : ""
      }`}
    >
      {/* Job Details */}
      <div>
        <h3 className="font-semibold text-base flex items-center">
          {job.title}
          {job.flagged && (
            <FiFlag className="inline text-error ml-1" title="Flagged" />
          )}
        </h3>
        <p className="text-companysubheader text-sm">
          {job.company} • {job.location}
        </p>
        {job.flagged && (
          <p className="text-error text-sm mt-1">Flagged: {job.reason}</p>
        )}
      </div>

      {/* Status */}
      <div className="flex sm:justify-start items-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[job.status]}`}
        >
          {job.status}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center text-sm text-textContent">
        🕒 {job.date}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-start sm:justify-end text-lg">
        <FiEyeOff
          className="cursor-pointer text-icon hover:bg-buttonHover rounded-full h-7 w-7 p-1"
          title="Hide"
        />
        {job.status === "Pending Review" && (
          <FiCheck
            className="cursor-pointer text-green-600 hover:bg-buttonHover rounded-full h-7 w-7 p-1"
            title="Approve"
          />
        )}
        <FiEdit2 className="cursor-pointer text-purple-600" title="Edit" />
        <FiTrash2
          className="cursor-pointer text-error hover:bg-buttonHover rounded-full h-7 w-7 p-1"
          title="Delete"
        />
      </div>
    </div>
  );
}

export default JobCard;

import React, { useState } from "react";
import { FiTrash2, FiFlag } from "react-icons/fi";
import { axiosInstance as axios } from "../../../apis/axios";

function JobCard({ job, onDelete }) {
  const [stillFlagged, setStillFlagged] = useState(job.isFlagged);
  const [ignoreLoading, setIgnoreLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/jobs/${job.jobId}`);
      if (onDelete) {
        onDelete(job.jobId);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleIgnore = async () => {
    setIgnoreLoading(true);
    try {
      await axios.patch(`/admin/${job.jobId}/ignore`);
      setStillFlagged(false);
    } catch (error) {
      console.error("Failed to ignore job:", error);
    } finally {
      setIgnoreLoading(false);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_0.7fr] gap-y-4 gap-x-6 p-4 bg-boxbackground text-text border-2 ${
        job.isFlagged && stillFlagged ? "border-red-600" : "border-card"
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
          {job.isFlagged && stillFlagged && (
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
        {job.isFlagged && stillFlagged && (
          <button
            onClick={handleIgnore}
            disabled={ignoreLoading}
            className={`flex items-center justify-center gap-2 w-24 h-9 rounded text-sm ${
              ignoreLoading
                ? "bg-gray-400 text-gray-600"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            {ignoreLoading ? "Ignoring..." : "Ignore"}
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className={`flex items-center justify-center gap-2 w-24 h-9 rounded text-sm ${
            deleteLoading
              ? "bg-red-300 text-red-100"
              : "bg-error hover:bg-red-700 text-white"
          }`}
        >
          {deleteLoading ? (
            "Deleting..."
          ) : (
            <>
              <FiTrash2 />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default JobCard;

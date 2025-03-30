import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";

function JobApplications({ job, companyId }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!job || !companyId) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/companies/${companyId}/applicants`,
          {
            params: { job: job.id },
          }
        );
        setApplicants(response.data);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job, companyId]);

  if (!job) {
    return <div className="w-1/2 p-6">Select a job to see applicants</div>;
  }

  return (
    <div className="w-1/2 p-6 overflow-y-auto text-text bg-boxbackground rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">
        Applicants for {job.position}
      </h2>

      {loading ? (
        <p className="text-sm text-gray-400">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-sm text-gray-400">No applicants yet.</p>
      ) : (
        <ul className="space-y-2">
          {applicants.map((applicant) => (
            <li
              key={applicant.userId}
              className="border p-3 rounded flex items-center gap-4"
            >
              <img
                src={applicant.profilePicture}
                alt={`${applicant.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-text">{applicant.username}</p>
                <p className="text-sm text-companysubheader">
                  {applicant.headline}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobApplications;

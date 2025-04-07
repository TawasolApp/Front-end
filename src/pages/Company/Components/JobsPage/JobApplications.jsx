import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import LoadingPage from "../../../LoadingScreen/LoadingPage";

function JobApplications({ job }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/companies/jobs/${job.jobId}/applicants`,
          {
            params: {
              page,
              limit,
              ...(searchName.trim() && { name: searchName.trim() }),
            },
          }
        );
        setApplicants(res.data);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job, page, searchName]);

  if (!job) {
    return (
      <div className="w-full md:w-1/2 p-4 md:p-6 text-center text-companysubheader">
        Select a job to see applicants
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto text-text bg-boxbackground rounded-md shadow max-h-[70vh] md:max-h-full">
      <h2 className="text-xl font-semibold mb-4">
        Applicants for {job.position}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[150px]">
          <LoadingPage />
        </div>
      ) : applicants.length === 0 ? (
        <p className="text-sm text-gray-400">No applicants yet.</p>
      ) : (
        <ul className="space-y-3">
          {applicants.map((applicant) => (
            <li
              key={applicant.userId}
              className="flex items-center gap-4 p-3 border border-gray-700 rounded-md bg-boxbackground"
            >
              <img
                src={applicant.profilePicture}
                alt={`${applicant.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{applicant.username}</p>
                <p className="text-sm text-companysubheader truncate">
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

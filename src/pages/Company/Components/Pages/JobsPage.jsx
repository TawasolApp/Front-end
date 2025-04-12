import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios.js";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import JobsList from "../JobsPage/JobsList.jsx";
import JobDetails from "../JobsPage/JobDetails";
import JobApplications from "../JobsPage/JobApplications";
import AddJobModal from "../JobsPage/AddJobModal";
import Analytics from "../JobsPage/Analytics.jsx";

function JobsPage() {
  const { company, showAdminIcons, setShowAdminIcons } = useOutletContext();
  const { companyId } = useParams();
  const [loading, setLoading] = useState(!company);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (companyId && company && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      axiosInstance
        .get(`/companies/${companyId}/jobs?page=1&limit=10`)
        .then((res) => {
          setJobs(res.data);
          setSelectedJob(res.data[0] || null);
        })
        .catch((err) => console.error("Failed to fetch jobs", err))
        .finally(() => setLoading(false));
    }
  }, [companyId, company]);

  const handleJobAdded = () => {
    setLoading(true);
    axiosInstance
      .get(`/companies/${companyId}/jobs?page=1&limit=10`)
      .then((res) => {
        setJobs(res.data);
        setSelectedJob(res.data[0] || null);
      })
      .catch((err) => console.error("Failed to refetch jobs after add", err))
      .finally(() => setLoading(false));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Post Job Button (only for admin/owner) */}
      {showAdminIcons && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post a Job Opening
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddJobModal
          onClose={handleCloseModal}
          companyId={companyId}
          onJobAdded={handleJobAdded}
        />
      )}
      {jobs.length > 0 && (
        <div className="bg-boxbackground p-4 shadow-md rounded-md w-full">
          <div className="flex flex-col md:flex-row h-auto md:h-[600px] gap-4">
            {/* Left: Fixed Job List */}
            <JobsList
              jobs={jobs}
              onSelectJob={setSelectedJob}
              selectedJob={selectedJob}
              logo={
                company.logo ||
                "https://media.licdn.com/dms/image/D4E12AQFuCmxN72C2yQ/article-cover_image-shrink_720_1280/0/1702503196049?e=2147483647&v=beta&t=9HHff4rJDnxuWrqfzPqX9j2dncDBKQeShXf2Wt5nrUc"
              }
              name={company.name}
            />

            {/* Right: Conditional Panel */}
            {showAdminIcons ? (
              <JobApplications job={selectedJob} />
            ) : (
              <JobDetails
                job={selectedJob}
                logo={
                  company.logo ||
                  "https://media.licdn.com/dms/image/D4E12AQFuCmxN72C2yQ/article-cover_image-shrink_720_1280/0/1702503196049?e=2147483647&v=beta&t=9HHff4rJDnxuWrqfzPqX9j2dncDBKQeShXf2Wt5nrUc"
                }
                name={company.name}
              />
            )}
          </div>
        </div>
      )}
      {showAdminIcons && <Analytics jobs={jobs} />}
    </div>
  );
}

export default JobsPage;

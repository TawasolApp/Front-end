import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios.js";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import JobsList from "../JobsPage/JobsList.jsx";
import JobDetails from "../JobsPage/JobDetails";
import JobApplications from "../JobsPage/JobApplications";
import AddJobModal from "../JobsPage/AddJobModal";
import Analytics from "../JobsPage/Analytics.jsx";

function JobsPage() {
  const isAdmin = true; // you can toggle or pass this dynamically
  const location = useLocation();
  const { companyId } = useParams();

  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch company if not passed via route
  useEffect(() => {
    if (!company) {
      setLoading(true);
      axiosInstance
        .get(`/companies/${companyId}`)
        .then((response) => {
          setCompany(response.data);
        })
        .catch((error) => console.error("Error fetching company:", error))
        .finally(() => setLoading(false));
    }
  }, [company, companyId]);

  // Fetch jobs on mount and when switching views
  useEffect(() => {
    if (companyId) {
      axiosInstance
        .get(`/companies/${companyId}/jobs`)
        .then((res) => {
          setJobs(res.data);
          setSelectedJob(res.data[0] || null);
        })
        .catch((err) => console.error("Failed to fetch jobs", err));
    }
  }, [companyId, isAdmin]);

  const handleJobAdded = () => {
    axiosInstance
      .get(`/companies/${companyId}/jobs`)
      .then((res) => {
        setJobs(res.data);
        setSelectedJob(res.data[0] || null);
      })
      .catch((err) => console.error("Failed to refetch jobs after add", err));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Post Job Button (only for admin/owner) */}
      {isAdmin && (
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

      <div className="bg-boxbackground p-4 shadow-md rounded-md w-full">
        <div className="flex h-[600px] bg-boxbackground shadow rounded-md">
          {/* Left: Fixed Job List */}
          <JobsList
            jobs={jobs}
            onSelectJob={setSelectedJob}
            selectedJob={selectedJob}
            logo={company.logo}
            name={company.name}
          />

          {/* Right: Conditional Panel */}
          {isAdmin ? (
            <JobApplications job={selectedJob} />
          ) : (
            <JobDetails
              job={selectedJob}
              logo={company.logo}
              name={company.name}
            />
          )}
        </div>
      </div>
      {isAdmin && <Analytics jobs={jobs} />}
    </div>
  );
}

export default JobsPage;

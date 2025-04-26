import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios";
import LoadingPage from "../../../LoadingScreen/LoadingPage";
import JobsList from "../JobsPage/JobsList";
import AddJobModal from "../JobsPage/AddJobModal";
import Analytics from "../JobsPage/Analytics";

const JobsPage = () => {
  const { company, showAdminIcons } = useOutletContext();
  const { companyId } = useParams();
  const [loading, setLoading] = useState(!company);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (companyId && company && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      axiosInstance
        .get(`/companies/${companyId}/jobs?page=1&limit=3`)
        .then((res) => {
          setJobs(res.data);
        })
        .catch((err) => console.error("Failed to fetch jobs", err))
        .finally(() => setLoading(false));
    }
  }, [companyId, company]);

  const handleAddJob = () => {
    setLoading(true);
    axiosInstance
      .get(`/companies/${companyId}/jobs?page=1&limit=3`)
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => console.error("Failed to refetch jobs after add", err))
      .finally(() => setLoading(false));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return <LoadingPage />;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Post Job Button */}
      {showAdminIcons && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleOpenModal}
            className="bg-buttonSubmitEnable text-buttonSubmitText px-4 py-2 rounded-lg hover:bg-buttonSubmitEnableHover transition"
          >
            Post a Job
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddJobModal
          onClose={handleCloseModal}
          companyId={companyId}
          onJobAdded={handleAddJob}
        />
      )}

      {jobs.length > 0 && (
        <div className="w-full">
          {/* Jobs List */}
          <JobsList
            jobs={jobs}
            companyId={companyId}
            isAdmin={showAdminIcons}
          />
        </div>
      )}

      {/* Analytics */}
      {showAdminIcons && <Analytics jobs={jobs} className="mt-6" />}
    </div>
  );
}

export default JobsPage;

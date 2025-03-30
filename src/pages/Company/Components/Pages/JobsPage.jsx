import React from "react";
import OwnerView from "../JobsPage/OwnerView";
import ViewerView from "../JobsPage/ViewerView";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios.js";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
function JobsPage() {
  const isAdmin = true;
  const location = useLocation();
  const { companyId } = useParams();

  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

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

  useEffect(() => {
    if (companyId) {
      axiosInstance
        .get(`/companies/${companyId}/jobs`)
        .then((res) => {
          setJobs(res.data);
          setSelectedJob(res.data[0]);
        })
        .catch((err) => console.error("Failed to fetch jobs", err));
    }
  }, [companyId]);

  const handleJobAdded = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div>
      {isAdmin ? (
        <OwnerView
          logo={company.logo}
          name={company.name}
          companyId={companyId}
          onJobAdded={handleJobAdded}
          jobs={jobs}
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
        />
      ) : (
        <ViewerView
          logo={company.logo}
          name={company.name}
          jobs={jobs}
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
        />
      )}
    </div>
  );
}
export default JobsPage;

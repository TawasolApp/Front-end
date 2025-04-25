import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../apis/axios";
import JobItem from "./JobItem";
import JobDescription from "../JobDescription/JobDescription";
import ApplicantsList from "../ApplicantsList/ApplicantsList";

const SkeletonLoader = () => (
  <div className="animate-pulse p-4 border-b border-cardBorder">
    <div className="flex items-start space-x-3">
      <div className="w-12 h-12 rounded bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

const JobListing = ({ API_URL, filters, isAdmin = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const observer = useRef();
  const limit = 5;
  const navigate = useNavigate();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth <= 768 && selectedJob) {
        !isAdmin && navigate(`/jobs/${selectedJob}`, { replace: true }); // Cleanup mobile URL
        isAdmin && navigate(`/applicants/${selectedJob}`, { replace: true }); // Cleanup mobile URL
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedJob]);

  const handleJobClick = (job) => {
    if (isMobile) {
      !isAdmin && navigate(`/jobs/${job.jobId}`);
      isAdmin && navigate(`/applicants/${job.jobId}`);
    } else {
      setSelectedJob(job.jobId);
    }
  };

  const fetchJobs = useCallback(
    async (isNewFilter = false) => {
      if (!hasMore && !isNewFilter) return;

      setLoading(true);
      try {
        if (isNewFilter) setJobs([]); // Clear jobs immediately for new filters
        const currentPage = isNewFilter ? 1 : page;

        const params = {
          page: currentPage,
          limit: limit,
          keyword: filters.keyword === "" ? undefined : filters.keyword,
          location: filters.location === "" ? undefined : filters.location,
          industry: filters.industry === "" ? undefined : filters.industry,
          experienceLevel: filters.experienceLevel || undefined,
          minSalary: Number(filters.salaryRange[0]) || undefined,
          maxSalary: Number(filters.salaryRange[1]) || undefined,
          company: filters.company || undefined,
        };

        Object.keys(params).forEach(
          (key) => params[key] === undefined && delete params[key],
        );

        const response = await axiosInstance.get(API_URL, { params });
        const newJobs = response.data;
        console.log(newJobs);

        setJobs((prev) => (isNewFilter ? newJobs : [...prev, ...newJobs]));
        setHasMore(newJobs.length === limit);
        setError(null);

        if (isNewFilter) setPage(1);
      } catch (err) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, filters, page, hasMore],
  );

  // Infinite scroll observer
  const lastJobElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchJobs(true);
  }, [filters]);

  // Page changes
  useEffect(() => {
    if (page > 1) fetchJobs();
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-6 md:flex md:justify-center">
      <div className="md:flex md:max-w-7xl md:w-full md:gap-0">
        {/* Listings Container */}
        <div className="bg-cardBackground shadow-sm md:w-1/2 lg:w-1/3 border border-cardBorder">
          <div className="px-4 pt-4 pb-2 border-b border-cardBorder">
            <h2 className="text-xl font-semibold text-header">
              Top job picks for you
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {jobs.length > 0
                ? `${jobs.length} results`
                : "Based on your profile and activity"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
              {error}
            </div>
          )}

          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {loading ? (
              // Skeleton Loaders
              Array(3)
                .fill()
                .map((_, i) => <SkeletonLoader key={i} />)
            ) : jobs.length === 0 ? (
              // Enhanced Empty State
              <div className="text-center py-12 px-4">
                <div className="mx-auto mb-6 w-24 h-24 bg-mainBackground rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-textActivity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-header">
                  No jobs found
                </h3>
                <p className="mt-2 text-textPlaceholder max-w-md mx-auto">
                  Try adjusting your filters or search terms. We'll update
                  results as new jobs come in.
                </p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div
                  ref={index === jobs.length - 1 ? lastJobElementRef : null}
                  key={job.jobId}
                  onClick={() => handleJobClick(job)}
                  className="cursor-pointer"
                >
                  <JobItem
                    job={job}
                    isSelected={job.jobId === selectedJob}
                    isMobile={isMobile}
                    isAdmin={isAdmin}
                  />
                </div>
              ))
            )}

            {!hasMore && jobs.length > 0 && (
              <div className="relative p-4 flex justify-center items-center">
                <div className="relative z-10 bg-cardBackground px-6 py-3 rounded-full shadow-md text-sm text-gray-600 font-medium border border-transparent hover:border-blue-400 transition-colors duration-300">
                  🎉 You've reached the end!
                </div>

                {/* Glowing ring effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[60px] rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl opacity-60 pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Panel */}
        {!isMobile && (
          <div className="hidden md:block flex-1 bg-cardBackground rounded-r-lg shadow-sm">
            {selectedJob ? (
              isAdmin ? (
                <ApplicantsList jobId={selectedJob} enableReturn={false} />
              ) : (
                <JobDescription jobId={selectedJob} enableReturn={false} />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-cardBorder">
                <div className="mb-4 w-16 h-16 bg-mainBackground rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-textActivity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-header">
                  Select a job to view details
                </h3>
                <p className="mt-2 text-textPlaceholder max-w-md mx-auto">
                  Click on any job listing to see full description,
                  requirements, and application details
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;

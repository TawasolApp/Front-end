import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import LoadingPage from "../../LoadingScreen/LoadingPage";
import { axiosInstance as axios } from "../../../apis/axios";

function Jobs() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleDeleteJob = (deletedJobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== deletedJobId));
    setTotalItems((prevTotal) => prevTotal - 1);
  };

  useEffect(() => {
    async function fetchJobs() {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const response = await axios.get("/jobs", {
          params: {
            page,
            limit,
            keyword: search || undefined,
          },
        });
        setJobs((prevJobs) =>
          page === 1 ? response.data.jobs : [...prevJobs, ...response.data.jobs]
        );
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        if (page === 1) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    }

    fetchJobs();
  }, [page, limit, search]); // <-- re-fetch if page, limit, or search changes

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      filter === "All" ||
      job.status === filter ||
      (filter === "Flagged" && job.isFlagged);
    const matchesSearch = job.position
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text">Job Listings</h2>
          <p className="text-textContent">
            Manage job postings and flagged listings
          </p>
        </div>
      </div>
      <div className="text-sm text-textContent">
        Showing {jobs.length} of {totalItems} jobs
      </div>
      {/* Filters */}
      <JobFilters current={filter} onChange={setFilter} />

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        className="w-full px-3 py-2 border border-itemBorder rounded-md bg-inputBackground text-text placeholder-textPlaceholder focus:outline-none focus:ring-2 focus:ring-buttonSubmitEnable"
        value={search}
        onChange={(e) => {
          setPage(1); // <-- RESET page to 1 whenever search changes!
          setSearch(e.target.value);
        }}
      />

      {/* Job Table */}
      <div className="rounded-md overflow-hidden border border-card border-opacity-40">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_0.7fr] gap-4 px-4 py-3 font-semibold text-sm text-companysubheader bg-boxbackground border-b border-itemBorder">
          <div>JOB DETAILS</div>
          <div>DATE POSTED</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {/* Job Rows */}
        <div>
          {loading && page === 1 ? (
            <LoadingPage />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.jobId} job={job} onDelete={handleDeleteJob} />
            ))
          ) : (
            <div className="text-center p-6 text-textContent">
              No jobs found
            </div>
          )}
        </div>
      </div>
      {page < totalPages && !search.trim() && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-buttonSubmitEnable hover:bg-buttonSubmitHover text-white rounded-md flex items-center justify-center gap-2"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  data-testid="spinner"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "See More"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Jobs;

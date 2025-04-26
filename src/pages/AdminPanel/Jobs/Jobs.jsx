import React, { useState } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import JobStats from "./JobStats";

function Jobs() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      status: "Active",
      date: "2025-03-25",
      flagged: false,
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      location: "Remote",
      status: "Active",
      date: "2025-03-27",
      flagged: true,
      reason: "Suspicious contact information",
    },
    {
      id: 3,
      title: "Project Manager",
      company: "ManageCo",
      location: "New York, NY",
      status: "Pending Review",
      date: "2025-03-28",
      flagged: false,
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataInsights",
      location: "Boston, MA",
      status: "Active",
      date: "2025-03-26",
      flagged: true,
      reason: "Discriminatory language",
    },
    {
      id: 5,
      title: "Marketing Specialist",
      company: "BrandBoost",
      location: "Chicago, IL",
      status: "Inactive",
      date: "2025-03-20",
      flagged: false,
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      filter === "all" ||
      job.status.toLowerCase() === filter ||
      (filter === "flagged" && job.flagged);
    const matchesSearch = job.title
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

      {/* Filters */}
      <JobFilters current={filter} onChange={setFilter} />

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        className="w-full px-3 py-2 border border-itemBorder rounded-md bg-inputBackground text-text placeholder-textPlaceholder focus:outline-none focus:ring-2 focus:ring-buttonSubmitEnable"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Job Table */}
      <div className="rounded-md overflow-hidden border border-card border-opacity-40">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 font-semibold text-sm text-companysubheader bg-boxbackground border-b border-itemBorder">
          <div>JOB DETAILS</div>
          <div>STATUS</div>
          <div>DATE POSTED</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {/* Job Rows */}
        <div>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <JobStats jobs={jobs} />
    </div>
  );
}

export default Jobs;

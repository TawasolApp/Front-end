import React from "react";
import JobCard from "./JobCard";

function JobsList({ jobs, onSelectJob, selectedJob, logo, name }) {
  return (
    <div className="w-1/2 border-r overflow-y-auto">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSelected={selectedJob?.id === job.id}
          onClick={() => onSelectJob(job)}
          logo={logo}
          name={name}
        />
      ))}
    </div>
  );
}

export default JobsList;

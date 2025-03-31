import React from "react";
import JobCard from "./JobCard";

function JobsList({ jobs, onSelectJob, selectedJob, logo, name }) {
  return (
    <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r max-h-[300px] md:max-h-full overflow-y-auto pr-2">
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

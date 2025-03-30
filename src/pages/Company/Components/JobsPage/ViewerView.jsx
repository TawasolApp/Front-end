import React from "react";
import JobsList from "./JobsList";
import JobDetails from "./JobDetails";
function ViewerView({ logo, name, jobs, selectedJob, onSelectJob }) {
  return (
    <div className="bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      <div className="flex h-[600px] bg-boxbackground shadow rounded-md">
        <JobsList
          jobs={jobs}
          onSelectJob={onSelectJob}
          selectedJob={selectedJob}
          logo={logo}
          name={name}
        />
        <JobDetails job={selectedJob} logo={logo} name={name} />
      </div>
    </div>
  );
}

export default ViewerView;

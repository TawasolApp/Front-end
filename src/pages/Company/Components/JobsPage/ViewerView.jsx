import React, { useState } from "react";
import JobsList from "./JobsList";
import JobDetails from "./JobDetails";
import mockJobs from "../../jobstest";

function ViewerView({ logo, name }) {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);

  return (
    <div className="bg-boxbackground p-4 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-8">
      <div className="flex h-[600px] bg-boxbackground shadow rounded-md ">
        <JobsList
          jobs={mockJobs}
          onSelectJob={setSelectedJob}
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

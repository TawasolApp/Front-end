import React, { useState } from "react";
import AddJobModal from "./AddJobModal";
import JobsList from "./JobsList";
import JobApplications from "./JobApplications";

function OwnerView({
  logo,
  name,
  companyId,
  onJobAdded,
  jobs,
  selectedJob,
  onSelectJob,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Post Job Button OUTSIDE the box */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post a Job Opening
        </button>
      </div>

      {isModalOpen && (
        <AddJobModal
          onClose={handleCloseModal}
          companyId={companyId}
          onJobAdded={onJobAdded}
        />
      )}

      {/* Jobs + Applicants BOX */}
      <div className="bg-boxbackground p-4 shadow-md rounded-md w-full pb-0 mb-6">
        <div className="flex h-[600px] bg-boxbackground shadow rounded-md mb-6">
          <JobsList
            jobs={jobs}
            onSelectJob={onSelectJob}
            selectedJob={selectedJob}
            logo={logo}
            name={name}
          />
          <JobApplications job={selectedJob} companyId={companyId} />
        </div>
      </div>
    </div>
  );
}

export default OwnerView;

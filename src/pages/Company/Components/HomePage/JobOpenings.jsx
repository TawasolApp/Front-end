import React, { useState } from "react";
// import { FiPlusCircle } from "react-icons/fi";
// import AddJobOpeningModal from "./AddJobOpeningModal";
import { useNavigate, useParams } from "react-router-dom";
import jobs from "../../jobs";

function JobOpenings({ company }) {
  const isAdmin = true; // Change to 'true' to see "Add Job Opening" button
  const navigate = useNavigate();
  const { companyId } = useParams(); // Dynamically get companyId from URL
  const [showJobModal, setShowJobModal] = useState(false);

  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-4 mt-8"
      data-testid="job-openings"
    >
      {/* Header */}
      <h1 className="text-xl font-semibold mb-4 text-boxheading">
        Recent Job Openings
      </h1>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <div key={job.id} className="flex items-center space-x-3">
              <img src={job.logo} alt="Company Logo" className="w-10 h-10" />
              <div>
                <h2 className=" text-text">{job.title}</h2>
                <p className="text-text2 text-xs">{job.location}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          <p>No job openings available.</p>
        </div>
      )}

      {/* Add Job Button (Only for Admins) */}
      {/* {isAdmin && (
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center space-x-2 text-blue-600 font-semibold hover:underline"
            data-testid="add-job-modal"
            onClick={() => setShowJobModal(true)}
          >
            <FiPlusCircle className="w-5 h-5" />
            <span>Add Job Opening</span>
          </button>
        </div>
      )} */}

      {/* Show All Jobs Button - Full Width & Darker Hover Effect */}
      {jobs.length > 0 && (
        <button
          className="w-full py-2 text-navbuttons border-t border-gray-300 mt-4 transition duration-300 rounded-b-md"
          onClick={() => navigate(`/company/${companyId}/jobs`)} // Use dynamic companyId
        >
          Show all {jobs.length} jobs →
        </button>
      )}
      {/* <AddJobOpeningModal
        show={showJobModal}
        onClose={() => setShowJobModal(false)}
      /> */}
    </div>
  );
}

export default JobOpenings;

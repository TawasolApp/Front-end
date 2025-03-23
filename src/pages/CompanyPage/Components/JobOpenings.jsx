import React from "react";
import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi"; // Import plus icon
import company from "../testdata"; // Ensure company data is imported
import AddJobOpeningModal from "./AddJobOpeningModal";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams

const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    location: "Cairo, Egypt",
    logo: company.logo,
  },
  {
    id: 2,
    title: "Frontend Developer",
    location: "Cairo, Egypt",
    logo: company.logo,
  },
  {
    id: 3,
    title: "Backend Developer",
    location: "Alexandria, Egypt",
    logo: company.logo,
  },
  {
    id: 4,
    title: "Product Manager",
    location: "Giza, Egypt",
    logo: company.logo,
  },
]; // Assume more jobs exist

function JobOpenings(props) {
  const company = props.company;
  const isAdmin = true; // Change to 'true' to see "Add Job Opening" button
  const navigate = useNavigate();
  const { companyId } = useParams(); // Dynamically get companyId from URL
  const [showJobModal, setShowJobModal] = useState(false);
  return (
    <div className="bg-white p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-0 mb-4 mt-8">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-4">Recent Job Openings</h1>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <div key={job.id} className="flex items-center space-x-3">
              <img src={job.logo} alt="Company Logo" className="w-10 h-10" />
              <div>
                <h2 className="font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.location}</p>
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
      {isAdmin && (
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center space-x-2 text-blue-600 font-semibold hover:underline"
            onClick={() => setShowJobModal(true)}
          >
            <FiPlusCircle className="w-5 h-5" />
            <span>Add Job Opening</span>
          </button>
        </div>
      )}

      {/* Show All Jobs Button - Full Width & Darker Hover Effect */}
      {jobs.length > 0 && (
        <button
          className="w-full py-2 text-gray-700 border-t border-gray-300 mt-4 
                     hover:bg-gray-200 transition duration-300 rounded-b-md"
          onClick={() => navigate(`/company/${companyId}/jobs`)} // Use dynamic companyId
        >
          Show all {jobs.length} jobs →
        </button>
      )}
      <AddJobOpeningModal
        show={showJobModal}
        onClose={() => setShowJobModal(false)}
      />
    </div>
  );
}

export default JobOpenings;

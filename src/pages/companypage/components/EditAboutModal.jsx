import React from "react";

function EditAboutModal({ show, companyData }) {
  if (!show) return null; // Hide modal if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60">
      <div className="bg-white p-5 rounded-lg shadow-xl w-120 relative">
        {/* Modal Header */}
        <h2 className="text-2xl font-semibold mb-4">Edit Company Profile</h2>

        {/* Company Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden">
            <img
              src={companyData.logo || "https://via.placeholder.com/100"}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-blue-600 mt-2 cursor-pointer hover:underline">
            Change company logo
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={companyData.description}
            readOnly
          />
        </div>

        {/* Industry */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Industry</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={companyData.Industry}
            readOnly
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={companyData.location}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default EditAboutModal;

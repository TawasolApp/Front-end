import React from "react";
import { useEffect } from "react";
function AddJobOpeningModal({ show, onClose }) {
  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);
  if (!show) return null; // Hide modal if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/60 z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[400px] md:w-[500px] lg:w-[600px] relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-black text-xl font-bold hover:text-gray-900 transition"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold mb-4">Edit Company Profile</h2>

        {/* Company Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border border-gray-300 overflow-hidden">
            <img
              // src={companyData.logo || "https://via.placeholder.com/100"}
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
          <textarea className="w-full p-2 border rounded-md" readOnly />
        </div>

        {/* Industry */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Industry</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            readOnly
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default AddJobOpeningModal;

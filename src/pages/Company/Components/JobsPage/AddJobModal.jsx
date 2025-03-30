import React, { useEffect } from "react";

function AddJobModal({ onClose, logo, name }) {
  useEffect(() => {
    // Lock background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-modalbackground z-50 flex items-center justify-center px-4">
      <div className="bg-boxbackground p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
        >
          ✖
        </button>

        {/* Modal Header */}
        <h3 className="text-xl font-semibold mb-6 text-text">
          Add Job Opening
        </h3>

        {/* Form */}
        <form className="space-y-4 text-text">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Job title*</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-boxbackground text-text"
                placeholder="Title"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Company*</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-boxbackground text-text"
                placeholder={name}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Workplace type*</label>
              <select
                className="w-full p-2 border rounded bg-boxbackground text-text"
                required
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Job location*</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-boxbackground text-text"
                placeholder="Giza, Al Jizah, Egypt"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Job type*</label>
              <select
                className="w-full p-2 border rounded bg-boxbackground text-text"
                required
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Temporary</option>
                <option>Other</option>
                <option>Volunteer</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description*</label>
            <textarea
              placeholder="Enter job description"
              rows="6"
              className="w-full p-2 border rounded bg-boxbackground text-text"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-text px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;

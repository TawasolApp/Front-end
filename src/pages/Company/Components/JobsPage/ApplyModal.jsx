import { useEffect } from "react";
import React from "react";

function ApplyModal({ onClose, job, company }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-modalbackground flex items-center justify-center px-4">
      <div className="bg-boxbackground rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-white"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 text-text">
          Apply to {company}
        </h2>

        {/* Job Info */}
        <div className="mb-6">
          <p className="font-medium text-text">{job?.title}</p>
          <p className="text-sm text-gray-400">{job?.location}</p>
        </div>

        {/* Form Start */}
        <form className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-4 border-t-2 pt-2">
            <h3 className="text-md font-semibold mb-2 text-text">
              Contact Info
            </h3>
            <div>
              <label className="block text-sm font-medium text-text">
                Email address*
              </label>
              <input
                type="email"
                defaultValue=""
                className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                Phone country code*
              </label>
              <select
                className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                defaultValue="Egypt (+20)"
              >
                <option>Egypt (+20)</option>
                <option>US (+1)</option>
                <option>UK (+44)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                Mobile phone number*
              </label>
              <input
                type="tel"
                defaultValue=""
                className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                required
              />
            </div>
          </div>
          {/* Additional Questions */}
          <div className="border-t-2 pt-2">
            <h3 className="text-md font-semibold mb-2 text-text">
              Additional Questions
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text">
                  How many years of experience do you have in material
                  planning?*
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text">
                  What is your current monthly salary?*
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text">
                  Do you agree to work in 10th Of Ramadan city (Transportation
                  Provided)?*
                </label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent text-text"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-text py-2 rounded hover:bg-blue-700 mt-4"
          >
            Submit Application
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 mt-4">
          Submitting this application won't change your LinkedIn profile.
        </p>
      </div>
    </div>
  );
}

export default ApplyModal;

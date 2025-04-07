import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";

function AddJobModal({ onClose, companyId, onJobAdded }) {
  const [formData, setFormData] = useState({
    position: "",
    industry: "",
    description: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
    locationType: "On-site",
    experienceLevel: "Internship",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedFormData = {
      ...formData,
      salary: formData.salary ? Number(formData.salary) : undefined, // backend expects a number
    };

    // Remove empty optional fields (if backend doesn't allow them)
    Object.keys(cleanedFormData).forEach((key) => {
      if (cleanedFormData[key] === "") {
        delete cleanedFormData[key];
      }
    });

    console.log("Submitting job with data:", cleanedFormData);

    try {
      const response = await axiosInstance.post(
        `/companies/${companyId}/jobs`,
        cleanedFormData
      );

      if (onJobAdded) {
        onJobAdded(response.data);
      }

      // Reset form
      setFormData({
        position: "",
        industry: "",
        description: "",
        location: "",
        salary: "",
        employmentType: "Full-time",
        locationType: "On-site",
        experienceLevel: "Internship",
      });

      onClose();
    } catch (err) {
      console.error("Error posting job:", err);
      console.error("Backend says:", err.response?.data); // helpful!
      alert(err.response?.data?.error || "Failed to post job. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-modalbackground z-50 flex items-center justify-center px-4">
      <div className="bg-boxbackground p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold mb-6 text-text">
          Add Job Opening
        </h3>

        <form className="space-y-4 text-text" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Position*</label>
              <input
                type="text"
                name="position"
                placeholder="FrontEnd Developer"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-boxbackground text-text"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                placeholder="Computer"
                onChange={handleChange}
                className="w-full p-2 border rounded bg-boxbackground text-text"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Location*</label>
              <input
                type="text"
                name="location"
                placeholder="Cairo,Egypt"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-boxbackground text-text"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-boxbackground text-text"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Employment Type*</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-boxbackground text-text"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Apprenticeship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Location Type*</label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-boxbackground text-text"
              >
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-boxbackground text-text"
              >
                <option value="">Select experience level</option>
                <option value="Internship">Internship</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
                <option value="Manager">Manager</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full p-2 border rounded bg-boxbackground text-text"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
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

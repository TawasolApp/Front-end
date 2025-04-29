import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../../apis/axios";
import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";

function AddJobModal({ onClose, companyId, onJobAdded }) {
  const [formData, setFormData] = useState({
    position: "",
    description: "",
    location: "",
    salary: "",
    applicationLink: "",
    experienceLevel: "Internship",
    locationType: "On-site",
    employmentType: "Full-time",
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
      salary: formData.salary ? Number(formData.salary) : undefined,
    };

    // Remove empty optional fields (if backend doesn't allow them)
    Object.keys(cleanedFormData).forEach((key) => {
      if (cleanedFormData[key] === "") {
        delete cleanedFormData[key];
      }
    });

    try {
      const response = await axiosInstance.post(
        `/companies/${companyId}/jobs`,
        cleanedFormData,
      );

      if (onJobAdded) {
        onJobAdded(response.data);
      }

      // Reset form
      setFormData({
        position: "",
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
      console.error("Backend says:", err.response?.data);
      alert(err.response?.data?.error || "Failed to post job. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-modalBackground/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-cardBackground p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative border border-cardBorder">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textPlaceholder hover:text-textContent transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold mb-6 text-header flex items-center gap-2">
          <WorkOutlineIcon className="text-primary" />
          Add Job Opening
        </h3>

        <form className="space-y-4 text-textContent" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position Field */}
            <div>
              <label className="block text-sm mb-1">
                Position<span className="text-red-500 animate-pulse">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="position"
                  placeholder="Senior Software Engineer"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-cardBorder rounded-lg bg-transparent focus:ring-1 focus:ring-primary"
                />
                <WorkOutlineIcon className="absolute left-2 top-2.5 text-textPlaceholder w-4 h-4" />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm mb-1">
                Location<span className="text-red-500 animate-pulse">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country (e.g., Cairo, Egypt)"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-cardBorder rounded-lg bg-transparent"
                />
                <LocationOnIcon className="absolute left-2 top-2.5 text-textPlaceholder w-4 h-4" />
              </div>
            </div>

            {/* Salary Field */}
            <div>
              <label className="block text-sm mb-1">Salary</label>
              <div className="relative">
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Annual salary in USD"
                  className="w-full pl-8 pr-3 py-2 border border-cardBorder rounded-lg bg-transparent"
                />
                <AttachMoneyIcon className="absolute left-2 top-2.5 text-textPlaceholder w-4 h-4" />
              </div>
            </div>

            {/* Existing select fields remain similar but with updated styling */}
            <div>
              <label className="block text-sm mb-1">
                Employment Type<span className="text-red-500 animate-pulse">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full py-2 border border-cardBorder rounded-lg bg-transparent"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Apprenticeship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Location Type<span className="text-red-500 animate-pulse">*</span>
              </label>
              <select
                data-testid="location-type-select"
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                required
                className="w-full py-2 border border-cardBorder rounded-lg bg-transparent"
              >
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Experience Level
              </label>
              <select
                data-testid="experience-level-select"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="w-full py-2 border border-cardBorder rounded-lg bg-transparent"
              >
                <option value="">Select experience level</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="text-sm mb-1 flex items-center gap-1">
              <DescriptionIcon className="text-textPlaceholder w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full p-3 border border-cardBorder rounded-lg bg-transparent focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-buttonSubmitEnable text-buttonSubmitText px-6 py-2 rounded-lg hover:bg-buttonSubmitEnableHover transition-colors font-medium"
            >
              Post Job Opening
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;

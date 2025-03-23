import React, { useState, useEffect } from "react";
import EducationFields from "../EducationModal";
import ExperienceFields from "../ExperienceModal";
import SkillsFields from "../SkillsModal";
import CertificationsFields from "../CertificationsModal";
// Utility functions
const getAllMonthsDynamically = () => {
  return [...Array(12)].map((_, i) =>
    new Date(2000, i).toLocaleString("default", { month: "long" })
  );
};

const getStartYears = () =>
  Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const getEndYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: 2035 - currentYear + 1 },
    (_, i) => currentYear + i
  );
};

const months = getAllMonthsDynamically();
const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth();
const startYears = getStartYears();
const endYears = getEndYears();

function GenericModal({ isOpen, onClose, onSave, type, initialData = {} }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startYear) {
      newErrors.startYear = "Please select a valid start year";
    }

    if (!formData.startMonth) {
      newErrors.startMonth = "Please select a valid start month";
    }

    if (formData.startYear > currentYear) {
      newErrors.startYear = "Start date can't be in the future";
    }

    if (
      formData.startYear == currentYear &&
      months.indexOf(formData.startMonth) > currentMonthIndex
    ) {
      newErrors.startMonth = "Start month can't be in the future";
    }

    if (
      formData.endYear &&
      formData.startYear &&
      parseInt(formData.endYear) < parseInt(formData.startYear)
    ) {
      newErrors.endYear = "End year can't be before the start year";
    }

    if (
      formData.endYear &&
      formData.startYear &&
      formData.endYear === formData.startYear &&
      months.indexOf(formData.endMonth) < months.indexOf(formData.startMonth)
    ) {
      newErrors.endMonth = "End month can't be before the start month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formData });
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white w-[90%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Modular Section */}
        {type === "education" && (
          <EducationFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        )}
        {type === "experience" && (
          <ExperienceFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        )}
        {type === "skills" && (
          <SkillsFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        )}
        {type === "certifications" && (
          <CertificationsFields
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        )}

        {/* Start Date Selection */}
        <label className="block font-medium mb-1">Start date</label>
        <div className="flex gap-2 mb-3">
          <select
            name="startMonth"
            value={formData.startMonth}
            onChange={handleChange}
            className="border p-2 w-1/2 rounded-md"
          >
            <option value="">Month</option>
            {months.map((month, index) =>
              formData.startYear == currentYear &&
              index > currentMonthIndex ? null : (
                <option key={month} value={month}>
                  {month}
                </option>
              )
            )}
          </select>

          <select
            name="startYear"
            value={formData.startYear}
            onChange={handleChange}
            className="border p-2 w-1/2 rounded-md"
          >
            <option value="">Year</option>
            {startYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {errors.startMonth && (
          <p className="text-red-600 text-sm mb-3">{errors.startMonth}</p>
        )}
        {errors.startYear && (
          <p className="text-red-600 text-sm mb-3">{errors.startYear}</p>
        )}
        {/* End Date Selection */}
        <label className="block font-medium mb-1">End date (or expected)</label>
        <div className="flex gap-2 mb-3">
          <select
            name="endMonth"
            value={formData.endMonth}
            onChange={handleChange}
            className="border p-2 w-1/2 rounded-md"
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            name="endYear"
            value={formData.endYear}
            onChange={handleChange}
            className="border p-2 w-1/2 rounded-md"
          >
            <option value="">Year</option>
            {endYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {errors.endMonth && (
          <p className="text-red-600 text-sm mb-3">{errors.endMonth}</p>
        )}
        {errors.endYear && (
          <p className="text-red-600 text-sm mb-3">{errors.endYear}</p>
        )}
        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
export default GenericModal;

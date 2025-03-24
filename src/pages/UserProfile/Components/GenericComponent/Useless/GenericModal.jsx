import React, { useState, useEffect } from "react";
import EducationFields from "../EducationFields";
import ExperienceFields from "../ExperienceFields";
import SkillsFields from "../SkillsFields";
import CertificationsFields from "../CertificationsFields";

// Local confirmation modals
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px] shadow-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// Shared date utilities
const getAllMonths = () =>
  [...Array(12)].map((_, i) =>
    new Date(2000, i).toLocaleString("default", { month: "long" })
  );

const currentYear = new Date().getFullYear();
const nextTenYear = currentYear + 10;
const getStartYears = () =>
  Array.from({ length: currentYear - 1925 + 1 }, (_, i) => currentYear - i); // descending: currentYear → 1925

const getEndYears = () =>
  Array.from({ length: nextTenYear - 1925 + 1 }, (_, i) => nextTenYear - i); // descending: 2035 → 1925

const months = getAllMonths();
const currentMonthIndex = new Date().getMonth();
const startYears = getStartYears();
const endYears = getEndYears();

function GenericModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  type,
  initialData = {},
  editMode = false,
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const fieldValue = inputType === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const hasUnsavedChanges =
    JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.();
  };

  const validateForm = () => {
    const newErrors = {};
    if (type !== "skills") {
      if (!formData.startYear)
        newErrors.startYear = "Please select a valid start year";
      if (!formData.startMonth)
        newErrors.startMonth = "Please select a valid start month";
      if (formData.startYear > currentYear)
        newErrors.startYear = "Start date can't be in the future";
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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (type === "skills" && formData.skill) {
        formData.skillName = formData.skill;
        delete formData.skill;
      }
      onSave({ ...formData });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white w-[90%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* ✖ Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-xl text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        {/* Modal Fields */}
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

        {/* Date Pickers */}
        {type !== "skills" && (
          <>
            <label className="block font-medium mb-1">Start date</label>
            <div className="flex gap-2 mb-3">
              <select
                name="startMonth"
                value={formData.startMonth || ""}
                onChange={handleChange}
                className="border p-2 w-1/2 rounded-md"
              >
                <option value="">Month</option>
                {months.map((month, index) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                name="startYear"
                value={formData.startYear || ""}
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
              <p className="text-red-600 text-sm mb-2">{errors.startMonth}</p>
            )}
            {errors.startYear && (
              <p className="text-red-600 text-sm mb-2">{errors.startYear}</p>
            )}

            <label className="block font-medium mb-1">
              End date (or expected)
            </label>
            <div className="flex gap-2 mb-3">
              <select
                name="endMonth"
                value={formData.endMonth || ""}
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
                value={formData.endYear || ""}
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
              <p className="text-red-600 text-sm mb-2">{errors.endMonth}</p>
            )}
            {errors.endYear && (
              <p className="text-red-600 text-sm mb-2">{errors.endYear}</p>
            )}
          </>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end items-center mt-6 gap-2">
          {onDelete && editMode && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          )}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showDiscardModal && (
        <ConfirmModal
          title="Discard changes?"
          message="You have unsaved changes. Are you sure you want to close?"
          onConfirm={handleDiscardConfirm}
          onCancel={() => setShowDiscardModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Confirm delete"
          message="Are you sure you want to delete this entry? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default GenericModal;

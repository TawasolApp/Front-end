import React, { useState, useEffect } from "react";
import EducationFields from "../ModalFields/EducationFields";
import ExperienceFields from "../ModalFields/ExperienceFields";
import SkillsFields from "../ModalFields/SkillsFields";
import CertificationsFields from "../ModalFields/CertificationsFields";

// Local confirmation modals
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-boxbackground rounded-lg p-6 w-[90%] sm:w-[400px] shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-text">{title}</h2>
      <p className="text-gray-700 mb-4 text-companyheader2">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onConfirm}
          data-testid="confirm-delete"
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      if (type === "education") {
        if (!formData.institution)
          newErrors.institution = "Please provide an institution";
      }
      if (type === "experience") {
        if (!formData.company)
          newErrors.company = "Please provide a company name";
        if (!formData.title) newErrors.title = "Please provide a title";
      }
      if (type === "certifications") {
        if (!formData.name)
          newErrors.name = "Please provide a certificate name";
        if (!formData.issuingOrganization)
          newErrors.issuingOrganization =
            "Please provide an issuing organization";
      }
    }
    if (type === "skills") {
      if (!formData.skill) newErrors.skill = "Please provide a skill";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // if (type === "skills" && formData.skill) {
      //   formData.skillName = formData.skill;
      //   delete formData.skill;

      // }
      onSave({ ...formData });
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
        data-testid="generic-modal"
      >
        <div
          className="bg-boxbackground w-[95%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative 
             sm:max-h-[90vh] max-h-screen sm:rounded-lg rounded-none"
        >
          {/* ✖ Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-l text-gray-600 hover:text-gray-900"
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
              {/* Start Date */}
              <div className="flex gap-4 mb-3">
                {/* Start Month */}
                <div className="w-1/2">
                  <label
                    htmlFor="startMonth"
                    className="block font-medium mb-1  text-text"
                  >
                    Start Month
                  </label>
                  <select
                    id="startMonth"
                    name="startMonth"
                    value={formData.startMonth || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-md  bg-boxbackground text-text"
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.startMonth && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.startMonth}
                    </p>
                  )}
                </div>

                {/* Start Year */}
                <div className="w-1/2">
                  <label
                    htmlFor="startYear"
                    className="block font-medium text-text "
                  >
                    Start Year
                  </label>
                  <select
                    id="startYear"
                    name="startYear"
                    value={formData.startYear || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-md  bg-boxbackground text-text"
                  >
                    <option value="">Year</option>
                    {startYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.startYear && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.startYear}
                    </p>
                  )}
                </div>
              </div>

              {/* End Date */}
              <div className="flex gap-4 mb-3">
                {/* End Month */}
                <div className="w-1/2">
                  <label
                    htmlFor="endMonth"
                    className="block font-medium mb-1 text-text "
                  >
                    End Month
                  </label>
                  <select
                    id="endMonth"
                    name="endMonth"
                    value={formData.endMonth || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-md  bg-boxbackground text-text"
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.endMonth && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.endMonth}
                    </p>
                  )}
                </div>

                {/* End Year */}
                <div className="w-1/2">
                  <label
                    htmlFor="endYear"
                    className="block font-medium mb-1  text-text"
                  >
                    End Year
                  </label>
                  <select
                    id="endYear"
                    name="endYear"
                    value={formData.endYear || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-md  bg-boxbackground text-text"
                  >
                    <option value="">Year</option>
                    {endYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.endYear && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.endYear}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end items-center mt-6 gap-2">
            {onDelete && editMode && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                aria-label="Delete entry"
                onClick={() => setShowDeleteModal(true)}
                data-testid="delete-button"
              >
                Delete
              </button>
            )}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              aria-label="Save changes"
              onClick={handleSubmit}
              data-testid="save-button"
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
    )
  );
}
export default GenericModal;

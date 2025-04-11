import React, { useState, useEffect } from "react";
import EducationFields from "../ModalFields/EducationFields";
import ExperienceFields from "../ModalFields/ExperienceFields";
import SkillsFields from "../ModalFields/SkillsFields";
import CertificationsFields from "../ModalFields/CertificationsFields";
import ConfirmModal from "../ReusableModals/ConfirmModal";
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
  existingItems = [], // 👈 Accept the prop here
  isSaving, // ✅ Add this
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

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

  // useEffect(() => {
  //   if (isOpen && initialData) {
  //     const parseDate = (dateStr) => {
  //       if (!dateStr) return { month: "", year: "" };
  //       const date = new Date(dateStr);
  //       const month = date.toLocaleString("default", { month: "long" });
  //       const year = String(date.getFullYear());
  //       return { month, year };
  //     };

  //     const { month: startMonth, year: startYear } = parseDate(
  //       initialData.startDate
  //     );
  //     const { month: endMonth, year: endYear } = parseDate(initialData.endDate);

  //     const updatedForm = {
  //       ...initialData,
  //       startMonth,
  //       startYear,
  //       endMonth,
  //       endYear,
  //     };

  //     setFormData(updatedForm);
  //     setInitialFormData(updatedForm); // ✅ Set initialFormData after parsing
  //   }
  // }, [isOpen, initialData]);
  useEffect(() => {
    if (isOpen && initialData) {
      const parseDate = (dateStr) => {
        if (!dateStr) return { month: "", year: "" };
        const parsed = new Date(dateStr);
        if (isNaN(parsed)) return { month: "", year: "" };
        const month = parsed.toLocaleString("default", { month: "long" });
        const year = String(parsed.getFullYear());
        return { month, year };
      };

      const { month: startMonth, year: startYear } = parseDate(
        initialData.startDate || initialData.issueDate
      );
      const { month: endMonth, year: endYear } = parseDate(
        initialData.endDate || initialData.expiryDate
      );

      const updatedForm = {
        ...initialData,
        startMonth,
        startYear,
        endMonth,
        endYear,
      };

      setFormData(updatedForm);
      setInitialFormData(updatedForm);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const fieldValue = inputType === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const hasUnsavedChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

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
        if (!formData.school) newErrors.school = "Please provide a school";
      }
      if (type === "workExperience") {
        if (!formData.company)
          newErrors.company = "Please provide a company name";
        if (!formData.title) newErrors.title = "Please provide a title";
        if (!formData.employmentType) {
          newErrors.employmentType = "Employment type is required";
        }
      }
      if (type === "certification") {
        if (!formData.name)
          newErrors.name = "Please provide a certificate name";
        if (!formData.company)
          newErrors.company = "Please provide an issuing organization";
      }
    }
    if (type === "skills") {
      if (!formData.skillName) newErrors.skillName = "Please provide a skill";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const monthIndex = (month) => months.indexOf(month);
      const formatDate = (month, year, type) => {
        if (!month || !year) return "";
        const monthNum = String(monthIndex(month) + 1).padStart(2, "0");
        return `${year}-${monthNum}-${type === "start" ? "01" : "30"}`;
      };

      const { startMonth, startYear, endMonth, endYear, ...cleanedFormData } =
        formData;

      const updatedFormData = {
        ...cleanedFormData,
        // workExperiencePicture: formData.workExperiencePicture, //  ensure it's included
        // certificationPicture: formData.certificationPicture,
        companyLogo: formData.companyLogo, // ✅ used for all three types

        ...(type === "certification"
          ? {
              issueDate: formatDate(startMonth, startYear, "start"),
              expiryDate:
                endMonth && endYear ? formatDate(endMonth, endYear, "end") : "",
            }
          : type !== "skills"
            ? {
                startDate: formatDate(startMonth, startYear, "start"),
                endDate:
                  endMonth && endYear
                    ? formatDate(endMonth, endYear, "end")
                    : "",
              }
            : {}),
      };

      onSave(updatedFormData);
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-modalbackground flex justify-center items-center z-50"
        data-testid="generic-modal"
      >
        <div
          className="bg-boxbackground w-[95%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative 
             sm:max-h-[90vh] max-h-screen sm:rounded-lg rounded-none"
        >
          {/* ✖ Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-3xl text-normaltext hover:text-companyheader"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Modal Fields */}
          {type === "education" && (
            <EducationFields
              formData={formData}
              setFormData={setFormData} //  add this!
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {type === "workExperience" && (
            <ExperienceFields
              formData={formData}
              setFormData={setFormData} //  add this!
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {type === "skills" && (
            <SkillsFields
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              editMode={editMode} // wont show skillname if edit
              existingSkills={existingItems.map((item) =>
                item.skillName.toLowerCase()
              )}
            />
          )}
          {type === "certification" && (
            <CertificationsFields
              formData={formData}
              setFormData={setFormData}
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
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition duration-200"
                aria-label="Delete entry"
                onClick={() => setShowDeleteModal(true)}
                data-testid="delete-button"
              >
                Delete
              </button>
            )}
            <button
              className={`px-4 py-2 rounded-full transition duration-200 text-boxheading 
            ${
              isSaving || !hasUnsavedChanges
                ? "bg-blue-400 cursor-not-allowed opacity-60"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
              aria-label="Save changes"
              onClick={handleSubmit}
              disabled={isSaving || !hasUnsavedChanges}
              data-testid="save-button"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Confirmation Modals */}
        {showDiscardModal && (
          <ConfirmModal
            title="Discard changes?"
            message="You have unsaved changes. Are you sure you want to close?"
            onCancel={() => setShowDiscardModal(false)}
            onConfirm={handleDiscardConfirm}
            confirmLabel="Discard"
            cancelLabel="Cancel"
          />
        )}

        {showDeleteModal && (
          <ConfirmModal
            title="Confirm delete"
            message="Are you sure you want to delete this entry? This action cannot be undone."
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            confirmLabel="Delete"
            cancelLabel="Cancel"
          />
        )}
      </div>
    )
  );
}
export default GenericModal;

//  Helper function to display formatted date like 'Feb 2024'
export function displayDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

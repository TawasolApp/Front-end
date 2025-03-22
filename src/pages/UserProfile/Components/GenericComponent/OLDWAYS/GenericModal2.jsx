import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
// Get all months dynamically
const getAllMonthsDynamically = () => {
  return [...Array(12)].map((_, i) =>
    new Date(2000, i).toLocaleString("default", { month: "long" })
  );
};

// Generate years dynamically (Last 50 years)
const getStartYears = () =>
  Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

// Generate end years dynamically (From start year to 2035, correctly ordered)
const getEndYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: 2035 - currentYear + 1 },
    (_, i) => currentYear + i
  );
};

const months = getAllMonthsDynamically();
const currentYear = new Date().getFullYear();
const currentMonthIndex = new Date().getMonth(); // 0-based (Jan = 0, Feb = 1)
const startYears = getStartYears();
const endYears = getEndYears();

function GenericModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  type,
  editMode,
  initialData = {},
}) {
  // useEffect(() => {
  //   // Lock scrolling when the modal is open
  //   if (isOpen) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }
  //   // Clean up when the modal is closed
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isOpen]); // Run the effect when isOpen changes

  if (!isOpen) return null; // If modal isn't open, render nothing

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track delete modal state
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (formData.id) {
      onDelete(formData.id); // Pass the correct ID
    }
    setShowDeleteModal(false);
    onClose();
  };
  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ ...formData });
      onClose();
    }
  };
  const validateForm = () => {
    let newErrors = {};

    // School Name is required
    if (type === "education" && !formData.institution?.trim()) {
      newErrors.institution = "School is a required field";
    }

    // Year validation - Ensure a valid year is selected
    if (!formData.startYear || formData.startYear === "Year") {
      newErrors.startYear = "Please select a valid year";
    }

    // Month validation - Ensure a valid month is selected
    if (!formData.startMonth || formData.startMonth === "Month") {
      newErrors.startMonth = "Please select a valid month";
    }

    // Future date validation
    if (formData.startYear && parseInt(formData.startYear) > currentYear) {
      newErrors.startYear = "Start date can't be in the future";
    }

    // Prevent selecting future months in the current year
    if (
      formData.startYear == currentYear &&
      months.indexOf(formData.startMonth) > currentMonthIndex
    ) {
      newErrors.startMonth = "Start month can't be in the future";
    }

    // End year validation - Can't be before start year
    if (
      formData.endYear &&
      formData.startYear &&
      parseInt(formData.endYear) < parseInt(formData.startYear)
    ) {
      newErrors.endYear = "End year can't be before the start year";
    }

    // End month validation - Can't be before start month if in the same year
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

  return (
    <div className="absolute fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white  w-[90%] sm:w-[500px] p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        <button
          onClick={() => setShowDiscardModal(true)}
          className="relative top-1 right-1 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4">{type} Details</h2>
        {/* Close Button (X) */}
        {/* Dynamic Fields */}
        {type === "skills" ? (
          <>
            <p className="text-sm text-gray-600 mb-1">* Indicates required</p>
            <label className="block font-medium mb-1">Skill*</label>
            <input
              type="text"
              name="skill"
              placeholder="Skill (ex: Project Management)"
              value={formData.skill || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded-md mb-4"
              required
            />
          </>
        ) : (
          <>
            {type === "education" && (
              <>
                <label className="block font-medium mb-1">School*</label>

                <input
                  type="text"
                  name="institution"
                  placeholder={
                    type === "education"
                      ? "Ex: Boston University"
                      : "Company / Institution"
                  }
                  value={formData.institution || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                  required
                />
                {errors.institution && (
                  <p className="text-red-600 text-sm mb-3">
                    {errors.institution}
                  </p>
                )}
                <label className="block font-medium mb-1">Degree</label>

                <input
                  type="text"
                  name="degree"
                  placeholder="Ex: Bachelor's"
                  value={formData.degree || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />
                <label className="block font-medium mb-1">Field of study</label>

                <input
                  type="text"
                  name="fieldOfStudy"
                  placeholder="Ex: Business"
                  value={formData.fieldOfStudy || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />
                {/* Grade Field */}

                <label className="block font-medium mb-1">Grade</label>
                <input
                  type="text"
                  name="grade"
                  placeholder="Ex: 3.8 GPA"
                  value={formData.grade || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />
                {/* Activities and Societies */}
                <label className="block font-medium mb-1">
                  Activities and Societies
                </label>
                <textarea
                  name="activities"
                  placeholder="Ex: Alpha Phi Omega, Marching Band, Volleyball"
                  value={formData.activities || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md resize-none"
                  maxLength={500}
                />
                <p className="text-right text-gray-500 text-sm">
                  {formData.activities?.length || 0}/500
                </p>
                {/* Description Field */}
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Add details about your education..."
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md resize-none"
                  maxLength={1000}
                />
                <p className="text-right text-gray-500 text-sm">
                  {formData.description?.length || 0}/1,000
                </p>
              </>
            )}
            {/* ✅ Certifications: New Fields */}
            {type === "certifications" && (
              <>
                <label className="block font-medium mb-1">
                  Certification Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  name="issuingOrganization"
                  value={formData.issuingOrganization || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Credential ID</label>
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Credential URL</label>
                <input
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />
              </>
            )}
            {/* ✅ Experience: New Fields */}
            {type === "experience" && (
              <>
                <label className="block font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">
                  Employment Type
                </label>
                <input
                  type="text"
                  name="employmentType"
                  value={formData.employmentType || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Location Type</label>
                <input
                  type="text"
                  name="locationType"
                  value={formData.locationType || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />

                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="border p-2 w-full mb-3 rounded-md"
                />
              </>
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
            <label className="block font-medium mb-1">
              End date (or expected)
            </label>

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
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {formData.id && editMode && (
            <button
              className="px-4 py-2 text-black rounded"
              onClick={() => setShowDeleteModal(true)} // ✅ Open delete modal
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

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleDeleteConfirm}
              itemName={formData.institution || formData.title || "item"}
              isDiscard={false} // Indicate that it's discard action
            />
          )}
          {showDiscardModal && (
            <DeleteConfirmationModal
              isOpen={showDiscardModal}
              onClose={() => setShowDiscardModal(false)}
              onConfirm={onClose} // Closes modal when confirmed
              itemName="Discard changes?"
              isDiscard={true} // Indicate that it's discard action
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GenericModal;

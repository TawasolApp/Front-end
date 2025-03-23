import React from "react";

function EducationFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Education Details</h2>

      <label className="block font-medium mb-1">School *</label>
      <input
        type="text"
        name="institution"
        value={formData.institution || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md"
        placeholder="Ex: Harvard University"
      />
      {errors.institution && (
        <p className="text-red-600 text-sm mb-3">{errors.institution}</p>
      )}

      <label className="block font-medium mb-1">Degree</label>
      <input
        type="text"
        name="degree"
        value={formData.degree || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md"
        placeholder="Ex: Bachelor's"
      />

      <label className="block font-medium mb-1">Field of Study</label>
      <input
        type="text"
        name="fieldOfStudy"
        value={formData.fieldOfStudy || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md"
        placeholder="Ex: Computer Science"
      />

      <label className="block font-medium mb-1">Grade</label>
      <input
        type="text"
        name="grade"
        value={formData.grade || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md"
        placeholder="Ex: 3.9 GPA"
      />

      <label className="block font-medium mb-1">Activities and Societies</label>
      <textarea
        name="activities"
        value={formData.activities || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md resize-none"
        placeholder="Ex: Debate Club, Chess Team"
        maxLength={500}
      />
      <p className="text-right text-gray-500 text-sm">
        {formData.activities?.length || 0}/500
      </p>

      <label className="block font-medium mb-1">Description</label>
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md resize-none"
        placeholder="Add more details..."
        maxLength={1000}
      />
      <p className="text-right text-gray-500 text-sm">
        {formData.description?.length || 0}/1000
      </p>
    </>
  );
}

export default EducationFields;

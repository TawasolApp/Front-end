import React from "react";

function EducationFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">
        Education Details
      </h2>

      <label htmlFor="institution" className="block font-medium mb-1 text-text">
        School *
      </label>
      <input
        id="institution"
        type="text"
        name="institution"
        value={formData.institution || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companyheader2"
        placeholder="Ex: Harvard University"
      />
      {errors.institution && (
        <p className="text-red-600 text-sm mb-3">{errors.institution}</p>
      )}

      <label
        htmlFor="degree"
        className="block font-medium mb-1  bg-boxbackground text-text"
      >
        Degree
      </label>
      <input
        id="degree"
        type="text"
        name="degree"
        value={formData.degree || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground text-companyheader2"
        placeholder="Ex: Bachelor's"
      />

      <label
        htmlFor="fieldOfStudy"
        className="block font-medium mb-1 text-text"
      >
        Field of Study
      </label>
      <input
        id="fieldOfStudy"
        type="text"
        name="fieldOfStudy"
        value={formData.fieldOfStudy || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground"
        placeholder="Ex: Computer Science"
      />

      <label htmlFor="grade" className="block font-medium mb-1 text-text">
        Grade
      </label>
      <input
        id="grade"
        type="text"
        name="grade"
        value={formData.grade || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground text-companyheader2"
        placeholder="Ex: 3.9 GPA"
      />

      <label htmlFor="activities" className="block font-medium mb-1 text-text">
        Activities and Societies
      </label>
      <textarea
        id="activities"
        name="activities"
        value={formData.activities || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md resize-none  bg-boxbackground"
        placeholder="Ex: Debate Club, Chess Team"
        maxLength={500}
      />
      <p className="text-right text-gray-500 text-sm">
        {formData.activities?.length || 0}/500
      </p>

      <label htmlFor="description" className="block font-medium mb-1 text-text">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md resize-none bg-boxbackground"
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

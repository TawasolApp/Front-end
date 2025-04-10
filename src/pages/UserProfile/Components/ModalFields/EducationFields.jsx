import React from "react";

function EducationFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">
        Education Details
      </h2>

      <label htmlFor="school" className="block font-medium mb-1 text-text">
        School *
      </label>
      <input
        id="school"
        type="text"
        name="school"
        // autoComplete="off"
        // removed when add list of schools since i willl add there
        value={formData.school || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companysubheader"
        placeholder="Ex: Harvard University"
      />
      {errors.school && (
        <p className="text-red-600 text-sm mb-3">{errors.school}</p>
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
        autoComplete="off"
        value={formData.degree || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground text-companysubheader"
        placeholder="Ex: Bachelor's"
      />

      <label htmlFor="field" className="block font-medium mb-1 text-text">
        Field of Study
      </label>
      <input
        id="field"
        type="text"
        name="field"
        autoComplete="off"
        value={formData.field || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground text-companysubheader"
        placeholder="Ex: Computer Science"
      />

      <label htmlFor="grade" className="block font-medium mb-1 text-text">
        Grade
      </label>
      <input
        id="grade"
        type="text"
        name="grade"
        autoComplete="off"
        value={formData.grade || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md  bg-boxbackground text-companysubheader"
        placeholder="Ex: 3.9 GPA"
      />

      <label htmlFor="description" className="block font-medium mb-1 text-text">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md resize-none bg-boxbackground text-companysubheader"
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

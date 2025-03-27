import React from "react";

function ExperienceFields({ formData, handleChange, errors }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">Add experience</h2>

      <label htmlFor="title" className="block font-medium mb-1 text-text">
        Title*
      </label>
      <input
        id="title"
        type="text"
        name="title"
        placeholder="Ex: Retail Sales Manager"
        value={formData.title || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        required
      />
      {errors.title && (
        <p className="text-red-600 text-sm mb-2">{errors.title}</p>
      )}

      <label
        htmlFor="employmentType"
        className="block font-medium mb-1 text-text"
      >
        Employment type
      </label>
      <select
        id="employmentType"
        name="employmentType"
        value={formData.employmentType || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
      >
        <option value="">Please select</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Freelance">Freelance</option>
        <option value="Temporary">Temporary</option>
      </select>

      <label htmlFor="company" className="block font-medium mb-1 text-text">
        Company or organization*
      </label>
      <input
        id="company"
        type="text"
        name="company"
        placeholder="Ex: Microsoft"
        value={formData.company || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        required
      />
      {errors.company && (
        <p className="text-red-600 text-sm mb-2">{errors.company}</p>
      )}

      <div className="flex items-center mb-3 gap-2">
        <input
          id="currentlyWorking"
          type="checkbox"
          name="currentlyWorking"
          checked={formData.currentlyWorking || false}
          onChange={handleChange}
        />
        <label htmlFor="currentlyWorking" className="text-text">
          I am currently working in this role
        </label>
      </div>

      <label htmlFor="location" className="block font-medium mb-1 text-text">
        Location
      </label>
      <input
        id="location"
        type="text"
        name="location"
        placeholder="Ex: London, United Kingdom"
        value={formData.location || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
      />

      <label
        htmlFor="locationType"
        className="block font-medium mb-1 text-text"
      >
        Location type
      </label>
      <select
        id="locationType"
        name="locationType"
        value={formData.locationType || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
      >
        <option value="">Please select</option>
        <option value="On-site">On-site</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Remote">Remote</option>
      </select>
      <p className="text-sm text-gray-500 mb-2">
        Pick a location type (ex: remote)
      </p>

      <label htmlFor="description" className="block font-medium mb-1 text-text">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="List your major duties and successes, highlighting specific projects"
        value={formData.description || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md resize-none bg-boxbackground text-companyheader2"
        maxLength={1000}
      />
      <p className="text-right text-gray-500 text-sm mb-2">
        {formData.description?.length || 0}/1000
      </p>
    </>
  );
}

export default ExperienceFields;

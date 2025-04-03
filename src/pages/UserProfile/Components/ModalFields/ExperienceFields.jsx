import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";

function ExperienceFields({ formData, setFormData, handleChange, errors }) {
  const [companies, setCompanies] = useState([]);
  const [inputValue, setInputValue] = useState(formData.company || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    axios
      .get("/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.name,
    logo: company.logo || "https://via.placeholder.com/20",
  }));

  const filteredOptions = inputValue
    ? companyOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">Add experience</h2>

      {/* Title */}
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

      {/* Employment Type */}
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

      {/* Company or Organization */}
      <label htmlFor="company" className="block font-medium mb-1 text-text">
        Company or organization*
      </label>
      <div className="relative">
        <input
          type="text"
          id="company"
          name="company"
          placeholder="Ex: Microsoft"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            setFormData((prev) => ({ ...prev, company: value }));
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          //  add those to act like a drop down menu for now
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
              );
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (highlightedIndex >= 0) {
                const selected = filteredOptions[highlightedIndex];
                setInputValue(selected.label);
                setFormData((prev) => ({ ...prev, company: selected.label }));
                setShowDropdown(false);
              }
            } else if (e.key === "Escape") {
              setShowDropdown(false);
            }
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
          autoComplete="off"
        />

        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => {
                  setInputValue(option.label);
                  setFormData((prev) => ({ ...prev, company: option.label }));
                  setShowDropdown(false);
                }}
                className={`flex items-center p-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={option.logo}
                  alt={option.label}
                  className="w-5 h-5 rounded-full mr-2"
                />
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Currently Working Checkbox */}
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

      {/* Location */}
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

      {/* Location Type */}
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

      {/* Description */}
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

import React, { useState, useEffect } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import defaultExperienceImage from "../../../../assets/images/defaultExperienceImage.png";

const employmentOptions = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "self_employed", label: "Self-employed" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

const locationOptions = [
  { value: "on_site", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

function ExperienceFields({ formData, setFormData, handleChange, errors }) {
  const [companies, setCompanies] = useState([]);
  const [inputValue, setInputValue] = useState(formData.company || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentlyWorking, setCurrentlyWorking] = useState(!formData.endDate);

  useEffect(() => {
    axios
      .get("/companies?page=1&limit=1000&name=a")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  useEffect(() => {
    setInputValue(formData.company || "");
  }, [formData.company]);

  const filteredOptions = inputValue
    ? companies.filter((company) =>
        company.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleCompanySelect = (company) => {
    setInputValue(company.name);
    setFormData((prev) => ({
      ...prev,
      company: company.name,
      workExperiencePicture: company.logo || defaultExperienceImage,
    }));
    setShowDropdown(false);
  };

  const handleCurrentlyWorkingChange = (e) => {
    const checked = e.target.checked;
    setCurrentlyWorking(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        endDate: "", // remove endDate if user is currently working
      }));
    }
  };
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
        {employmentOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors.employmentType && (
        <p className="text-red-600 text-sm mb-2">{errors.employmentType}</p>
      )}
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
            } else if (e.key === "Enter" && highlightedIndex >= 0) {
              e.preventDefault();
              handleCompanySelect(filteredOptions[highlightedIndex]);
            } else if (e.key === "Escape") {
              setShowDropdown(false);
            }
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
          autoComplete="off"
        />
        {errors.company && (
          <p className="text-red-600 text-sm mb-2">{errors.company}</p>
        )}

        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleCompanySelect(option)}
                className={`flex items-center p-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={option.logo || defaultExperienceImage}
                  alt={option.name}
                  className="w-5 h-5 rounded-full mr-2"
                />
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Currently Working */}
      {/* ADD CURRENTLY WORKING ON AFTER CHECKING END DATE  */}
      <div className="flex items-center mb-3 gap-2">
        <input
          id="currentlyWorking"
          type="checkbox"
          name="currentlyWorking"
          checked={currentlyWorking}
          disabled={formData.endMonth || formData.endYear}
          onChange={handleCurrentlyWorkingChange}
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
        {locationOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

export default ExperienceFields;

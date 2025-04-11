import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import defaultEducationImage from "../../../../assets/images/defaultEducationImage.png";

function EducationFields({ formData, setFormData, handleChange, errors }) {
  const [schools, setSchools] = useState([]);
  const [inputValue, setInputValue] = useState(formData.school || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    axios
      .get("/companies?page=1&limit=1000&name=a")
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("Error fetching schools:", err));
  }, []);

  useEffect(() => {
    setInputValue(formData.school || "");
  }, [formData.school]);

  const filteredOptions = inputValue
    ? schools.filter((school) =>
        school.name.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : [];

  const handleSchoolSelect = (school) => {
    setInputValue(school.name);
    setFormData((prev) => ({
      ...prev,
      school: school.name,
      companyId: school.companyId,
      companyLogo: school.logo || defaultEducationImage,
    }));
    setShowDropdown(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">
        Education Details
      </h2>

      {/* School Dropdown Input */}
      <label htmlFor="school" className="block font-medium mb-1 text-text">
        School *
      </label>
      <div className="relative">
        <input
          id="school"
          type="text"
          name="school"
          placeholder="Ex: Harvard University"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            setFormData((prev) => ({
              ...prev,
              school: value,
              companyId: null,
              companyLogo: null,
            }));
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0,
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1,
              );
            } else if (e.key === "Enter" && highlightedIndex >= 0) {
              e.preventDefault();
              handleSchoolSelect(filteredOptions[highlightedIndex]);
            } else if (e.key === "Escape") {
              setShowDropdown(false);
            }
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companysubheader"
          autoComplete="off"
        />
        {errors.school && (
          <p className="text-red-600 text-sm mb-2">{errors.school}</p>
        )}

        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-boxbackground border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleSchoolSelect(option)}
                className={`flex items-center p-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={option.logo || defaultEducationImage}
                  alt={option.name}
                  className="w-5 h-5 rounded-full mr-2"
                />
                <span className="text-normaltext">{option.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Degree */}
      <label htmlFor="degree" className="block font-medium mb-1 text-text">
        Degree
      </label>
      <input
        id="degree"
        type="text"
        name="degree"
        value={formData.degree || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companysubheader"
        placeholder="Ex: Bachelor's"
        autoComplete="off"
      />

      {/* Field of Study */}
      <label htmlFor="field" className="block font-medium mb-1 text-text">
        Field of Study
      </label>
      <input
        id="field"
        type="text"
        name="field"
        value={formData.field || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companysubheader"
        placeholder="Ex: Computer Science"
        autoComplete="off"
      />

      {/* Grade */}
      <label htmlFor="grade" className="block font-medium mb-1 text-text">
        Grade
      </label>
      <input
        id="grade"
        type="text"
        name="grade"
        value={formData.grade || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-md bg-boxbackground text-companysubheader"
        placeholder="Ex: 3.9 GPA"
        autoComplete="off"
      />

      {/* Description */}
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

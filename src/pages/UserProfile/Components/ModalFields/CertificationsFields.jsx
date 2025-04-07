import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "../../../../apis/axios";
import defaultExperienceImage from "../../../../assets/images/defaultExperienceImage.png";

function CertificationsFields({ formData, setFormData, handleChange, errors }) {
  const [companies, setCompanies] = useState([]);
  const [inputValue, setInputValue] = useState(formData.company || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
      certificationPicture: company.logo || defaultExperienceImage,
    }));
    setShowDropdown(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text">
        Add license or certification
      </h2>

      <p className="text-sm text-gray-600 mb-2">* Indicates required</p>

      <label htmlFor="name" className="block font-medium mb-1 text-text">
        Name*
      </label>
      <input
        id="name"
        type="text"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Ex: Microsoft certified network associate security"
      />
      {errors.name && (
        <p className="text-red-600 text-sm mb-2">{errors.name}</p>
      )}

      <label htmlFor="company" className="block font-medium mb-1 text-text">
        Issuing organization*
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
            {filteredOptions.map((company, index) => (
              <li
                key={index}
                onMouseDown={() => handleCompanySelect(company)}
                className={`flex items-center p-2 cursor-pointer ${
                  index === highlightedIndex ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={company.logo || defaultExperienceImage}
                  alt={company.name}
                  className="w-5 h-5 rounded-full mr-2"
                />
                {company.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default CertificationsFields;

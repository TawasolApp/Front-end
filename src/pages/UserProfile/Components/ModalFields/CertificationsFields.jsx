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
      .get("/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  useEffect(() => {
    setInputValue(formData.company || "");
  }, [formData.company]);

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.name,
    logo: company.logo || defaultExperienceImage,
  }));

  const filteredOptions = inputValue
    ? companyOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-text ">
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
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground  text-companyheader2"
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
            const match = companyOptions.find(
              (opt) => opt.label.toLowerCase() === value.toLowerCase()
            );
            setFormData((prev) => ({
              ...prev,
              company: value,
              certificationPicture: match ? match.logo : "",
            }));
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
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (highlightedIndex >= 0) {
                const selected = filteredOptions[highlightedIndex];
                setInputValue(selected.label);
                setFormData((prev) => ({
                  ...prev,
                  company: selected.label,
                  certificationPicture: selected.logo,
                }));
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
        {errors.company && (
          <p className="text-red-600 text-sm mb-2">{errors.company}</p>
        )}

        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => {
                  setInputValue(option.label);
                  setFormData((prev) => ({
                    ...prev,
                    company: option.label,
                    certificationPicture: option.logo,
                  }));
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

      {/* <label
        htmlFor="credentialId"
        className="block font-medium mb-1  text-text"
      >
        Credential ID
      </label>
      <input
        id="credentialId"
        type="text"
        name="credentialId"
        value={formData.credentialId || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Optional"
      /> */}

      {/* <label
        htmlFor="credentialUrl"
        className="block font-medium mb-1  text-text"
      >
        Credential URL
      </label>
      <input
        id="credentialUrl"
        type="url"
        name="credentialUrl"
        value={formData.credentialUrl || ""}
        onChange={handleChange}
        className="border p-2 w-full rounded-md mb-2 bg-boxbackground text-companyheader2"
        placeholder="Optional"
      /> */}
    </>
  );
}

export default CertificationsFields;

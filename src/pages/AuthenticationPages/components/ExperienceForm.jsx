import React, { useState } from "react";
import InputField from "./InputField";
import BlueSubmitButton from "./BlueSubmitButton";

const ExperienceForm = ({ onSubmit }) => {
  // Employee fields
  const [jobTitle, setJobTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [company, setCompany] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  // Student fields
  const [school, setSchool] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [startYearError, setStartYearError] = useState("");
  const [endYearError, setEndYearError] = useState("");
  const [isOver16, setIsOver16] = useState(true);
  const [birthDate, setBirthDate] = useState({ month: "", day: "", year: "" });

  // Common state
  const [isStudent, setIsStudent] = useState(false);

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
    setShowAdditionalFields(true);
  };

  const handleEmploymentTypeChange = (e) => {
    setEmploymentType(e.target.value);
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
  };

  const handleStartYearChange = (e) => {
    setStartYear(e.target.value);
    setStartYearError("");
    if (
      endYearError === "Your end date can't be earlier than your start date."
    ) {
      setEndYearError("");
    }
  };

  const handleEndYearChange = (e) => {
    setEndYear(e.target.value);
    setEndYearError("");
  };

  const handleIsOver16Change = () => {
    setIsOver16(!isOver16);
  };

  const handleBirthDateChange = (e) => {
    const { name, value } = e.target;
    setBirthDate({ ...birthDate, [name]: value });
  };

  const handleIsStudentChange = () => {
    setIsStudent(!isStudent);
  };

  const handleStartYearBlur = () => {
    if (!startYear) {
      setStartYearError("Please enter a start year.");
    } else if (
      startYear &&
      endYear &&
      parseInt(endYear) < parseInt(startYear)
    ) {
      setEndYearError("Your end date can't be earlier than your start date.");
    }
  };

  const handleEndYearBlur = () => {
    if (!endYear) {
      setEndYearError("Please enter an end year.");
    } else if (
      startYear &&
      endYear &&
      parseInt(endYear) < parseInt(startYear)
    ) {
      setEndYearError("Your end date can't be earlier than your start date.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const experienceData = isStudent
      ? {
          isStudent: true,
          school,
          startYear,
          endYear,
          isOver16,
          ...(!isOver16 && { birthDate }),
        }
      : {
          isStudent: false,
          jobTitle,
          employmentType,
          company,
        };

    onSubmit(experienceData); // Pass experience data to the parent component
  };

  const isFormValid = () => {
    if (isStudent) {
      const validYears =
        startYear && endYear && !startYearError && !endYearError;
      if (isOver16) {
        return school && validYears;
      } else {
        return (
          school &&
          validYears &&
          birthDate.month &&
          birthDate.day &&
          birthDate.year
        );
      }
    } else {
      return jobTitle && company;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Employee Fields */}
      {!isStudent && (
        <>
          <InputField
            type="text"
            id="jobTitle"
            name="jobTitle"
            labelText="Most recent job title *"
            value={jobTitle}
            onChange={handleJobTitleChange}
            placeholder=""
            labelClassName="!text-lg !font-normal"
            inputClassName="!py-1 !text-lg rounded-md !border-black !border"
            containerClassName="!mb-4"
            required
          />
          {showAdditionalFields && (
            <>
              <InputField
                type="text"
                id="employmentType"
                name="employmentType"
                labelText="Employment type"
                value={employmentType}
                onChange={handleEmploymentTypeChange}
                placeholder=""
                labelClassName="!text-lg !font-normal"
                inputClassName="!py-1 !text-lg rounded-md !border-black !border"
                containerClassName="!mb-4"
              />
              <InputField
                type="text"
                id="company"
                name="company"
                labelText="Most recent company *"
                value={company}
                onChange={handleCompanyChange}
                placeholder=""
                labelClassName="!text-lg !font-normal"
                inputClassName="!py-1 !text-lg rounded-md !border-black !border"
                containerClassName="!mb-4"
                required
              />
            </>
          )}
        </>
      )}

      {/* Student Fields */}
      {isStudent && (
        <>
          <InputField
            type="text"
            id="school"
            name="school"
            labelText="School or College/University *"
            value={school}
            onChange={handleSchoolChange}
            placeholder=""
            labelClassName="!text-lg !font-normal"
            inputClassName="!py-1 !text-lg rounded-md !border-black !border"
            containerClassName="!mb-4"
            required
          />
          <div className="flex gap-8 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="startYear"
                className="block text-gray-700 text-lg font-normal mb-1"
              >
                Start year *
              </label>
              <select
                id="startYear"
                name="startYear"
                value={startYear}
                onChange={handleStartYearChange}
                onBlur={handleStartYearBlur}
                className={`w-full px-3 py-1 border border-black rounded-md text-lg focus:outline-none focus:border-blue-500 ${
                  startYearError ||
                  endYearError ===
                    "Your end date can't be earlier than your start date."
                    ? "border-red-500"
                    : ""
                }`}
                required
              >
                <option value="">-</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="endYear"
                className="block text-gray-700 text-lg font-normal mb-1"
              >
                End year (or expected) *
              </label>
              <select
                id="endYear"
                name="endYear"
                value={endYear}
                onChange={handleEndYearChange}
                onBlur={handleEndYearBlur}
                className={`w-full px-3 py-1 border border-black rounded-md text-lg focus:outline-none focus:border-blue-500 ${
                  endYearError ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">-</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() + 7 - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Error messages container */}
          <div className="w-full mb-4">
            {startYearError && (
              <p className="text-red-500 text-xl mt-2 w-full">
                {startYearError}
              </p>
            )}
            {endYearError && (
              <p className="text-red-500 text-xl mt-2 w-full">{endYearError}</p>
            )}
          </div>
          <div className="mb-6 w-full flex items-center justify-between px-6 py-6 border border-gray-400 rounded-lg">
            <span className="text-gray-700 text-xl">I’m over 16</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-xl">
                {isOver16 ? "Yes" : "No"}
              </span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isOver16"
                    name="isOver16"
                    checked={isOver16}
                    onChange={handleIsOver16Change}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-200 ${
                      isOver16 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform duration-200 ${
                      isOver16 ? "translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
          {!isOver16 && (
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Date of birth *
              </label>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label
                    htmlFor="month"
                    className="block text-gray-700 text-lg font-normal mb-1"
                  >
                    Month *
                  </label>
                  <select
                    name="month"
                    value={birthDate.month}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-1 border border-black rounded-md text-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="day"
                    className="block text-gray-700 text-lg font-normal mb-1"
                  >
                    Day *
                  </label>
                  <select
                    name="day"
                    value={birthDate.day}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-1 border border-black rounded-md text-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="year"
                    className="block text-gray-700 text-lg font-normal mb-1"
                  >
                    Year *
                  </label>
                  <select
                    name="year"
                    value={birthDate.year}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-1 border border-black rounded-md text-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">-</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option
                        key={new Date().getFullYear() - i}
                        value={new Date().getFullYear() - i}
                      >
                        {new Date().getFullYear() - i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* I'm a Student Button */}
      <div className="mb-6 flex items-center">
        <button
          type="button"
          onClick={handleIsStudentChange}
          className="bg-white w-full text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 text-2xl font-medium transition duration-200 ease-in-out"
        >
          {isStudent ? "I'm not a student" : "I'm a student"}
        </button>
      </div>

      <BlueSubmitButton text="Continue" disabled={!isFormValid()} />
    </form>
  );
};

export default ExperienceForm;

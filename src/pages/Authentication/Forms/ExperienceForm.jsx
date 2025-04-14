import React, { useState } from "react";
import InputField from "../GenericComponents//InputField";
import BlueSubmitButton from "../GenericComponents//BlueSubmitButton";

const ExperienceForm = ({ onSubmit, isLoading = false }) => {
  // Employee fields
  const [jobTitle, setJobTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [company, setCompany] = useState("");
  const [workStartDate, setWorkStartDate] = useState({
    month: "",
    day: "",
    year: "",
  });
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

  const handleWorkStartDateChange = (e) => {
    const { name, value } = e.target;
    setWorkStartDate({ ...workStartDate, [name]: value });
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

    let formattedWorkStartDate = "";
    if (workStartDate?.year && workStartDate?.month && workStartDate?.day) {
      const dateStr = `${workStartDate.year}-${workStartDate.month.padStart(2, "0")}-${workStartDate.day.padStart(2, "0")}`;
      const parsedDate = new Date(dateStr);

      if (!isNaN(parsedDate.getTime())) {
        formattedWorkStartDate = parsedDate.toISOString().split("T")[0];
      }
    }

    let formattedStartYear = "";
    if (startYear) {
      formattedStartYear = startYear + "-10-01";
    }
    let formattedEndYear = "";
    if (endYear) {
      formattedEndYear = endYear + "-06-01";
    }

    const experienceData = isStudent
      ? {
          isStudent: true,
          school,
          startDate: formattedStartYear,
          endDate: formattedEndYear,
        }
      : {
          isStudent: false,
          title: jobTitle,
          employmentType,
          company,
          startDate: formattedWorkStartDate,
        };

    onSubmit(experienceData);
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
      return (
        jobTitle &&
        company &&
        employmentType &&
        workStartDate.year &&
        workStartDate.month &&
        workStartDate.day
      );
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
            inputClassName="!py-1 !text-lg rounded-md"
            containerClassName="!mb-4"
            required
          />
          {showAdditionalFields && (
            <>
              <div className={`mb-4 sm:mb-5 md:mb-6`}>
                <label
                  className={`block text-textContent text-lg !font-normal mb-1`}
                  htmlFor="employmentType"
                >
                  Employment type *
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={employmentType}
                  onChange={handleEmploymentTypeChange}
                  className={`w-full px-3 py-1 !text-lg rounded-md border-2 border-itemBorder bg-inputBackground hover:bg-inputBackgroundHover text-textContent cursor-pointer`}
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="self_employed">Self-employed</option>
                  <option value="freelance">Freelance</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
              </div>
              <InputField
                type="text"
                id="company"
                name="company"
                labelText="Most recent company *"
                value={company}
                onChange={handleCompanyChange}
                placeholder=""
                labelClassName="!text-lg !font-normal"
                inputClassName="!py-1 !text-lg rounded-md"
                containerClassName="!mb-4"
                required
              />
              {/* Work Start Date */}
              <div className="mb-6">
                <label className="block text-textContent text-lg font-semibold mb-2">
                  Work Start Date *
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="month"
                      className="block text-textContent text-lg font-normal mb-1"
                    >
                      Month *
                    </label>
                    <select
                      name="month"
                      value={workStartDate.month}
                      onChange={handleWorkStartDateChange}
                      className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
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
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="day"
                      className="block text-textContent text-lg font-normal mb-1"
                    >
                      Day *
                    </label>
                    <select
                      name="day"
                      value={workStartDate.day}
                      onChange={handleWorkStartDateChange}
                      className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
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
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="year"
                      className="block text-textContent text-lg font-normal mb-1"
                    >
                      Year *
                    </label>
                    <select
                      name="year"
                      value={workStartDate.year}
                      onChange={handleWorkStartDateChange}
                      className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
                      required
                    >
                      <option value="">-</option>
                      {Array.from({ length: 50 }, (_, i) => (
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
            inputClassName="!py-1 !text-lg rounded-md"
            containerClassName="!mb-4"
            required
          />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="startYear"
                className="block text-textContent text-lg font-normal mb-1"
              >
                Start year *
              </label>
              <select
                id="startYear"
                name="startYear"
                value={startYear}
                onChange={handleStartYearChange}
                onBlur={handleStartYearBlur}
                className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
                required
              >
                <option value="">-</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="endYear"
                className="block text-textContent text-lg font-normal mb-1"
              >
                End year (or expected) *
              </label>
              <select
                id="endYear"
                name="endYear"
                value={endYear}
                onChange={handleEndYearChange}
                onBlur={handleEndYearBlur}
                className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
                required
              >
                <option value="">-</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() + 7 - i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error messages */}
          <div className="w-full mb-4">
            {startYearError && (
              <p className="text-red-500 text-base sm:text-lg mt-1">
                {startYearError}
              </p>
            )}
            {endYearError && (
              <p className="text-red-500 text-base sm:text-lg mt-1">
                {endYearError}
              </p>
            )}
          </div>

          {/* Age Verification */}
          <div className="mb-6 w-full flex items-center justify-between p-4 sm:p-6 border border-itemBorder rounded-lg">
            <span className="text-textContent text-lg sm:text-xl mb-2 sm:mb-0">
              I'm over 16
            </span>
            <div className="flex items-center gap-3">
              <span className="text-textContent text-lg sm:text-xl">
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
                      isOver16 ? "bg-buttonSubmitEnable" : "bg-gray-400"
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

          {/* Date of Birth Fields */}
          {!isOver16 && (
            <div className="mb-6">
              <label className="block text-textContent text-lg font-semibold mb-2">
                Date of birth *
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="month"
                    className="block text-textContent text-lg font-normal mb-1"
                  >
                    Month *
                  </label>
                  <select
                    name="month"
                    value={birthDate.month}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
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
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="day"
                    className="block text-textContent text-lg font-normal mb-1"
                  >
                    Day *
                  </label>
                  <select
                    name="day"
                    value={birthDate.day}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
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
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="year"
                    className="block text-textContent text-lg font-normal mb-1"
                  >
                    Year *
                  </label>
                  <select
                    name="year"
                    value={birthDate.year}
                    onChange={handleBirthDateChange}
                    className="w-full px-3 py-2 border border-itemBorder rounded-md text-lg bg-inputBackground hover:bg-inputBackgroundHover text-textContent"
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
          className="bg-cardBackground w-full text-textContent px-6 py-3 rounded-lg hover:bg-buttonSubmitDisable text-xl sm:text-2xl font-medium transition duration-200 ease-in-out"
        >
          {isStudent ? "I'm not a student" : "I'm a student"}
        </button>
      </div>

      <BlueSubmitButton text="Continue" disabled={!isFormValid()} isLoading={isLoading} />
    </form>
  );
};

export default ExperienceForm;

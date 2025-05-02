import { useState } from "react";
import JobListing from "./JobsListing/JobsListing";

const MainJobs = ({
  API_URL,
  enableFilter,
  keyword = "",
  location = "",
  industry = "",
  isAdmin = false,
}) => {
  const [filters, setFilters] = useState({
    experienceLevel: "",
    salaryRange: [0, 0],
    company: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      salaryRange:
        type === "min"
          ? [value, prev.salaryRange[1]]
          : [prev.salaryRange[0], value],
    }));
  };

  return (
    <div className="min-w-screen min-h-screen">
      {enableFilter && (
        <div className="sticky top-0 z-10 border-b border-cardBorder bg-cardBackground justify-center flex">
          <div className="px-4 py-3 w-full max-w-4xl">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Experience Level Dropdown */}
              <div className="relative">
                <label
                  htmlFor="experience-level"
                  className="block text-sm font-medium text-textActivity mb-1"
                >
                  Experience Level
                </label>
                <select
                  id="experience-level"
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange("experienceLevel", e.target.value)
                  }
                  className="bg-cardBackground border border-cardBorder text-textActivity rounded-md px-3 py-2 pr-8 appearance-none hover:border-primary transition-all w-40"
                >
                  <option value="">Any Level</option>
                  <option value="Internship">Internship</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </select>
                <div className="absolute bottom-2 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-xs text-textActivity">▼</span>
                </div>
              </div>

              {/* Salary Range */}
              <div className="flex-1">
                <label
                  htmlFor="min-salary"
                  className="block text-sm font-medium text-textActivity mb-1"
                >
                  Salary Range (Annual)
                </label>
                <div className="flex items-center gap-2 bg-cardBackground border border-cardBorder rounded-md p-2 hover:border-primary transition-all">
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-textActivity">$</span>
                    <input
                      id="min-salary"
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={filters.salaryRange[0] || ""}
                      onChange={(e) => handleSalaryChange("min", e.target.value)}
                      className="bg-transparent border-none text-textActivity w-full focus:outline-none placeholder:text-textPlaceholder"
                    />
                  </div>
                  
                  <span className="text-textActivity font-medium min-w-[40px] text-center">to</span>
                  
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-textActivity">$</span>
                    <input
                      id="max-salary"
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={filters.salaryRange[1] || ""}
                      onChange={(e) => handleSalaryChange("max", e.target.value)}
                      className="bg-transparent border-none text-textActivity w-full focus:outline-none placeholder:text-textPlaceholder"
                    />
                  </div>
                </div>
              </div>

              {/* Company Search */}
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="company-search"
                  className="block text-sm font-medium text-textActivity mb-1"
                >
                  Company
                </label>
                <input
                  id="company-search"
                  type="text"
                  placeholder="Search by company name"
                  value={filters.company}
                  onChange={(e) =>
                    handleFilterChange("company", e.target.value)
                  }
                  className="bg-cardBackground border border-cardBorder text-textActivity rounded-md px-3 py-2 w-full hover:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <JobListing
        API_URL={API_URL}
        filters={{ ...filters, keyword, location, industry }}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default MainJobs;

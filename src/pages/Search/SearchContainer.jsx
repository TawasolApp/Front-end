import { useState } from "react";
import { useParams } from "react-router-dom";
import SearchPosts from "./SearchPosts";
import PeopleSearch from "./SearchPeople";
import CompanySearch from "./SearchCompany";
import SearchJobs from "./SearchJobs";

const SearchContainer = () => {
  const { searchText } = useParams();

  // Default filter states
  const [selectedFilter, setSelectedFilter] = useState("Posts");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("all");
  const [isWithinNetwork, setIsWithinNetwork] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  // force re-render
  const searchPostsKey = `posts-${selectedTimeFrame}-${isWithinNetwork}-${searchText}`;

  return (
    <div className="min-h-screen bg-mainBackground">
      {/* Secondary Navbar - Sticky */}
      <div className="sticky top-0 z-10 border-b border-cardBorder bg-cardBackground">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-14">
            {/* Filter Type Dropdown - Custom green button */}
            <div className="relative mr-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-black font-medium transition-colors"
              >
                <span>{selectedFilter}</span>
                <span className="text-xs">▼</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-cardBackground border border-cardBorder z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {["Posts", "People", "Companies", "Jobs"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`block w-full text-left px-4 py-2 text-sm text-textActivity hover:text-textActivityHover hover:bg-cardBackgroundHover transition-colors ${
                          selectedFilter === filter ? "font-semibold" : ""
                        }`}
                        role="menuitem"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Filters based on selected filter type */}
            {selectedFilter === "Posts" && (
              <div className="flex items-center space-x-4">
                {/* Time Frame Filter */}
                <div className="relative">
                  <select
                    value={selectedTimeFrame}
                    onChange={(e) => setSelectedTimeFrame(e.target.value)}
                    className="bg-cardBackground border border-cardBorder hover:border-2 hover:bg-cardBackgroundHover text-textActivity rounded-md px-3 py-2 appearance-none pr-8 transition-all"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="week">Last week</option>
                    <option value="all">All time</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <span className="text-xs text-textActivity">▼</span>
                  </div>
                </div>

                {/* Within Network Toggle */}
                <label className="flex items-center space-x-2 text-textActivity hover:text-textActivityHover cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWithinNetwork}
                    onChange={() => setIsWithinNetwork(!isWithinNetwork)}
                    className="rounded bg-cardBackground border-cardBorder text-green-500 focus:ring-green-500"
                  />
                  <span>Within network</span>
                </label>
              </div>
            )}

            {selectedFilter === "People" && (
              <div className="relative">
                <input
                  type="text"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  placeholder="Company"
                  className="bg-navbarSearch border border-cardBorder hover:border-2 text-navbarIconsNormal rounded-md px-3 py-2 w-48 transition-all focus:outline-none"
                />
              </div>
            )}

            {selectedFilter === "Companies" && (
              <div className="relative">
                <input
                  type="text"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  placeholder="Industry"
                  className="bg-navbarSearch border border-cardBorder hover:border-2 text-navbarIconsNormal rounded-md px-3 py-2 w-48 transition-all focus:outline-none"
                />
              </div>
            )}

            {selectedFilter === "Jobs" && (
              <div className="relative">
                <input
                  type="text"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  placeholder="Industry"
                  className="bg-navbarSearch border border-cardBorder hover:border-2 text-navbarIconsNormal rounded-md px-3 py-2 w-48 transition-all focus:outline-none"
                />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Location"
                  className="bg-navbarSearch border border-cardBorder hover:border-2 text-navbarIconsNormal rounded-md ml-2 px-3 py-2 w-48 transition-all focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the appropriate component based on the selected filter */}
      {selectedFilter === "Posts" && (
        <SearchPosts
          key={searchPostsKey}
          searchText={searchText}
          timeframe={selectedTimeFrame}
          network={isWithinNetwork}
        />
      )}

      {selectedFilter === "People" && (
        <PeopleSearch searchText={searchText} company={companyFilter} />
      )}

      {selectedFilter === "Companies" && (
        <CompanySearch searchText={searchText} industry={industryFilter} />
      )}

      {selectedFilter === "Jobs" && (
        <SearchJobs
          keyword={searchText}
          industry={industryFilter}
          location={locationFilter}
        />
      )}
    </div>
  );
};

export default SearchContainer;

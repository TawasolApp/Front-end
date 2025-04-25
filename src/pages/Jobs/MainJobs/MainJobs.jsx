import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../apis/axios';
import JobListing from './JobsListing/JobsListing';

const MainJobs = ({ API_URL, enableFilter }) => {
  const [filters, setFilters] = useState({
    experienceLevel: '',
    salaryRange: [0, 0],
    company: ''
  });
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs with pagination and filters
  const fetchJobs = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const params = {
        page,
        limit: 20,
        experience_level: filters.experienceLevel,
        min_salary: filters.salaryRange[0],
        max_salary: filters.salaryRange[1],
        company: filters.company
      };

      const response = await axiosInstance.get(API_URL, { params });
      const newJobs = response.data;

      setJobs(prev => page === 1 ? newJobs : [...prev, ...newJobs]);
      setHasMore(response.data.length > 0);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSalaryChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      salaryRange: type === 'min' 
        ? [value, prev.salaryRange[1]] 
        : [prev.salaryRange[0], value]
    }));
    setPage(1);
  };

  return (
    <div className="min-w-screen min-h-screen">
      {enableFilter && (
        <div className="sticky top-0 z-10 border-b border-cardBorder bg-cardBackground justify-center flex">
          <div className="px-4 py-3 w-full max-w-4xl">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Experience Level Dropdown */}
              <div className="relative">
                <label htmlFor="experience-level" className="block text-sm font-medium text-textActivity mb-1">
                  Experience Level
                </label>
                <select
                  id="experience-level"
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="bg-cardBackground border border-cardBorder text-textActivity rounded-md px-3 py-2 pr-8 appearance-none hover:border-primary transition-all w-40"
                >
                  <option value="">Any Level</option>
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
                <div className="absolute bottom-2 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-xs text-textActivity">▼</span>
                </div>
              </div>

              {/* Salary Range */}
              <div className="flex-1">
                <label htmlFor="salary-range" className="block text-sm font-medium text-textActivity mb-1">
                  Salary Range (Annual)
                </label>
                <div className="flex items-center gap-2 bg-cardBackground border border-cardBorder rounded-md p-2 hover:border-primary transition-all">
                  <span className="text-textActivity text-lg">$</span>
                  <input
                    id="min-salary"
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={filters.salaryRange[0] || ''}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    className="bg-transparent border-none text-textActivity w-24 focus:outline-none"
                  />
                  <span className="text-textActivity font-medium">to</span>
                  <span className="text-textActivity text-lg">$</span>
                  <input
                    id="max-salary"
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={filters.salaryRange[1] || ''}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    className="bg-transparent border-none text-textActivity w-24 focus:outline-none"
                  />
                </div>
              </div>

              {/* Company Search */}
              <div className="flex-1">
                <label htmlFor="company-search" className="block text-sm font-medium text-textActivity mb-1">
                  Company
                </label>
                <input
                  id="company-search"
                  type="text"
                  placeholder="Search by company name"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="bg-cardBackground border border-cardBorder text-textActivity rounded-md px-3 py-2 w-full hover:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <JobListing jobs={jobs} />
    </div>
  );
};

export default MainJobs;
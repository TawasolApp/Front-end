import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../apis/axios';
import JobItem from './JobItem';

const JobListing = ({ API_URL, filters }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch jobs with pagination and filters
  const fetchJobs = async (isNewFilter = false) => {
    if (!hasMore && !isNewFilter) return;
    
    setLoading(true);
    try {
      const currentPage = isNewFilter ? 1 : page;
      
      const params = {
        page: currentPage,
        limit: 20,
        experienceLevel: filters.experienceLevel || undefined,
        minSalary: filters.salaryRange[0] || undefined,
        maxSalary: filters.salaryRange[1] || undefined,
        company: filters.company || undefined
      };
      
      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await axiosInstance.get(API_URL, { params });
      const newJobs = response.data;

      setJobs(prev => isNewFilter ? newJobs : [...prev, ...newJobs]);
      setHasMore(newJobs.length === params.limit);
      setError(null);
      
      if (isNewFilter) {
        setPage(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Load more jobs when user clicks the load more button
  const loadMoreJobs = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchJobs(true);
  }, [filters]);

  // When page changes (load more)
  useEffect(() => {
    if (page > 1) {
      fetchJobs();
    }
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {jobs.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No job listings match your search criteria.</p>
          <p className="text-gray-400">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <JobItem key={job.id} job={job} />
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      )}

      {hasMore && !loading && jobs.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreJobs}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cardBackground border border-cardBorder text-textActivity rounded-lg hover:bg-gray-100 transition-all"
          >
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListing;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../../apis/axios';
import JobItem from './JobItem';
import JobDescription from '../JobDescription/JobDescription';

const JobListing = ({ API_URL, filters }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const observer = useRef();
  const limit = 5;
  const navigate = useNavigate();

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768 && selectedJob) {
        navigate(`/jobs/${selectedJob}`, { replace: true }); // Cleanup mobile URL
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedJob]);

  const handleJobClick = (jobId) => {
    if (isMobile) {
      navigate(`/jobs/${jobId}/description`);
    } else {
      setSelectedJob(jobId);
    }
  };

  const fetchJobs = useCallback(async (isNewFilter = false) => {
    if (!hasMore && !isNewFilter) return;
    
    setLoading(true);
    try {
      const currentPage = isNewFilter ? 1 : page;
      
      const params = {
        page: currentPage,
        limit: limit,
        experienceLevel: filters.experienceLevel || undefined,
        minSalary: Number(filters.salaryRange[0]) || undefined,
        maxSalary: Number(filters.salaryRange[1]) || undefined,
        company: filters.company || undefined
      };

      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await axiosInstance.get(API_URL, { params });
      const newJobs = response.data;
      console.log(newJobs)

      setJobs(prev => isNewFilter ? newJobs : [...prev, ...newJobs]);
      setHasMore(newJobs.length === limit);
      setError(null);
      
      if (isNewFilter) setPage(1);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [API_URL, filters, page, hasMore]);

  // Infinite scroll observer
  const lastJobElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Initial load and filter changes
  useEffect(() => {
    fetchJobs(true);
  }, [filters]);

  // Page changes
  useEffect(() => {
    if (page > 1) fetchJobs();
  }, [page]);

  return (
    <div className={`container mx-auto px-4 py-6 md:flex ${selectedJob && !isMobile ? 'md:gap-4' : ''}`}>
      {/* Listings container with background */}
      <div 
        className={`bg-cardBackground rounded-lg shadow-sm ${
          selectedJob && !isMobile ? 'md:w-1/2 lg:w-1/3' : 'w-full'
        }`}
      >
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
          <div className={`w-full`}>
            {jobs.map((job, index) => (
              <div 
                ref={index === jobs.length - 1 ? lastJobElementRef : null}
                key={job.jobId}
                className="p-2"
                onClick={() => handleJobClick(job.jobId)}
              >
                <JobItem 
                  job={job}
                  isSelected={job.jobId === selectedJob}
                  isMobile={isMobile}
                />
              </div>
            ))}
            {!isMobile && (
              <div className={`md :w-1/2 lg:w-2/3 ${selectedJob ? '' : 'hidden'}`}>
                {selectedJob ? (
                  <JobDescription jobId={selectedJob} />
                ) : (
                  <div className="h-full bg-cardBackground rounded-lg shadow-sm flex items-center justify-center">
                    <p className="text-gray-500">Select a job to view details</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
  
        {/* Loading and end indicators */}
        {loading && (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
        {!hasMore && jobs.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            No more jobs to show
          </div>
        )}
      </div>
      
    </div>
  );
};

export default JobListing;

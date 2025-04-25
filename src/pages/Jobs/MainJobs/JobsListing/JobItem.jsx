import React from 'react';

const JobItem = ({ job, isSelected }) => {
  return (
    <div className={`flex items-start p-4 border-b border-gray-200 ${isSelected ? 'bg-blue-50' : ''}`}>
      <div className="mr-3">
        <img 
          src={job.companyLogo} 
          alt={`${job.companyName} logo`} 
          className="w-12 h-12 rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-blue-600">{job.position}</h3>
        <div className="mt-1 text-gray-700">{job.companyName}</div>
        <div className="text-gray-500">{job.companyLocation}</div>
      </div>
      {isSelected && (
        <div className="ml-2">
          <button className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobItem;

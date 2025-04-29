import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MainJobs from '../../../pages/Jobs/MainJobs/MainJobs';
import JobListing from '../../../pages/Jobs/MainJobs/JobsListing/JobsListing';

// Mock dependencies
vi.mock('../../../pages/Jobs/MainJobs/JobsListing/JobsListing', () => ({
  default: vi.fn(() => <div data-testid="job-listing-mock" />)
}));

describe('MainJobs component', () => {
  const defaultProps = {
    API_URL: '/jobs',
    enableFilter: true,
    keyword: '',
    location: '',
    industry: '',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with JobListing', () => {
    render(<MainJobs {...defaultProps} />);
    expect(screen.getByTestId('job-listing-mock')).toBeInTheDocument();
  });
  
  it('should render filter section when enableFilter is true', () => {
    render(<MainJobs {...defaultProps} enableFilter={true} />);
    expect(screen.getByLabelText('Experience Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Salary Range (Annual)')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
  });
  
  it('should not render filter section when enableFilter is false', () => {
    render(<MainJobs {...defaultProps} enableFilter={false} />);
    expect(screen.queryByLabelText('Experience Level')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Salary Range (Annual)')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Company')).not.toBeInTheDocument();
  });
  
  it('should pass correct API_URL to JobListing', () => {
    const customUrl = '/custom-jobs';
    render(<MainJobs {...defaultProps} API_URL={customUrl} />);
    expect(JobListing).toHaveBeenCalledWith(
      expect.objectContaining({ API_URL: customUrl }),
      undefined
    );
  });
  
  it('should pass isAdmin prop to JobListing', () => {
    render(<MainJobs {...defaultProps} isAdmin={true} />);
    expect(JobListing).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: true }),
      undefined
    );
  });
  
  it('should update filters state when experience level is changed', () => {
    render(<MainJobs {...defaultProps} />);
    
    const select = screen.getByLabelText('Experience Level');
    fireEvent.change(select, { target: { value: 'Senior' } });
    
    expect(JobListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          experienceLevel: 'Senior'
        })
      }),
      undefined
    );
  });
  
  it('should update minSalary when min input changes', () => {
    render(<MainJobs {...defaultProps} />);
    
    const minSalary = screen.getByPlaceholderText('Min');
    fireEvent.change(minSalary, { target: { value: '50000' } });
    
    expect(JobListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          salaryRange: ['50000', 0]
        })
      }),
      undefined
    );
  });
  
  it('should update maxSalary when max input changes', () => {
    render(<MainJobs {...defaultProps} />);
    
    const maxSalary = screen.getByPlaceholderText('Max');
    fireEvent.change(maxSalary, { target: { value: '100000' } });
    
    expect(JobListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          salaryRange: [0, '100000']
        })
      }),
      undefined
    );
  });
  
  it('should update company filter when company search input changes', () => {
    render(<MainJobs {...defaultProps} />);
    
    const companyInput = screen.getByLabelText('Company');
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    
    expect(JobListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          company: 'Google'
        })
      }),
      undefined
    );
  });
  
  it('should pass keyword, location, and industry props to JobListing filters', () => {
    const customProps = {
      ...defaultProps,
      keyword: 'developer',
      location: 'New York',
      industry: 'Technology'
    };
    
    render(<MainJobs {...customProps} />);
    
    expect(JobListing).toHaveBeenCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          keyword: 'developer',
          location: 'New York',
          industry: 'Technology'
        })
      }),
      undefined
    );
  });
  
  it('should combine user-selected filters with props in JobListing', () => {
    const customProps = {
      ...defaultProps,
      keyword: 'developer',
      location: 'New York'
    };
    
    render(<MainJobs {...customProps} />);
    
    // Change experience level
    const select = screen.getByLabelText('Experience Level');
    fireEvent.change(select, { target: { value: 'Mid' } });
    
    // Change min salary
    const minSalary = screen.getByPlaceholderText('Min');
    fireEvent.change(minSalary, { target: { value: '60000' } });
    
    // Verify all filters are passed to JobListing
    expect(JobListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ 
        filters: expect.objectContaining({
          keyword: 'developer',
          location: 'New York',
          experienceLevel: 'Mid',
          salaryRange: ['60000', 0]
        })
      }),
      undefined
    );
  });
  
  it('should have the correct layout and styling', () => {
    const { container } = render(<MainJobs {...defaultProps} />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-w-screen');
    expect(mainDiv).toHaveClass('min-h-screen');
    
    const filterSection = mainDiv.firstChild;
    expect(filterSection).toHaveClass('sticky');
    expect(filterSection).toHaveClass('top-0');
    expect(filterSection).toHaveClass('z-10');
    expect(filterSection).toHaveClass('bg-cardBackground');
  });
});
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JobListing from '../../../../pages/Jobs/MainJobs/JobsListing/JobsListing';
import { axiosInstance } from '../../../../apis/axios';

// Define navigate mock first (before mocks)
const navigateMock = vi.fn();

const defaultProps = {
  filters: {},
  jobs: [],
  isAdmin: false,
};

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

// Mock the child components
vi.mock('../../../../pages/Jobs/MainJobs/JobsListing/JobItem', () => ({
  default: ({ job, isSelected, onDelete }) => (
    <div data-testid={`job-item-${job.jobId}`} className={isSelected ? 'selected' : ''}>
      <span>{job.title}</span>
      <button data-testid={`delete-${job.jobId}`} onClick={onDelete}>Delete</button>
    </div>
  )
}));

vi.mock('../../../../pages/Jobs/MainJobs/JobDescription/JobDescription', () => ({
  default: ({ jobId }) => <div data-testid="job-description">{jobId}</div>
}));

vi.mock('../../../../pages/Jobs/MainJobs/ApplicantsList/ApplicantsList', () => ({
  default: ({ jobId }) => <div data-testid="applicants-list">{jobId}</div>
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock data
const mockJobs = [
  { jobId: '1', title: 'Software Engineer' },
  { jobId: '2', title: 'Product Manager' },
  { jobId: '3', title: 'UI Designer' }
];

describe('JobListing Component', () => {
  const defaultProps = {
    API_URL: '/api/jobs',
    filters: {
      keyword: '',
      location: '',
      industry: '',
      experienceLevel: '',
      salaryRange: [0, 0],
      company: ''
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset navigate mock
    navigateMock.mockReset();
    
    // Mock successful API response - this is key to getting proper data flow
    axiosInstance.get.mockResolvedValue({
      data: { jobs: mockJobs }
    });
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop size by default
    });

    // Mock resize event
    window.dispatchEvent = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders initial component with loading state', async () => {
    // Use act to ensure all updates complete
    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    // Should show initial text
    expect(screen.getByText('Top job picks for you')).toBeInTheDocument();
    
    // Wait for API to be called
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/jobs', {
        params: expect.objectContaining({
          page: 1,
          limit: 10
        })
      });
    });

    // Wait for job items to appear
    await waitFor(() => {
      expect(screen.getAllByTestId(/job-item-/)).toHaveLength(3);
    });
  }, 1000); // Increase timeout for this test

  it('shows jobs count when jobs are loaded', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    // First we need to wait for the API call to complete
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Then test for the results count text
    await waitFor(() => {
      // The jobs count could be displayed with a space, find it with regex
      const resultsElement = screen.getByText(/3 results/i);
      expect(resultsElement).toBeInTheDocument();
    });
  }, 1000);

  it('displays no jobs found message when API returns empty array', async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValue({ data: { jobs: [] } });

    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your filters or search terms/)).toBeInTheDocument();
    });
  }, 1000);

  it('displays error message when API fails', async () => {
    // Mock API error
    axiosInstance.get.mockRejectedValue({ message: 'API Error' });

    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  }, 1000);

  it('selects a job when clicked in desktop view', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    // First ensure the API has been called and the jobs are rendered
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
      expect(screen.getAllByTestId(/job-item-/)).toHaveLength(3);
    });

    // Click on a job
    await act(async () => {
      fireEvent.click(screen.getByTestId('job-item-1'));
    });

    // Job description should be shown
    await waitFor(() => {
      expect(screen.getByTestId('job-description')).toBeInTheDocument();
      expect(screen.getByTestId('job-description')).toHaveTextContent('1');
    });
  }, 1000);

  it('shows applicants list when in admin mode and a job is selected', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} isAdmin={true} />
        </MemoryRouter>
      );
    });

    // First ensure the API has been called and the jobs are rendered
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
      expect(screen.getAllByTestId(/job-item-/)).toHaveLength(3);
    });

    // Click on a job
    await act(async () => {
      fireEvent.click(screen.getByTestId('job-item-1'));
    });

    // Applicants list should be shown instead of job description
    await waitFor(() => {
      expect(screen.getByTestId('applicants-list')).toBeInTheDocument();
      expect(screen.queryByTestId('job-description')).not.toBeInTheDocument();
    });
  }, 1000);

  it('handles mobile view correctly', async () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <JobListing {...defaultProps} />
        </MemoryRouter>
      );
    });

    // First ensure the API has been called and the jobs are rendered
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
      expect(screen.getAllByTestId(/job-item-/)).toHaveLength(3);
    });

    // Click on a job in mobile view should navigate
    await act(async () => {
      fireEvent.click(screen.getByTestId('job-item-1'));
    });
    
    expect(navigateMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/jobs/1');
  }, 1000);
});
// Additional test cases to append to the existing file:

// Fix for IntersectionObserver mock - replace the previous mock with this
beforeEach(() => {
  vi.clearAllMocks();
  
  // Reset navigate mock
  navigateMock.mockReset();
  
  // Mock successful API response
  axiosInstance.get.mockResolvedValue({
    data: { jobs: mockJobs }
  });
  
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024 // Desktop size by default
  });

  // Better IntersectionObserver mock
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  
  window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
    return {
      observe,
      unobserve,
      disconnect,
      callback
    };
  });

  // Mock trigger for IntersectionObserver
  global.triggerIntersectionObserver = (isIntersecting) => {
    const calls = window.IntersectionObserver.mock.calls;
    if (calls.length > 0) {
      const [callback] = calls[calls.length - 1];
      callback([{ isIntersecting }]);
    }
  };

  // Mock resize event
  window.dispatchEvent = vi.fn();
});

it('renders without crashing', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <JobListing {...defaultProps} />
      </MemoryRouter>
    );
  });
  expect(screen.getByText('Top job picks for you')).toBeInTheDocument();
});
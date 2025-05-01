import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import JobDescription from '../../../../pages/Jobs/MainJobs/JobDescription/JobDescription';
import { axiosInstance } from '../../../../apis/axios';
import { formatDate } from '../../../../utils/dates';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../../../../utils/dates', () => ({
  formatDate: vi.fn()
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve())
  }
});

// Mock components
vi.mock('../../../Feed/GenericComponents/DropdownMenu', () => ({
  default: ({ children, menuItems }) => (
    <div data-testid="dropdown-menu">
      {children}
      <div data-testid="menu-items">
        {menuItems.map((item, index) => (
          <button key={index} onClick={item.onClick} data-testid={`menu-item-${index}`}>
            {item.text}
          </button>
        ))}
      </div>
    </div>
  )
}));

vi.mock('../Apply/JobApplyModal', () => ({
  default: ({ onClose, jobId, companyName, onApply }) => (
    <div data-testid="job-apply-modal">
      <button onClick={onClose} data-testid="close-modal">Close</button>
      <button onClick={onApply} data-testid="apply-job">Apply</button>
      <div>Apply to {companyName} for job {jobId}</div>
    </div>
  )
}));

// Mock icons
vi.mock('react-icons/fa', () => ({
  FaExternalLinkAlt: () => <div data-testid="external-link-icon" />
}));

vi.mock('@mui/icons-material/Link', () => ({
  default: () => <div data-testid="link-icon" />
}));

vi.mock('@mui/icons-material/ArrowBack', () => ({
  default: () => <div data-testid="arrow-back-icon" sx={{ fontSize: 32 }} />
}));

vi.mock('@mui/icons-material/MoreHoriz', () => ({
  default: () => <div data-testid="more-horiz-icon" sx={{ fontSize: 32 }} />
}));

vi.mock('@mui/icons-material/Flag', () => ({
  default: () => <div data-testid="flag-icon" />
}));

// Mock navigate function
const mockNavigate = vi.fn();

describe('JobDescription component', () => {
  const mockJobId = '123';
  const mockJob = {
    jobId: mockJobId,
    position: 'Software Engineer',
    companyId: 'comp-1',
    companyName: 'Test Company',
    companyLogo: 'https://example.com/logo.png',
    companyLocation: 'Remote',
    postedAt: '2023-04-15T10:00:00Z',
    applicants: 42,
    employmentType: 'Full-time',
    locationType: 'Remote',
    description: 'This is a job description',
    isSaved: false,
    status: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    formatDate.mockReturnValue('2 days');
  });

  it('should render loading skeleton initially', () => {
    axiosInstance.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    // Use queryByTestId instead of getByTestId to check for absence
    expect(screen.queryByTestId('more-horiz-icon')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(document.querySelector('.bg-gray-200')).toBeInTheDocument();
  });

  it('should show error state when API request fails', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch job'));
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error-404');
    });
  });

  it('should render job details when loaded successfully', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(mockJob.position)).toBeInTheDocument();
      expect(screen.getByText(mockJob.companyName)).toBeInTheDocument();
      expect(screen.getByText(mockJob.description)).toBeInTheDocument();
      expect(screen.getByText(`${mockJob.applicants} clicked apply`)).toBeInTheDocument();
      
      // Use simpler selectors with more specific queries
      const employmentTypeHeading = screen.getByText('Employment type');
      expect(employmentTypeHeading.nextElementSibling).toHaveTextContent('Full-time');
      
      const locationTypeHeading = screen.getByText('Location type');
      expect(locationTypeHeading.nextElementSibling).toHaveTextContent('Remote');
    });
  });

  it('should render back button when enableReturn is true', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} enableReturn={true} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const backButton = screen.getByTestId('arrow-back-icon').closest('button');
      expect(backButton).toBeInTheDocument();
    });
  });

  it('should not render back button when enableReturn is false', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} enableReturn={false} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('arrow-back-icon')).not.toBeInTheDocument();
    });
  });

  it('should navigate back when back button is clicked', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} enableReturn={true} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const backButton = screen.getByTestId('arrow-back-icon').closest('button');
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it('should save job when save button is clicked', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    axiosInstance.patch.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeInTheDocument();
      
      fireEvent.click(saveButton);
    });
    
    expect(axiosInstance.patch).toHaveBeenCalledWith(`/jobs/${mockJobId}/save`);
    expect(toast.success).toHaveBeenCalledWith('Job saved');
    
    // After saving, button should change to "Unsave"
    await waitFor(() => {
      expect(screen.getByText('Unsave')).toBeInTheDocument();
    });
  });

  it('should unsave job when unsave button is clicked', async () => {
    const savedJob = { ...mockJob, isSaved: true };
    axiosInstance.get.mockResolvedValueOnce({ data: savedJob });
    axiosInstance.delete.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const unsaveButton = screen.getByText('Unsave');
      expect(unsaveButton).toBeInTheDocument();
      
      fireEvent.click(unsaveButton);
    });
    
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/jobs/${mockJobId}/unsave`);
    expect(toast.success).toHaveBeenCalledWith('Job unsaved');
    
    // After unsaving, button should change to "Save"
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  it('should show error toast when saving job fails', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    axiosInstance.patch.mockRejectedValueOnce(new Error('Failed to save'));
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
    });
    
    expect(toast.error).toHaveBeenCalledWith('Failed to save job, please try again.');
  });

  it('should open apply modal when apply button is clicked', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
    });
    
    // Check for the modal title instead of using data-testid
    expect(screen.getByText(`APPLY TO ${mockJob.companyName.toUpperCase()}`)).toBeInTheDocument();
  });

  it('should close apply modal when close button is clicked', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
    });
    
    // Verify modal is open
    expect(screen.getByText(`APPLY TO ${mockJob.companyName.toUpperCase()}`)).toBeInTheDocument();
    
    // Find and click the actual close button
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    fireEvent.click(closeButton);
    
    // Check modal is closed
    await waitFor(() => {
      expect(screen.queryByText(`APPLY TO ${mockJob.companyName.toUpperCase()}`)).not.toBeInTheDocument();
    });
  });

  it('should refresh job data after successful application', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    // Add the post mock
    axiosInstance.post = vi.fn().mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(mockJob.position)).toBeInTheDocument();
    });
    
    // Click the apply button to open the modal
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);
    
    // Fill out and submit the form
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    vi.clearAllMocks(); // Clear previous calls to axiosInstance.get
    
    // Submit the form directly
    const form = screen.getByText('Submit Application').closest('form');
    fireEvent.submit(form);
    
    // Wait for the API call to refresh job data
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${mockJobId}`);
    });
  });

  it('should disable apply button when job has status', async () => {
    const appliedJob = { ...mockJob, status: 'Pending' };
    axiosInstance.get.mockResolvedValueOnce({ data: appliedJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const applyButton = screen.getByText('Apply');
      expect(applyButton).toBeDisabled();
      expect(applyButton).toHaveClass('bg-buttonSubmitDisable');
      expect(applyButton).toHaveClass('cursor-not-allowed');
    });
  });

  it('should render status badge when job has status', async () => {
    const pendingJob = { ...mockJob, status: 'Pending' };
    axiosInstance.get.mockResolvedValueOnce({ data: pendingJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Under Review')).toBeInTheDocument();
    });
  });

  it('should render different status badges based on status', async () => {
    // Test with Accepted status
    const acceptedJob = { ...mockJob, status: 'Accepted' };
    axiosInstance.get.mockResolvedValueOnce({ data: acceptedJob });
    
    const { unmount } = render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Accepted')).toBeInTheDocument();
    });
    
    unmount();
    
    // Test with Rejected status
    const rejectedJob = { ...mockJob, status: 'Rejected' };
    axiosInstance.get.mockResolvedValueOnce({ data: rejectedJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Not Selected')).toBeInTheDocument();
    });
  });

  it('should show saving state while saving job', async () => {
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    axiosInstance.patch.mockReturnValueOnce(promise);
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
    });
    
    // Button should show "Saving..." and have a spinner
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    
    // Resolve the promise to complete the saving process
    resolvePromise({});
    
    await waitFor(() => {
      expect(screen.getByText('Unsave')).toBeInTheDocument();
    });
  });

  it('should copy job link to clipboard', async () => {
    // Mock clipboard and window.location
    const originalClipboard = navigator.clipboard.writeText;
    const mockClipboardWrite = vi.fn().mockResolvedValue(undefined);
    navigator.clipboard.writeText = mockClipboardWrite;
    
    // Mock window.location.origin
    const originalLocationOrigin = window.location.origin;
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://test.example.com' },
      writable: true
    });
    
    // Render with job data
    axiosInstance.get.mockResolvedValueOnce({ data: mockJob });
    
    render(
      <MemoryRouter>
        <JobDescription jobId={mockJobId} />
      </MemoryRouter>
    );
  
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText(mockJob.position)).toBeInTheDocument();
    });
    
    // Get the mocked dropdown menu button and trigger the menu item click
    const moreButton = screen.getByTestId('more-horiz-icon').closest('button');
    fireEvent.click(moreButton);
    
    // The mock implementation creates buttons with test IDs 'menu-item-0', 'menu-item-1', etc.
    const copyLinkButton = screen.getByTestId('link-icon');
    await act(async () => {
      await fireEvent.click(copyLinkButton);
    });
    
    // Verify clipboard was called with correct URL
    expect(mockClipboardWrite).toHaveBeenCalledWith(
      `https://test.example.com/jobs/${mockJobId}`
    );
    
    // Verify toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      'Link copied to clipboard.',
      expect.objectContaining({ 
        position: 'bottom-left', 
        autoClose: 3000 
      })
    );
    
    // Clean up
    navigator.clipboard.writeText = originalClipboard;
    Object.defineProperty(window, 'location', { 
      value: { origin: originalLocationOrigin },
      writable: true 
    });
  });
});
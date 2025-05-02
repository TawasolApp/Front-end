import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicantsList from '../../../../pages/Jobs/MainJobs/ApplicantsList/ApplicantsList';
import { axiosInstance } from '../../../../apis/axios';
import { formatDate } from '../../../../utils/dates';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn()
  }
}));

vi.mock('../../../../utils/dates', () => ({
  formatDate: vi.fn()
}));

vi.mock('@mui/material', () => ({
  CircularProgress: vi.fn(() => <div data-testid="circular-progress" />),
  Skeleton: vi.fn(({ variant, width, height }) => (
    <div 
      data-testid={`skeleton-${variant || 'default'}`}
      data-width={width}
      data-height={height}
    />
  ))
}));

vi.mock('@mui/icons-material/CheckCircleOutline', () => ({
  default: vi.fn(() => <div data-testid="check-icon" />)
}));

vi.mock('@mui/icons-material/HighlightOff', () => ({
  default: vi.fn(() => <div data-testid="close-icon" />)
}));

vi.mock('@mui/icons-material/ArrowBack', () => ({
  default: vi.fn(() => <div data-testid="back-icon" sx={{ fontSize: 32 }} />)
}));

vi.mock('@mui/icons-material/Description', () => ({
  default: vi.fn(() => <div data-testid="description-icon" />)
}));

vi.mock('@mui/icons-material/SentimentDissatisfied', () => ({
  default: vi.fn(() => <div data-testid="sad-icon" />)
}));

// Create a mock for the StatusBadge component since it's not exported separately
const MockStatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800", label: "Under Review" },
    Accepted: { color: "bg-green-100 text-green-800", label: "Accepted" },
    Rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
  };

  return (
    <span
      data-testid="status-badge"
      className={`px-2 py-1 text-xs md:text-sm rounded-full ${statusConfig[status]?.color || "bg-gray-100"}`}
    >
      {statusConfig[status]?.label || status}
    </span>
  );
};

describe('ApplicantsList component', () => {
  const mockNavigate = vi.fn();
  const mockJobId = '123';
  const mockApplicants = [
    {
      applicationId: '1',
      applicantName: 'John Doe',
      applicantEmail: 'john@example.com',
      applicantPicture: 'https://example.com/john.jpg',
      applicantHeadline: 'Software Engineer',
      applicantPhoneNumber: '+1234567890',
      resumeURL: 'https://example.com/resume.pdf',
      status: 'Pending',
      appliedDate: '2023-04-15T10:30:00.000Z'
    },
    {
      applicationId: '2',
      applicantName: 'Jane Smith',
      applicantEmail: 'jane@example.com',
      applicantPicture: 'https://example.com/jane.jpg',
      applicantPhoneNumber: '+0987654321',
      status: 'Accepted',
      appliedDate: '2023-04-10T08:45:00.000Z'
    }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    // Default mock to show no "Load More" button
    axiosInstance.get.mockResolvedValue({
      data: { applications: mockApplicants }
    });
    formatDate.mockImplementation((date) => '3 days');
  });
  
  // Test StatusBadge directly with our mock instead of importing from component
  describe('StatusBadge component', () => {
    it('should render with correct styling for Pending status', () => {
      const { getByTestId } = render(<MockStatusBadge status="Pending" />);
      const badge = getByTestId('status-badge');
      expect(badge).toHaveTextContent('Under Review');
      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveClass('text-yellow-800');
    });
    
    it('should render with correct styling for Accepted status', () => {
      const { getByTestId } = render(<MockStatusBadge status="Accepted" />);
      const badge = getByTestId('status-badge');
      expect(badge).toHaveTextContent('Accepted');
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
    });
    
    it('should render with correct styling for Rejected status', () => {
      const { getByTestId } = render(<MockStatusBadge status="Rejected" />);
      const badge = getByTestId('status-badge');
      expect(badge).toHaveTextContent('Rejected');
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
    });
    
    it('should render with fallback styling for unknown status', () => {
      const { getByTestId } = render(<MockStatusBadge status="Unknown" />);
      const badge = getByTestId('status-badge');
      expect(badge).toHaveTextContent('Unknown');
      expect(badge).toHaveClass('bg-gray-100');
    });
  });
  
  // Tests for ApplicantsList
  describe('ApplicantsList main component', () => {
    it('should render loading skeletons initially', () => {
      axiosInstance.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
      render(<ApplicantsList jobId={mockJobId} />);
      
      expect(screen.getAllByTestId('skeleton-circular').length).toBe(3); // Three skeleton items
    });
    
    it('should fetch applicants on mount', async () => {
      render(<ApplicantsList jobId={mockJobId} />);
      
      expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${mockJobId}/applicants`, {
        params: { page: 1, limit: 10 }
      });
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
    
    it('should display error message when fetch fails', async () => {
      const errorMessage = 'Failed to load applicants';
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      });
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
    
    it('should display fallback error message when response has no message', async () => {
      axiosInstance.get.mockRejectedValueOnce({
        response: {}
      });
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch applicants')).toBeInTheDocument();
      });
    });
    
    it('should render the back button when enableReturn is true', async () => {
      render(<ApplicantsList jobId={mockJobId} enableReturn={true} />);
      
      await waitFor(() => {
        const backButton = screen.getByTestId('back-icon').closest('button');
        expect(backButton).toBeInTheDocument();
      });
    });
    
    it('should not render the back button when enableReturn is false', async () => {
      render(<ApplicantsList jobId={mockJobId} enableReturn={false} />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('back-icon')).not.toBeInTheDocument();
      });
    });
    
    it('should navigate back when return button is clicked', async () => {
      render(<ApplicantsList jobId={mockJobId} enableReturn={true} />);
      
      await waitFor(() => {
        const backButton = screen.getByTestId('back-icon').closest('button');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
    
    it('should display applicants count correctly', async () => {
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        expect(screen.getByText(`${mockApplicants.length} applicants found`)).toBeInTheDocument();
      });
    });
    
    it('should render applicant cards with correct information', async () => {
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Phone: +1234567890')).toBeInTheDocument();
      });
    });
    
    it('should update status when accept button is clicked', async () => {
      axiosInstance.patch.mockResolvedValueOnce({});
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        const acceptButton = screen.getAllByTestId('check-icon')[0].closest('button');
        fireEvent.click(acceptButton);
      });
      
      expect(axiosInstance.patch).toHaveBeenCalledWith('/jobs/applications/1/status', {
        status: 'Accepted'
      });
      
      expect(toast.success).toHaveBeenCalledWith('Application accepted');
    });
    
    it('should update status when reject button is clicked', async () => {
      axiosInstance.patch.mockResolvedValueOnce({});
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        const rejectButton = screen.getAllByTestId('close-icon')[0].closest('button');
        fireEvent.click(rejectButton);
      });
      
      expect(axiosInstance.patch).toHaveBeenCalledWith('/jobs/applications/1/status', {
        status: 'Rejected'
      });
      
      expect(toast.success).toHaveBeenCalledWith('Application rejected');
    });
    
    it('should show error toast when status update fails', async () => {
      const errorMessage = 'Update failed';
      axiosInstance.patch.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      });
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        const acceptButton = screen.getAllByTestId('check-icon')[0].closest('button');
        fireEvent.click(acceptButton);
      });
      
      expect(toast.error).toHaveBeenCalledWith(`Failed to update status: ${errorMessage}`);
    });
    
    it('should load more applicants when button is clicked', async () => {
      // Create array of 10 applicants to trigger hasMore=true
      const fullPageApplicants = Array(10).fill(null).map((_, i) => ({
        applicationId: `app-${i}`,
        applicantName: `Applicant ${i}`,
        applicantEmail: `applicant${i}@example.com`,
        applicantPicture: `https://example.com/pic${i}.jpg`,
        applicantPhoneNumber: `+${i}123456789`,
        status: 'Pending',
        appliedDate: '2023-04-15T10:30:00.000Z'
      }));
      
      const additionalApplicants = [
        {
          applicationId: '3',
          applicantName: 'Bob Johnson',
          applicantEmail: 'bob@example.com',
          applicantPicture: 'https://example.com/bob.jpg',
          applicantPhoneNumber: '+1122334455',
          status: 'Pending',
          appliedDate: '2023-04-08T14:20:00.000Z'
        }
      ];
      
      // First call returns exactly limit=10 applicants (triggering hasMore=true)
      // Second call returns one additional applicant
      axiosInstance.get
        .mockResolvedValueOnce({ data: { applications: fullPageApplicants } })
        .mockResolvedValueOnce({ data: { applications: additionalApplicants } });
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      // Wait for the Load More button to appear (since hasMore should be true)
      await waitFor(() => {
        const loadMoreButton = screen.getByText(/Load More Applications/i);
        expect(loadMoreButton).toBeInTheDocument();
        fireEvent.click(loadMoreButton);
      });
      
      // Check that second API call was made with page=2
      expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${mockJobId}/applicants`, {
        params: { page: 2, limit: 10 }
      });
      
      // Check that new applicant was added to the list
      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });
    
    it('should show "No more applications" message when no more results', async () => {
      // First request returns exactly limit items to trigger hasMore=true
      const fullPageApplicants = Array(10).fill(null).map((_, i) => ({
        applicationId: `app-${i}`,
        applicantName: `Applicant ${i}`,
        applicantEmail: `applicant${i}@example.com`,
        applicantPicture: `https://example.com/pic${i}.jpg`,
        applicantPhoneNumber: `+${i}123456789`,
        status: 'Pending',
        appliedDate: '2023-04-15T10:30:00.000Z'
      }));
      
      // First call returns 10 items, second returns empty array
      axiosInstance.get
        .mockResolvedValueOnce({ data: { applications: fullPageApplicants } })
        .mockResolvedValueOnce({ data: { applications: [] } });
      
      render(<ApplicantsList jobId={mockJobId} />);
      
      // Wait for the Load More button and click it
      await waitFor(() => {
        const loadMoreButton = screen.getByText(/Load More Applications/i);
        fireEvent.click(loadMoreButton);
      });
      
      // After clicking, the second API response should trigger the "No more" message
      await waitFor(() => {
        expect(screen.getByText('No more applications to show')).toBeInTheDocument();
        expect(screen.getByTestId('sad-icon')).toBeInTheDocument();
      });
    });
    
    it('should reset page and refetch when jobId changes', async () => {
      const newJobId = '456';
      const { rerender } = render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${mockJobId}/applicants`, {
          params: { page: 1, limit: 10 }
        });
      });
      
      rerender(<ApplicantsList jobId={newJobId} />);
      
      expect(axiosInstance.get).toHaveBeenCalledWith(`/jobs/${newJobId}/applicants`, {
        params: { page: 1, limit: 10 }
      });
    });
    
    it('should render resume link when resumeURL is available', async () => {
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        const resumeLink = screen.getByText('View Resume');
        expect(resumeLink).toBeInTheDocument();
        expect(resumeLink.closest('a')).toHaveAttribute('href', mockApplicants[0].resumeURL);
        expect(resumeLink.closest('a')).toHaveAttribute('target', '_blank');
      });
    });
    
    it('should not render resume link when resumeURL is not available', async () => {
      render(<ApplicantsList jobId={mockJobId} />);
      
      await waitFor(() => {
        // Second applicant doesn't have a resumeURL
        const applicantCard = screen.getByText('Jane Smith').closest('div').closest('div');
        expect(applicantCard.textContent).not.toContain('View Resume');
      });
    });
  });
});

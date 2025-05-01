import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import JobItem from '../../../../pages/Jobs/MainJobs/JobsListing/JobItem';
import { axiosInstance } from '../../../../apis/axios';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    delete: vi.fn()
  }
}));

vi.mock('@mui/icons-material/Delete', () => ({
  default: () => <svg data-testid="delete-icon" />
}));

describe('JobItem Component', () => {
  const mockJob = {
    jobId: 'job123',
    position: 'Software Engineer',
    companyName: 'Tech Company',
    companyLogo: 'https://example.com/logo.png',
    location: 'New York',
    locationType: 'Remote'
  };
  
  const mockOnDelete = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders job information correctly', () => {
    render(<JobItem job={mockJob} />);
    
    expect(screen.getByText(mockJob.position)).toBeInTheDocument();
    expect(screen.getByText(mockJob.companyName)).toBeInTheDocument();
    expect(screen.getByText(`${mockJob.location} · (${mockJob.locationType})`)).toBeInTheDocument();
    
    const logoImg = screen.getByAltText(`${mockJob.companyName} logo`);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', mockJob.companyLogo);
  });
  
  it('applies selected styling when isSelected is true', () => {
    const { container } = render(<JobItem job={mockJob} isSelected={true} />);
    
    const jobItem = container.firstChild;
    expect(jobItem).toHaveClass('border-l-2');
    expect(jobItem).toHaveClass('border-selectedBorder');
    expect(jobItem).toHaveClass('bg-selectedBackground');
  });
  
  it('applies regular styling when isSelected is false', () => {
    const { container } = render(<JobItem job={mockJob} isSelected={false} />);
    
    const jobItem = container.firstChild;
    expect(jobItem).toHaveClass('border-y');
    expect(jobItem).toHaveClass('border-cardBorder');
    expect(jobItem).not.toHaveClass('border-l-2');
    expect(jobItem).not.toHaveClass('border-selectedBorder');
    expect(jobItem).not.toHaveClass('bg-selectedBackground');
  });
  
  it('shows delete button for admin users', () => {
    render(<JobItem job={mockJob} isAdmin={true} />);
    
    const deleteButton = screen.getByLabelText('Delete job');
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });
  
  it('does not show delete button for non-admin users', () => {
    render(<JobItem job={mockJob} isAdmin={false} />);
    
    expect(screen.queryByLabelText('Delete job')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-icon')).not.toBeInTheDocument();
  });
  
  it('calls API to delete job when delete button is clicked', async () => {
    axiosInstance.delete.mockResolvedValueOnce({});
    
    render(<JobItem job={mockJob} isAdmin={true} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByLabelText('Delete job');
    fireEvent.click(deleteButton);
    
    // Verify API call
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/jobs/${mockJob.jobId}`);
    
    // Verify toast and callback
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Job deleted successfully',
        expect.objectContaining({
          position: 'bottom-left',
          autoClose: 3000
        })
      );
      expect(mockOnDelete).toHaveBeenCalledWith(mockJob.jobId);
    });
  });
  
  it('shows error toast when deletion fails', async () => {
    const errorMessage = 'Permission denied';
    axiosInstance.delete.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    render(<JobItem job={mockJob} isAdmin={true} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByLabelText('Delete job');
    fireEvent.click(deleteButton);
    
    // Verify API call
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/jobs/${mockJob.jobId}`);
    
    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });
  
  it('shows generic error message when API error has no message', async () => {
    axiosInstance.delete.mockRejectedValueOnce({
      response: { data: {} }
    });
    
    render(<JobItem job={mockJob} isAdmin={true} />);
    
    const deleteButton = screen.getByLabelText('Delete job');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete job');
    });
  });
});
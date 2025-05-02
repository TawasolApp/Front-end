import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import JobApplyModal from '../../../../pages/Jobs/MainJobs/Apply/JobApplyModal';
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
    post: vi.fn()
  }
}));

vi.mock('@mui/icons-material/Close', () => ({
  default: vi.fn(() => <div data-testid="close-icon" />)
}));

describe('JobApplyModal component', () => {
  const mockProps = {
    jobId: '123',
    companyName: 'Test Company',
    onClose: vi.fn(),
    onApply: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with the correct company name', () => {
    render(<JobApplyModal {...mockProps} />);
    expect(screen.getByText(`APPLY TO ${mockProps.companyName.toUpperCase()}`)).toBeInTheDocument();
  });

  it('should close the modal when close button is clicked', () => {
    render(<JobApplyModal {...mockProps} />);
    
    const closeButton = screen.getByTestId('close-icon').closest('button');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should update phone number state when input changes', () => {
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    expect(phoneInput.value).toBe('1234567890');
  });

  it('should submit the application with correct data when form is valid', async () => {
    axiosInstance.post.mockResolvedValueOnce({});
    
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    const form = screen.getByText('Submit Application').closest('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    expect(axiosInstance.post).toHaveBeenCalledWith('/jobs/apply', {
      jobId: mockProps.jobId,
      phoneNumber: '1234567890',
      resumeURL: 'https://example.com/resume.pdf'
    });
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Application submitted successfully.', 
        expect.objectContaining({
          position: 'bottom-left',
          autoClose: 3000
        })
      );
    });
    
    expect(mockProps.onApply).toHaveBeenCalledTimes(1);
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should show API error message when submission fails', async () => {
    const errorMessage = 'You have already applied for this job';
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    const form = screen.getByText('Submit Application').closest('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    expect(mockProps.onApply).not.toHaveBeenCalled();
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('should show generic error message when submission fails without specific message', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: {} // No data.message
    });
    
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    const form = screen.getByText('Submit Application').closest('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit application')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    // Use a promise that doesn't resolve immediately to test loading state
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    axiosInstance.post.mockReturnValueOnce(promise);
    
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    const form = screen.getByText('Submit Application').closest('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    
    // Resolve the promise to complete the test
    await act(async () => {
      resolvePromise({});
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
    });
  });

  it('should have required attribute on phone number input', () => {
    render(<JobApplyModal {...mockProps} />);
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    expect(phoneInput).toHaveAttribute('required');
  });

  it('should have the correct button styles when disabled', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    axiosInstance.post.mockReturnValueOnce(promise);
    
    render(<JobApplyModal {...mockProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    const form = screen.getByText('Submit Application').closest('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    const disabledButton = screen.getByText('Submitting...');
    expect(disabledButton).toBeDisabled();
    expect(disabledButton).toHaveClass('disabled:opacity-50');
    
    // Resolve the promise to complete the test
    await act(async () => {
      resolvePromise({});
    });
  });
});
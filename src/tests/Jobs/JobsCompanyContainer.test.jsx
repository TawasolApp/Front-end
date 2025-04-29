import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import JobsCompanyContainer from '../../pages/Jobs/JobsCompanyContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../apis/axios';
import MainJobs from '../../pages/Jobs/MainJobs/MainJobs';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn()
}));

vi.mock('../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

vi.mock('../../pages/Jobs/MainJobs/MainJobs', () => ({
  default: vi.fn(() => <div data-testid="main-jobs-mock" />)
}));

describe('JobsCompanyContainer component', () => {
  const mockNavigate = vi.fn();
  const mockCompanyId = '123';
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ companyId: mockCompanyId });
    axiosInstance.get.mockResolvedValue({
      data: { isManager: false } // Default to non-admin
    });
  });
  
  it('should render the component with MainJobs', async () => {
    render(<JobsCompanyContainer />);
    expect(screen.getByTestId('main-jobs-mock')).toBeInTheDocument();
  });
  
  it('should navigate to 404 page when companyId is missing', () => {
    useParams.mockReturnValueOnce({ companyId: undefined });
    render(<JobsCompanyContainer />);
    expect(mockNavigate).toHaveBeenCalledWith('/error-404');
  });
  
  it('should fetch company data on mount', async () => {
    render(<JobsCompanyContainer />);
    expect(axiosInstance.get).toHaveBeenCalledWith(`/companies/${mockCompanyId}`);
  });
  
  it('should set isAdmin to true when user is company manager', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { isManager: true }
    });
    
    render(<JobsCompanyContainer />);
    
    await waitFor(() => {
      expect(MainJobs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isAdmin: true
        }),
        undefined
      );
    });
  });
  
  it('should set isAdmin to false when user is not company manager', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { isManager: false }
    });
    
    render(<JobsCompanyContainer />);
    
    await waitFor(() => {
      expect(MainJobs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isAdmin: false
        }),
        undefined
      );
    });
  });
  
  it('should handle API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('API error');
    axiosInstance.get.mockRejectedValueOnce(error);
    
    render(<JobsCompanyContainer />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching company data:', error);
    });
    
    consoleErrorSpy.mockRestore();
  });
  
  it('should pass correct props to MainJobs', async () => {
    render(<JobsCompanyContainer />);
    
    expect(MainJobs).toHaveBeenCalledWith(
      expect.objectContaining({
        API_URL: `/companies/${mockCompanyId}/jobs`,
        enableFilter: true,
        isAdmin: false // Default value before API response
      }),
      undefined
    );
    
    // Check props after API response
    await waitFor(() => {
      expect(MainJobs).toHaveBeenCalled();
    });
  });
  
  it('should have the correct layout structure and styling', () => {
    const { container } = render(<JobsCompanyContainer />);
    
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('min-w-screen');
    expect(outerDiv).toHaveClass('min-h-screen');
    expect(outerDiv).toHaveClass('bg-mainBackground');
    expect(outerDiv).toHaveClass('gap-0');
  });
});
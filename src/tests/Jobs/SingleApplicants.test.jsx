import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SingleApplicants from '../../pages/Jobs/SingleApplicants';
import { useParams } from 'react-router-dom';
import ApplicantsList from '../../pages/Jobs/MainJobs/ApplicantsList/ApplicantsList';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn()
}));

vi.mock('../../pages/Jobs/MainJobs/ApplicantsList/ApplicantsList', () => ({
  default: vi.fn(() => <div data-testid="applicants-list-mock" />)
}));

describe('SingleApplicants component', () => {
  const mockId = '123';
  
  beforeEach(() => {
    useParams.mockReturnValue({ id: mockId });
    vi.clearAllMocks();
  });
  
  it('should render the component with ApplicantsList', () => {
    render(<SingleApplicants />);
    expect(screen.getByTestId('applicants-list-mock')).toBeInTheDocument();
  });
  
  it('should pass the correct props to ApplicantsList', () => {
    render(<SingleApplicants />);
    expect(ApplicantsList).toHaveBeenCalledWith(
      {
        jobId: mockId,
        enableReturn: true
      },
      undefined  // React passes props as first arg and undefined as second arg
    );
  });
  
  it('should extract job id from URL params', () => {
    const customId = '456';
    useParams.mockReturnValueOnce({ id: customId });
    
    render(<SingleApplicants />);
    
    expect(ApplicantsList).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: customId
      }),
      undefined
    );
  });
  
  it('should have the correct layout structure', () => {
    const { container } = render(<SingleApplicants />);
    
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('min-h-screen');
    expect(outerDiv).toHaveClass('bg-mainBackground');
    
    const innerDiv = outerDiv.firstChild;
    expect(innerDiv).toHaveClass('mx-0');
    expect(innerDiv).toHaveClass('px-0');
    expect(innerDiv).toHaveClass('md:max-w-3xl');
    expect(innerDiv).toHaveClass('md:mx-auto');
    expect(innerDiv).toHaveClass('md:px-4');
    expect(innerDiv).toHaveClass('md:py-8');
  });
  
  it('should set enableReturn prop to true', () => {
    render(<SingleApplicants />);
    expect(ApplicantsList).toHaveBeenCalledWith(
      expect.objectContaining({
        enableReturn: true
      }),
      undefined
    );
  });
});
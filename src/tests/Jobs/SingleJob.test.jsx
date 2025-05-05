import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SingleJob from '../../pages/Jobs/SingleJob';
import { useParams } from 'react-router-dom';
import JobDescription from '../../pages/Jobs/MainJobs/JobDescription/JobDescription';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn()
}));

vi.mock('../../pages/Jobs/MainJobs/JobDescription/JobDescription', () => ({
  default: vi.fn(() => <div data-testid="job-description-mock" />)
}));


describe('SingleJob component', () => {
  const mockId = '123';
  
  beforeEach(() => {
    useParams.mockReturnValue({ id: mockId });
    vi.clearAllMocks();
  });
  
  it('should render the component with JobDescription', () => {
    render(<SingleJob />);
    expect(screen.getByTestId('job-description-mock')).toBeInTheDocument();
  });
  
  it('should pass the correct props to JobDescription', () => {
    render(<SingleJob />);
    expect(JobDescription).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: mockId,
        enableReturn: true
      }),
      undefined  // React passes props as first arg and undefined as second arg
    );
  });
  
  it('should have the correct layout structure', () => {
    const { container } = render(<SingleJob />);
    
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
});

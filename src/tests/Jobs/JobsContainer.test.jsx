import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import JobsContainer from '../../pages/Jobs/JobsContainer';
import MainJobs from '../../pages/Jobs/MainJobs/MainJobs';

// Mock dependencies
vi.mock('../../pages/Jobs/MainJobs/MainJobs', () => ({
  default: vi.fn(() => <div data-testid="main-jobs-mock" />)
}));

describe('JobsContainer component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should render the component with MainJobs', () => {
    render(<JobsContainer />);
    expect(screen.getByTestId('main-jobs-mock')).toBeInTheDocument();
  });
  
  it('should pass the correct props to MainJobs', () => {
    render(<JobsContainer />);
    expect(MainJobs).toHaveBeenCalledWith(
      {
        API_URL: '/jobs',
        enableFilter: true
      },
      undefined
    );
  });
  
  it('should have the correct layout structure and styling', () => {
    const { container } = render(<JobsContainer />);
    
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('min-w-screen');
    expect(outerDiv).toHaveClass('min-h-screen');
    expect(outerDiv).toHaveClass('bg-mainBackground');
    expect(outerDiv).toHaveClass('gap-0');
  });
  
  it('should render MainJobs with the proper API URL', () => {
    render(<JobsContainer />);
    expect(MainJobs).toHaveBeenCalledWith(
      expect.objectContaining({
        API_URL: '/jobs'
      }),
      undefined
    );
  });
  
  it('should enable filters in MainJobs component', () => {
    render(<JobsContainer />);
    expect(MainJobs).toHaveBeenCalledWith(
      expect.objectContaining({
        enableFilter: true
      }),
      undefined
    );
  });
});
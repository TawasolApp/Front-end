import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import RepostsContainer from '../../pages/Feed/RepostsContainer';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn()
}));

// Mock MainFeed component
vi.mock('../../pages/Feed/MainFeed/MainFeed', () => ({
  default: vi.fn(props => (
    <div data-testid="main-feed" data-api-route={props.API_ROUTE} data-show-share={props.showShare.toString()}>
      MainFeed Mock
    </div>
  ))
}));

describe('RepostsContainer', () => {
  beforeEach(() => {
    // Set up a default mock value for useParams
    useParams.mockReturnValue({ id: '123456' });
  });

  it('renders with correct structure and classes', () => {
    const { container } = render(<RepostsContainer />);
    
    // Check that the main container has the correct classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex', 'justify-center', 'min-h-screen', 'bg-mainBackground');
    
    // Check that the main element has the correct classes
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass(
      'w-full',
      'mt-2',
      'md:mt-4',
      'md:ml-4',
      'md:flex-1',
      'lg:max-w-md',
      'xl:max-w-xl',
      'xl:flex-shrink-0'
    );
  });

  it('passes the correct props to MainFeed based on URL params', () => {
    useParams.mockReturnValue({ id: '789' });
    render(<RepostsContainer />);
    
    const mainFeedElement = screen.getByTestId('main-feed');
    
    // Check the API_ROUTE prop is correctly constructed with the id
    expect(mainFeedElement.dataset.apiRoute).toBe('/posts/789/reposts');
    
    // Check that showShare is false
    expect(mainFeedElement.dataset.showShare).toBe('false');
  });

  it('renders MainFeed with a different post ID when URL changes', () => {
    useParams.mockReturnValue({ id: '123' });
    const { rerender } = render(<RepostsContainer />);
    
    expect(screen.getByTestId('main-feed').dataset.apiRoute).toBe('/posts/123/reposts');
    
    // Update params and rerender to simulate navigation
    useParams.mockReturnValue({ id: '456' });
    rerender(<RepostsContainer />);
    
    expect(screen.getByTestId('main-feed').dataset.apiRoute).toBe('/posts/456/reposts');
  });

  it('renders the MainFeed component with showShare set to false', () => {
    render(<RepostsContainer />);
    
    // Verify that the MainFeed component is rendered with showShare=false
    const mainFeedElement = screen.getByTestId('main-feed');
    expect(mainFeedElement.dataset.showShare).toBe('false');
  });

  it('applies the correct layout structure', () => {
    const { container } = render(<RepostsContainer />);
    
    // Check that the component structure follows the expected nesting
    const outerDiv = container.firstChild;
    expect(outerDiv.tagName).toBe('DIV');
    
    const mainElement = outerDiv.firstChild;
    expect(mainElement.tagName).toBe('MAIN');
    
    // Check that MainFeed is inside the main element
    expect(mainElement.firstChild).toBe(screen.getByTestId('main-feed'));
  });
});
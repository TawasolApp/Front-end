import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavedPostsContainer from '../pages/SavedPosts/SavedPostsContainer';

// Mock the SavedPosts component
vi.mock('../pages/SavedPosts/SavedPosts', () => ({
  default: () => <div data-testid="saved-posts-mock">Saved Posts Component</div>
}));

describe('SavedPostsContainer Component', () => {
  it('renders with the correct layout and classes', () => {
    const { container } = render(<SavedPostsContainer />);
    
    // Check main container exists with correct classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('justify-center');
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('bg-mainBackground');
    expect(mainContainer).toHaveClass('p-4');
    
    // Check for main content area
    const mainContent = container.querySelector('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('w-[540px]');
    expect(mainContent).toHaveClass('flex-grow-0');
    expect(mainContent).toHaveClass('mx-2');
    expect(mainContent).toHaveClass('space-y-4');
  });
  
  it('renders the SavedPosts component', () => {
    render(<SavedPostsContainer />);
    
    // Check that SavedPosts component is rendered
    const savedPostsComponent = screen.getByTestId('saved-posts-mock');
    expect(savedPostsComponent).toBeInTheDocument();
    expect(savedPostsComponent).toHaveTextContent('Saved Posts Component');
  });
});
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeedContainer from '../../pages/Feed/FeedContainer';

vi.mock('../../pages/Feed/LeftSideBar/LeftSideBar', () => ({
    default: () => <div data-testid="left-sidebar">Left Sidebar Mock</div>
}));
  
vi.mock('../../pages/Feed/MainFeed/MainFeed', () => ({
    default: () => <div data-testid="main-feed">Main Feed Mock</div>
}));
  
vi.mock('../../pages/Feed/RightSideBar/RightSideBar', () => ({
    default: () => <div data-testid="right-sidebar">Right Sidebar Mock</div>
}));


describe('FeedContainer', () => {
  it('renders the component with correct structure', () => {
    const { container } = render(<FeedContainer />);
    
    // Check that the main container has the correct classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-mainBackground');
    
    // Check that the max width container exists
    const maxWidthContainer = mainContainer.firstChild;
    expect(maxWidthContainer).toHaveClass('max-w-7xl', 'mx-auto');
    
    // Check that the flex layout container exists
    const flexContainer = maxWidthContainer.firstChild;
    expect(flexContainer).toHaveClass('flex', 'flex-wrap', 'justify-center');
  });
  
  it('renders all three main sections', () => {
    render(<FeedContainer />);
    
    // Check that all sections are rendered
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-feed')).toBeInTheDocument();
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
  });
  
  it('has the main feed in a main element with correct classes', () => {
    const { container } = render(<FeedContainer />);
    
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass(
      'w-full',
      'min-w-[430px]',
      'mt-4',
      'md:ml-4',
      'md:flex-1'
    );
  });
  
  it('has the right sidebar initially hidden on smaller screens', () => {
    const { container } = render(<FeedContainer />);
    
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveClass('hidden', 'lg:block');
  });
  
  it('applies responsive width classes to the left sidebar', () => {
    const { container } = render(<FeedContainer />);
    
    // Find left sidebar container (first div inside the flex container)
    const leftSidebarContainer = container.querySelector('.flex.flex-wrap > div:first-child');
    
    expect(leftSidebarContainer).toHaveClass(
      'w-full',
      'sm:w-full',
      'md:w-48',
      'lg:w-52',
      'xl:w-56',
      'flex-shrink-0'
    );
  });
  
  it('has proper border and background classes for card containers', () => {
    const { container } = render(<FeedContainer />);
    
    // Check left sidebar card styling
    const leftSidebarCard = container.querySelector('.bg-cardBackground.rounded-lg.border.border-cardBorder');
    expect(leftSidebarCard).toBeInTheDocument();
    
    // Check right sidebar card styling
    const rightSidebarCard = container.querySelector('aside .bg-cardBackground.rounded-lg.p-4.border.border-cardBorder');
    expect(rightSidebarCard).toBeInTheDocument();
  });
});
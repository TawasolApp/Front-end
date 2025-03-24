import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';  // Import jest-dom for DOM matchers
import FeedContainer from '../pages/Feed/FeedContainer';

// Mock the child components
vi.mock('../pages/Feed/LeftSideBar/LeftSideBar', () => ({
  default: () => <div data-testid="left-sidebar">Left Sidebar Mock</div>
}));

vi.mock('../pages/Feed/MainFeed/MainFeed', () => ({
  default: () => <div data-testid="main-feed">Main Feed Mock</div>
}));

vi.mock('../pages/Feed/RightSideBar/RightSideBar', () => ({
  default: () => <div data-testid="right-sidebar">Right Sidebar Mock</div>
}));

// Helper function to render component with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('FeedContainer', () => {
  it('renders without crashing', () => {
    renderWithRouter(<FeedContainer />);
    // Change to use screen query and truthy assertion
    expect(screen.getAllByText(/Left Sidebar Mock/i).length).toBeGreaterThan(0);
});

  it('renders all child components', () => {
    renderWithRouter(<FeedContainer />);
    expect(screen.getAllByTestId('left-sidebar').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('main-feed').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('right-sidebar').length).toBeGreaterThan(0);
  });

  it('has the correct responsive layout structure', () => {
    const { container } = renderWithRouter(<FeedContainer />);
    
    // XL screens layout
    expect(container.querySelector('.hidden.xl\\:flex')).toBeTruthy();
    
    // LG screens layout
    expect(container.querySelector('.hidden.lg\\:flex.xl\\:hidden')).toBeTruthy();
    
    // MD screens layout
    expect(container.querySelector('.hidden.md\\:flex.lg\\:hidden')).toBeTruthy();
    
    // SM screens layout
    expect(container.querySelector('.hidden.sm\\:block.md\\:hidden')).toBeTruthy();
    
    // Mobile layout
    expect(container.querySelector('.sm\\:hidden')).toBeTruthy();
  });

  it('has correct layout for extra large screens', () => {
    const { container } = renderWithRouter(<FeedContainer />);
    const xlLayout = container.querySelector('.hidden.xl\\:flex');
    
    expect(xlLayout.querySelectorAll('[data-testid="left-sidebar"]').length).toBe(1);
    expect(xlLayout.querySelectorAll('[data-testid="main-feed"]').length).toBe(1);
    expect(xlLayout.querySelectorAll('[data-testid="right-sidebar"]').length).toBe(1);
  });
  
  it('has correct layout for medium screens (no right sidebar)', () => {
    const { container } = renderWithRouter(<FeedContainer />);
    const mdLayout = container.querySelector('.hidden.md\\:flex.lg\\:hidden');
    
    expect(mdLayout.querySelectorAll('[data-testid="left-sidebar"]').length).toBe(1);
    expect(mdLayout.querySelectorAll('[data-testid="main-feed"]').length).toBe(1);
    expect(mdLayout.querySelectorAll('[data-testid="right-sidebar"]').length).toBe(0);
  });
});
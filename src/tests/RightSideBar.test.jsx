import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RightSideBar from '../pages/Feed/RightSideBar/RightSideBar';

describe('RightSideBar Component', () => {
  it('renders the sidebar with correct text', () => {
    render(<RightSideBar />);
    
    // Check that the heading text is rendered correctly
    const headingElement = screen.getByText('Right Sidebar');
    expect(headingElement).toBeInTheDocument();
    
    // Verify that it's an h2 element
    expect(headingElement.tagName).toBe('H2');
    
    // Check for the correct CSS classes
    expect(headingElement).toHaveClass('text-textPlaceholder');
    expect(headingElement).toHaveClass('font-medium');
    expect(headingElement).toHaveClass('mb-4');
  });
  
  it('returns a single element', () => {
    const { container } = render(<RightSideBar />);
    
    // The component should only return a single root element
    expect(container.childElementCount).toBe(1);
  });
});
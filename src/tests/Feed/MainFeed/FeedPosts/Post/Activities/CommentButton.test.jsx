import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CommentButton from '../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/CommentButton';

// Mock the Material UI icon
vi.mock('@mui/icons-material/ChatBubbleOutline', () => ({
    default: function MockIcon(props) {
      return (
        <div 
          data-testid="comment-icon-wrapper" 
          className={props.className}
        >
          <span data-testid="comment-icon">CommentIcon</span>
        </div>
      );
    }
  }));

describe('CommentButton Component', () => {
  it('renders with comment icon and text', () => {
    render(<CommentButton />);
    
    // Check that the icon is rendered
    expect(screen.getByTestId('comment-icon')).toBeInTheDocument();
    
    // Check that the text is rendered
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });
  
  it('calls setShowComments when clicked', () => {
    const mockSetShowComments = vi.fn();
    render(<CommentButton setShowComments={mockSetShowComments} />);
    
    // Find and click the button
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check that the callback was called
    expect(mockSetShowComments).toHaveBeenCalledTimes(1);
  });
  
  it('does not throw when setShowComments is not provided', () => {
    // This should render without errors even without the callback prop
    expect(() => {
      render(<CommentButton />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
    }).not.toThrow();
  });
  
  it('has correct styling classes', () => {
    const { container } = render(<CommentButton />);
    
    // Get the button element
    const button = screen.getByRole('button');
    
    // Check that it has the expected Tailwind classes
    expect(button).toHaveClass('p-2');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('gap-1');
    expect(button).toHaveClass('hover:bg-buttonIconHover');
    expect(button).toHaveClass('group');
    
    // Check text styling
    const textElement = screen.getByText('Comment');
    expect(textElement).toHaveClass('text-sm');
    expect(textElement).toHaveClass('font-semibold');
    expect(textElement).toHaveClass('text-textActivity');
    expect(textElement).toHaveClass('group-hover:text-textActivityHover');
  });
  
  it('applies proper styling to icon', () => {
    render(<CommentButton />);
    
    // Get the icon element - in the mocked implementation, this is what we can check
    const icon = screen.getByTestId('comment-icon');

    // In our mocked component, we need to check for the wrapper div that's 
    // created around our mock icon, which is where the styles are applied
    const iconWrapper = icon.closest('div') || icon.parentElement;
    
    // Check that the wrapper has the expected styling classes
    expect(iconWrapper).toHaveClass('text-textActivity');
    expect(iconWrapper).toHaveClass('group-hover:text-textActivityHover');
  });
  
  it('renders as a button element', () => {
    render(<CommentButton />);
    
    // Verify it's actually a button element
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });
});
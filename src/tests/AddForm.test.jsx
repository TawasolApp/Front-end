import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddForm from '../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/AddForm';

// Mock the Material-UI Avatar component
vi.mock('@mui/material', () => ({
  Avatar: ({ sx, className, src }) => (
    <img 
      data-testid="avatar-mock"
      className={className}
      src={src}
      style={sx}
      alt="User avatar"
    />
  )
}));

describe('AddForm Component', () => {
  const mockHandleAddFunction = vi.fn();
  const mockClose = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders correctly for Comment type', () => {
    render(<AddForm handleAddFunction={mockHandleAddFunction} type="Comment" />);
    
    // Check placeholder text
    const textarea = screen.getByPlaceholderText('Add a comment...');
    expect(textarea).toBeInTheDocument();
    
    // Avatar should be displayed
    expect(screen.getByTestId('avatar-mock')).toBeInTheDocument();
    
    // Submit button should not be visible when no text
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
    
    // Cancel button should not be visible for Comment type
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });
  
  it('renders correctly for Reply type', () => {
    render(
      <AddForm 
        handleAddFunction={mockHandleAddFunction} 
        type="Reply" 
        close={mockClose}
      />
    );
    
    // Check placeholder text (should show Edit Comment...)
    const textarea = screen.getByPlaceholderText('Edit Comment...');
    expect(textarea).toBeInTheDocument();
    
    // Reply button should be visible even without text
    expect(screen.getByText('Reply')).toBeInTheDocument();
    
    // Cancel button should be visible for Reply type
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  it('expands when text is entered', async () => {
    render(<AddForm handleAddFunction={mockHandleAddFunction} type="Comment" />);
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    
    // Initially, form should not be expanded
    expect(textarea.className).toContain('rounded-2xl');
    expect(textarea.className).not.toContain('rounded-xl');
    
    // Enter text
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    // Form should now be expanded
    await waitFor(() => {
      expect(textarea.className).toContain('rounded-xl');
      expect(textarea.className).not.toContain('rounded-2xl');
    });
    
    // Submit button should now be visible
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });
  
  it('submits comment when form is submitted', () => {
    render(<AddForm handleAddFunction={mockHandleAddFunction} type="Comment" />);
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    
    // Enter text
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check if handleAddFunction was called with the correct text
    expect(mockHandleAddFunction).toHaveBeenCalledWith('Test comment');
    
    // Text should be cleared after submission
    expect(textarea.value).toBe('');
  });
  
  it('handles empty submission correctly', () => {
    render(<AddForm handleAddFunction={mockHandleAddFunction} type="Comment" />);
    
    // Submit the form with empty text
    fireEvent.submit(screen.getByRole('form'));
    
    // handleAddFunction should not be called
    expect(mockHandleAddFunction).not.toHaveBeenCalled();
  });
  
  it('calls close function when Cancel button is clicked in Reply mode', () => {
    render(
      <AddForm 
        handleAddFunction={mockHandleAddFunction} 
        type="Reply" 
        close={mockClose}
      />
    );
    
    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // close function should be called
    expect(mockClose).toHaveBeenCalled();
  });
  
  it('initializes with provided initialText', () => {
    render(
      <AddForm 
        handleAddFunction={mockHandleAddFunction} 
        type="Comment" 
        initialText="Initial comment text"
      />
    );
    
    // Textarea should contain the initial text
    const textarea = screen.getByPlaceholderText('Add a comment...');
    expect(textarea.value).toBe('Initial comment text');
    
    // Form should be expanded due to having text
    expect(textarea.className).toContain('rounded-xl');
    expect(textarea.className).not.toContain('rounded-2xl');
    
    // Submit button should be visible
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });
  
  it('adjusts textarea height based on content', async () => {
    render(<AddForm handleAddFunction={mockHandleAddFunction} type="Comment" />);
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    
    // Mock scrollHeight (not directly testable in JSDOM)
    Object.defineProperty(textarea, 'scrollHeight', { value: 100 });
    
    // Trigger resize by changing text
    fireEvent.change(textarea, { target: { value: 'Test comment with multiple lines\nSecond line\nThird line' } });
    
    // Wait for the effect to run
    await waitFor(() => {
      // Height should be adjusted to either the scrollHeight or the min height of 64px
      expect(textarea.style.height).toBeTruthy();
    });
  });
  
  it('maintains expanded state for Reply type even without text', () => {
    render(
      <AddForm 
        handleAddFunction={mockHandleAddFunction} 
        type="Reply" 
        close={mockClose}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Edit Comment...');
    
    // Form should be expanded for Reply type
    expect(textarea.className).toContain('rounded-xl');
    expect(textarea.className).not.toContain('rounded-2xl');
    
    // Submit button should be visible for Reply type
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });
});
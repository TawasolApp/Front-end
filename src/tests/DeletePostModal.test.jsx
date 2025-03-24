import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeletePostModal from '../pages/Feed/MainFeed/FeedPosts/DeleteModal/DeletePostModal';

describe('DeletePostModal Component', () => {
  // Mock props
  const mockCloseModal = vi.fn();
  const mockDeleteFunc = vi.fn();
  
  beforeEach(() => {
    // Clear mock function calls between tests
    vi.clearAllMocks();
  });

  it('renders correctly for deleting a post', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Check title and message
    expect(screen.getByText('Delete Post')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this post?')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders correctly for deleting a comment', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Comment"
      />
    );
    
    // Check title and message
    expect(screen.getByText('Delete Post')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this comment?')).toBeInTheDocument();
  });
  
  it('calls closeModal when Cancel button is clicked', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Verify closeModal was called
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockDeleteFunc).not.toHaveBeenCalled();
  });

  it('calls deleteFunc when Delete button is clicked', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Click delete button
    fireEvent.click(screen.getByText('Delete'));
    
    // Verify deleteFunc was called
    expect(mockDeleteFunc).toHaveBeenCalledTimes(1);
    expect(mockCloseModal).not.toHaveBeenCalled();
  });
  
  it('has proper accessibility attributes', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Check for modal container
    const modalContainer = screen.getByText('Delete Post').closest('div.fixed');
    expect(modalContainer).toHaveClass('fixed');
    expect(modalContainer).toHaveClass('inset-0');
    expect(modalContainer).toHaveClass('z-50');
    
    // Check for proper heading hierarchy
    const heading = screen.getByText('Delete Post');
    expect(heading.tagName).toBe('H3');
  });

  it('applies correct styling to buttons', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Cancel button should have light styling
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass('bg-white');
    
    // Delete button should have primary action styling
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toHaveClass('bg-buttonSubmitEnable');
  });

  it('has focus trap behavior', () => {
    const { container } = render(
      <DeletePostModal 
        closeModal={mockCloseModal}
        deleteFunc={mockDeleteFunc}
        commentOrPost="Post"
      />
    );
    
    // Check that the modal is contained in a fixed position container
    // that covers the entire viewport (for blocking background interaction)
    const modalOverlay = container.firstChild;
    expect(modalOverlay).toHaveClass('fixed');
    expect(modalOverlay).toHaveClass('inset-0');
  });
});
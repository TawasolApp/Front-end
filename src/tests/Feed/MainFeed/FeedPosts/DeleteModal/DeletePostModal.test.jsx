import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeletePostModal from '../../../../../pages/Feed/MainFeed/FeedPosts/DeleteModal/DeletePostModal';

// Mock CircularProgress to avoid MUI issues in tests
vi.mock('@mui/material/CircularProgress', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe('DeletePostModal Component', () => {
  const mockCloseModal = vi.fn();
  let mockDeleteFunc;

  beforeEach(() => {
    mockCloseModal.mockReset();
    mockDeleteFunc = vi.fn().mockResolvedValue(undefined);
  });

  it('renders correctly for post deletion', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={mockDeleteFunc} 
        commentOrPost="Post" 
      />
    );
    
    expect(screen.getByText('Delete Post')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this post\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders correctly for comment deletion', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={mockDeleteFunc} 
        commentOrPost="Comment" 
      />
    );
    
    expect(screen.getByText('Delete Comment')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this comment\?/)).toBeInTheDocument();
  });

  it('calls closeModal when Cancel button is clicked', () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={mockDeleteFunc} 
        commentOrPost="Post" 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('shows loading state and calls deleteFunc when Delete button is clicked', async () => {
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={mockDeleteFunc} 
        commentOrPost="Post" 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);
    
    // Should show loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Delete button should be disabled during loading
    expect(deleteButton).toBeDisabled();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockDeleteFunc).toHaveBeenCalledTimes(1);
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  it('handles deletion error gracefully', async () => {
    // Mock console.error to prevent test output noise
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a mock delete function that rejects
    const mockDeleteWithError = vi.fn().mockRejectedValue(new Error('Delete failed'));
    
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={mockDeleteWithError} 
        commentOrPost="Post" 
      />
    );
    
    // Click delete button
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockDeleteWithError).toHaveBeenCalledTimes(1);
      expect(consoleErrorMock).toHaveBeenCalled();
      expect(mockCloseModal).toHaveBeenCalledTimes(1); // Should still close the modal even on error
    });
    
    // Restore console.error
    consoleErrorMock.mockRestore();
  });
  
  it('prevents multiple delete button clicks during loading', async () => {
    // Create a delayed mock delete function
    const delayedDeleteMock = vi.fn().mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    render(
      <DeletePostModal 
        closeModal={mockCloseModal} 
        deleteFunc={delayedDeleteMock} 
        commentOrPost="Post" 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    
    // First click
    fireEvent.click(deleteButton);
    
    // Button should now be disabled
    expect(deleteButton).toBeDisabled();
    
    // Try clicking again (this shouldn't trigger another call)
    fireEvent.click(deleteButton);
    
    // Wait for the operation to complete
    await waitFor(() => {
      expect(delayedDeleteMock).toHaveBeenCalledTimes(1); // Only called once despite multiple clicks
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });
});
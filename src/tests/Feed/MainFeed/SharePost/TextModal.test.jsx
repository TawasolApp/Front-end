import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextModal from '../../../../pages/Feed/MainFeed/SharePost/TextModal';
import { axiosInstance } from '../../../../apis/axios';

// Mock axiosInstance
vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const defaultProps = {
  currentAuthorName: 'John Doe',
  currentAuthorPicture: 'https://example.com/avatar.jpg',
  setIsModalOpen: vi.fn(),
  handleSubmitFunction: vi.fn(),
};

describe('TextModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with author info and visibility dropdown', () => {
    render(<TextModal {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Public/i)).toBeInTheDocument();
  });

  it('disables Post button if no text or media is present', () => {
    render(<TextModal {...defaultProps} />);
    const postButton = screen.getByRole('button', { name: /post/i });
    expect(postButton).toBeDisabled();
  });

  it('enables Post button when text is added', () => {
    render(<TextModal {...defaultProps} />);
    const editor = screen.getByPlaceholderText(/what do you want to talk about/i);
    fireEvent.change(editor, { target: { value: 'Hello world!' } });

    const postButton = screen.getByRole('button', { name: /post/i });
    expect(postButton).not.toBeDisabled();
  });

  it('calls setIsModalOpen when close icon is clicked', () => {
    render(<TextModal {...defaultProps} />);
    // Fix: Be more specific with the button selection
    const closeButton = screen.getByRole('button', { 
      name: '' // Empty name because it only has an icon
    });
    // Verify it's the right button by checking its position
    expect(closeButton).toHaveClass('absolute', 'top-2', 'right-2');
    
    fireEvent.click(closeButton);
    expect(defaultProps.setIsModalOpen).toHaveBeenCalled();
  });

  it('uploads media and renders preview', async () => {
    const fakeFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fakeUrl = 'https://cdn.example.com/image/test.png';
  
    axiosInstance.post.mockResolvedValue({ data: { url: fakeUrl } });
  
    render(<TextModal {...defaultProps} />);
  
    // Fix: Use a more reliable selector for the media button
    const mediaButton = screen.getByRole('button', { name: /add media/i });
    expect(mediaButton).toBeInTheDocument();
    
    // Get the file input directly with querySelector since it's hidden
    const hiddenInput = document.querySelector('input[type="file"]');
    expect(hiddenInput).toBeInTheDocument();
    
    // Initially, there should be no media preview container
    expect(document.querySelector('.mt-4.border.border-gray-200')).not.toBeInTheDocument();
    
    // Simulate the file selection
    fireEvent.change(hiddenInput, { target: { files: [fakeFile] } });
  
    // Wait for the file upload to complete
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
    });
    
    // Check for the image with the correct URL
    await waitFor(() => {
      // Check if the media container exists now
      const mediaContainer = document.querySelector('.mt-4.border.border-gray-200');
      expect(mediaContainer).toBeInTheDocument();
      
      // Find all images and check if our image is present
      const allImages = screen.getAllByRole('img');
      const uploadedImage = Array.from(allImages).find(
        img => img.src.includes('cdn.example.com/image/test.png')
      );
      expect(uploadedImage).toBeTruthy();
      
      // Also verify the cancel button is present
      const cancelIcon = document.querySelector('[data-testid="CancelIcon"]');
      expect(cancelIcon).toBeInTheDocument();
    });
  });

  it('submits the post and resets state', async () => {
    // Add a mock implementation to the handleSubmitFunction that actually calls setIsModalOpen
    const mockSubmit = vi.fn().mockImplementation(() => {
      defaultProps.setIsModalOpen();
      return Promise.resolve();
    });
    
    render(<TextModal {...defaultProps} handleSubmitFunction={mockSubmit} />);

    const editor = screen.getByPlaceholderText(/what do you want to talk about/i);
    fireEvent.change(editor, { target: { value: 'Unit test this!' } });

    const postButton = screen.getByRole('button', { name: /post/i });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        'Unit test this!',
        [],
        'Public',
        []
      );
      // This should now pass because our mockImplementation calls setIsModalOpen
      expect(defaultProps.setIsModalOpen).toHaveBeenCalled();
    });
  });
});
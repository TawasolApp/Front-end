import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SharePost from '../../../../pages/Feed/MainFeed/SharePost/SharePost';

// Mock dependencies
vi.mock('@mui/material/Avatar', () => ({
  default: ({ sx, className, src }) => (
    <div 
      data-testid="avatar" 
      className={className}
      style={sx}
      data-src={src}
    >
      Mock Avatar
    </div>
  )
}));

vi.mock('../../../../pages/Feed/MainFeed/SharePost/TextModal', () => ({
  default: ({ 
    currentAuthorName, 
    currentAuthorPicture, 
    setIsModalOpen, 
    handleSubmitFunction 
  }) => (
    <div data-testid="text-modal">
      <span data-testid="modal-author-name">{currentAuthorName}</span>
      <img data-testid="modal-author-picture" src={currentAuthorPicture} alt="Profile" />
      <button data-testid="modal-close" onClick={setIsModalOpen}>Close</button>
      <button 
        data-testid="modal-submit" 
        onClick={() => handleSubmitFunction('Test post', [], 'public', [])}
      >
        Share
      </button>
    </div>
  )
}));

describe('SharePost', () => {
  const mockProps = {
    handleSharePost: vi.fn(),
    currentAuthorName: 'John Doe',
    currentAuthorPicture: 'profile-pic.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct structure and user info', () => {
    render(<SharePost {...mockProps} />);

    // Check that the main container has correct classes
    const mainContainer = screen.getByRole('button').parentElement.parentElement;
    expect(mainContainer).toHaveClass('bg-cardBackground', 'border', 'border-cardBorder');
    
    // Check that the avatar is rendered with the correct props
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
    expect(avatar.dataset.src).toBe('profile-pic.jpg');
    
    // Check that the "Start a post" button is rendered
    const startPostButton = screen.getByRole('button');
    expect(startPostButton).toBeInTheDocument();
    expect(startPostButton).toHaveTextContent('Start a post');
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('text-modal')).not.toBeInTheDocument();
  });

  it('opens modal when clicking the "Start a post" button', () => {
    render(<SharePost {...mockProps} />);
    
    // Click the "Start a post" button
    fireEvent.click(screen.getByRole('button'));
    
    // Modal should now be visible
    expect(screen.getByTestId('text-modal')).toBeInTheDocument();
    
    // Check that the correct props are passed to the modal
    expect(screen.getByTestId('modal-author-name').textContent).toBe('John Doe');
    expect(screen.getByTestId('modal-author-picture').getAttribute('src')).toBe('profile-pic.jpg');
  });

  it('closes modal when close button is clicked', () => {
    render(<SharePost {...mockProps} />);
    
    // Open the modal
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('text-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByTestId('modal-close'));
    
    // Modal should be closed
    expect(screen.queryByTestId('text-modal')).not.toBeInTheDocument();
  });

  it('calls handleSharePost when submitting the post', () => {
    render(<SharePost {...mockProps} />);
    
    // Open the modal
    fireEvent.click(screen.getByRole('button'));
    
    // Submit the post
    fireEvent.click(screen.getByTestId('modal-submit'));
    
    // Check that handleSharePost was called with correct arguments
    expect(mockProps.handleSharePost).toHaveBeenCalledTimes(1);
    expect(mockProps.handleSharePost).toHaveBeenCalledWith(
      'Test post', [], 'public', []
    );
    
    // Modal should be closed after submission (handled by TextModal in real usage)
    // We're checking that the function is passed correctly, not the actual closing behavior
    expect(screen.getByTestId('text-modal')).toBeInTheDocument();
  });

  it('renders with responsive design classes', () => {
    render(<SharePost {...mockProps} />);
    
    const container = screen.getByRole('button').parentElement.parentElement;
    expect(container).toHaveClass('rounded-none', 'sm:rounded-lg');
    
    const postButton = screen.getByRole('button');
    expect(postButton).toHaveClass('flex-1', 'rounded-full');
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SharePost from '../pages/Feed/MainFeed/SharePost/SharePost';

// Mock the Material-UI Avatar component
vi.mock('@mui/material/Avatar', () => ({
  default: ({ src, sx, className }) => (
    <div 
      data-testid="mock-avatar" 
      className={className}
      style={sx}
    >
      <img src={src} alt="avatar" />
    </div>
  )
}));

// Mock the TextModal component
vi.mock('../pages/Feed/MainFeed/SharePost/TextModal', () => ({
  default: ({ currentAuthorName, currentAuthorPicture, setIsModalOpen, sharePost }) => (
    <div data-testid="mock-text-modal">
      <h2>Create Post as {currentAuthorName}</h2>
      <img src={currentAuthorPicture} alt="profile" />
      <button 
        data-testid="close-modal-btn" 
        onClick={() => setIsModalOpen()}
      >
        Close
      </button>
      <button 
        data-testid="share-btn" 
        onClick={() => {
          sharePost('Test post content', 'Anyone');
          setIsModalOpen();
        }}
      >
        Share Post
      </button>
    </div>
  )
}));

describe('SharePost Component', () => {
  const mockSharePost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders correctly with avatar and start post button', () => {
    render(<SharePost sharePost={mockSharePost} />);
    
    // Check avatar is displayed
    const avatar = screen.getByTestId('mock-avatar');
    expect(avatar).toBeInTheDocument();
    
    // Check avatar has expected classes
    expect(avatar).toHaveClass('rounded-full');
    
    // Check "Start a post" button is displayed
    const postButton = screen.getByText('Start a post');
    expect(postButton).toBeInTheDocument();
    
    // Modal should not be visible initially
    const modal = screen.queryByTestId('mock-text-modal');
    expect(modal).not.toBeInTheDocument();
  });
  
  it('opens text modal when clicking the start post button', () => {
    render(<SharePost sharePost={mockSharePost} />);
    
    // Click the "Start a post" button
    const postButton = screen.getByText('Start a post');
    fireEvent.click(postButton);
    
    // Modal should now be visible
    const modal = screen.getByTestId('mock-text-modal');
    expect(modal).toBeInTheDocument();
    
    // Check modal has author details
    expect(screen.getByText('Create Post as Mohamed Sobh')).toBeInTheDocument();
  });
  
  it('closes modal when clicking close button', () => {
    render(<SharePost sharePost={mockSharePost} />);
    
    // Open the modal first
    const postButton = screen.getByText('Start a post');
    fireEvent.click(postButton);
    
    // Verify modal is open
    expect(screen.getByTestId('mock-text-modal')).toBeInTheDocument();
    
    // Click the close button
    const closeButton = screen.getByTestId('close-modal-btn');
    fireEvent.click(closeButton);
    
    // Modal should now be closed
    expect(screen.queryByTestId('mock-text-modal')).not.toBeInTheDocument();
  });
  
  it('calls sharePost function when sharing from the modal', () => {
    render(<SharePost sharePost={mockSharePost} />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Start a post'));
    
    // Click the share button in the modal
    fireEvent.click(screen.getByTestId('share-btn'));
    
    // Check that sharePost was called with correct arguments
    expect(mockSharePost).toHaveBeenCalledTimes(1);
    expect(mockSharePost).toHaveBeenCalledWith('Test post content', 'Anyone');
    
    // Modal should be closed after sharing
    expect(screen.queryByTestId('mock-text-modal')).not.toBeInTheDocument();
  });
  
  it('renders with the correct CSS classes on the container', () => {
    const { container } = render(<SharePost sharePost={mockSharePost} />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('bg-cardBackground');
    expect(mainContainer).toHaveClass('border');
    expect(mainContainer).toHaveClass('border-cardBorder');
    expect(mainContainer).toHaveClass('rounded-none');
    expect(mainContainer).toHaveClass('sm:rounded-lg');
    expect(mainContainer).toHaveClass('p-4');
    expect(mainContainer).toHaveClass('pb-2');
    expect(mainContainer).toHaveClass('mb-4');
  });
  
  it('renders the button with the correct CSS classes', () => {
    render(<SharePost sharePost={mockSharePost} />);
    
    const button = screen.getByText('Start a post').closest('button');
    expect(button).toHaveClass('flex-1');
    expect(button).toHaveClass('pl-4');
    expect(button).toHaveClass('pr-2');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('my-1');
    expect(button).toHaveClass('bg-cardBackground');
    expect(button).toHaveClass('hover:bg-cardBackgroundHover');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-itemBorder');
    expect(button).toHaveClass('text-left');
  });
});
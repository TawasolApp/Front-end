import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaDisplay from '../../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/MediaDisplay';
import { usePost } from '../../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext';

// Mock dependencies
vi.mock('../../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext', () => ({
  usePost: vi.fn()
}));

// Mock the MediaItem component
vi.mock('../../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/MediaItem', () => ({
  default: ({ url, disabled }) => (
    <div data-testid="media-item" data-url={url} data-disabled={disabled ? 'true' : 'false'}>
      Media Item
    </div>
  )
}));

describe('MediaDisplay Component', () => {
  const mockHandleOpenPostModal = vi.fn();
  
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    mockHandleOpenPostModal.mockClear();
  });
  
  it('returns null when no media is present', () => {
    usePost.mockReturnValue({ post: { media: [] } });
    
    const { container } = render(
      <MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />
    );
    
    expect(container).toBeEmptyDOMElement();
  });
  
  it('renders a single image correctly', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    // Check correct grid classes for single item
    const gridContainer = screen.getByRole('button').parentElement.parentElement;
    expect(gridContainer.className).toContain('grid-cols-1');
    expect(gridContainer.className).toContain('h-96');
    
    // Check media item
    const mediaItem = screen.getByTestId('media-item');
    expect(mediaItem).toBeInTheDocument();
    expect(mediaItem).toHaveAttribute('data-url', 'image1.jpg');
    expect(mediaItem).toHaveAttribute('data-disabled', 'false');
  });
  
  it('renders multiple images with correct grid layout', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg', 'image2.jpg', 'image3.jpg'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    // Check correct grid classes for 3 items
    const gridContainer = screen.getAllByRole('button')[0].parentElement.parentElement;
    expect(gridContainer.className).toContain('grid-cols-2');
    expect(gridContainer.className).toContain('grid-rows-2');
    expect(gridContainer.className).toContain('h-96');
    
    // Check that we have 3 media items
    const mediaItems = screen.getAllByTestId('media-item');
    expect(mediaItems).toHaveLength(3);
    
    // First item should span 2 rows in a 3-item grid
    const firstItemContainer = mediaItems[0].parentElement.parentElement;
    expect(firstItemContainer.className).toContain('row-span-2');
  });
  
  it('shows the +X overlay for remaining images', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    // Should display the "+2" overlay on the 4th item
    const remainingText = screen.getByText('+2');
    expect(remainingText).toBeInTheDocument();
    expect(remainingText.parentElement.className).toContain('bg-black/60');
  });
  
  it('handles PDF documents without making them clickable for modal', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['document.pdf'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    // No buttons should be rendered for PDFs
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    
    // Media item should still be rendered
    const mediaItem = screen.getByTestId('media-item');
    expect(mediaItem).toBeInTheDocument();
    expect(mediaItem).toHaveAttribute('data-url', 'document.pdf');
  });
  
  it('handles single video without opening the modal', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['video.mp4'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // handleOpenPostModal should not be called for single videos
    expect(mockHandleOpenPostModal).not.toHaveBeenCalled();
  });
  
  it('disables videos in multi-media posts', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg', 'video.mp4'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    const mediaItems = screen.getAllByTestId('media-item');
    
    // First item (image) should not be disabled
    expect(mediaItems[0]).toHaveAttribute('data-disabled', 'false');
    
    // Second item (video) should be disabled
    expect(mediaItems[1]).toHaveAttribute('data-disabled', 'true');
  });
  
  it('opens modal with correct index when image is clicked', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg', 'image2.jpg'] 
      } 
    });
    
    render(<MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Click second image
    fireEvent.click(buttons[1]);
    
    // Should call handleOpenPostModal with index 1
    expect(mockHandleOpenPostModal).toHaveBeenCalledWith(1);
  });
  
  it('uses reposted media when reposted prop is true', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['original1.jpg', 'original2.jpg'],
        repostedComponents: {
          media: ['reposted1.jpg', 'reposted2.jpg']
        }
      } 
    });
    
    render(
      <MediaDisplay 
        handleOpenPostModal={mockHandleOpenPostModal} 
        reposted={true} 
      />
    );
    
    const mediaItems = screen.getAllByTestId('media-item');
    
    // Should use reposted media
    expect(mediaItems[0]).toHaveAttribute('data-url', 'reposted1.jpg');
    expect(mediaItems[1]).toHaveAttribute('data-url', 'reposted2.jpg');
  });
  
  it('handles missing media gracefully', () => {
    usePost.mockReturnValue({ 
      post: { } // No media property
    });
    
    const { container } = render(
      <MediaDisplay handleOpenPostModal={mockHandleOpenPostModal} />
    );
    
    expect(container).toBeEmptyDOMElement();
  });
  
  it('handles missing handleOpenPostModal gracefully', () => {
    usePost.mockReturnValue({ 
      post: { 
        media: ['image1.jpg'] 
      } 
    });
    
    // Should not throw when handleOpenPostModal is not provided
    expect(() => {
      render(<MediaDisplay />);
    }).not.toThrow();
    
    // Click should not throw error
    const button = screen.getByRole('button');
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });
});
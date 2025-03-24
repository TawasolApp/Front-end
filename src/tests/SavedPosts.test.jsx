import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavedPosts from '../pages/SavedPosts/SavedPosts';

// Mock dependencies
vi.mock('../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/PostCard', () => ({
  default: ({ post, deletePost }) => (
    <div data-testid={`post-${post.id}`} className="post-card-mock">
      <h3>{post.content}</h3>
      <button 
        data-testid={`delete-btn-${post.id}`}
        onClick={() => deletePost(post.id)}
      >
        Delete Post
      </button>
    </div>
  )
}));

// Import the mocked dependencies
import { axiosInstance } from '../apis/axios';

describe('SavedPosts Component', () => {
  const mockSavedPosts = [
    {
      id: 'saved1',
      authorId: 'user1',
      authorName: 'Test User',
      content: 'First saved post',
      reactions: { like: 5 },
      comments: 2,
      timestamp: '2025-03-24T10:00:00Z'
    },
    {
      id: 'saved2',
      authorId: 'user2',
      authorName: 'Another User',
      content: 'Second saved post',
      reactions: { like: 3 },
      comments: 1,
      timestamp: '2025-03-24T09:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock default fetch saved posts response
    axiosInstance.get.mockResolvedValue({ data: mockSavedPosts });
  });

  it('renders saved posts after fetching them', async () => {
    render(<SavedPosts />);
    
    // Initial state should trigger API call
    expect(axiosInstance.get).toHaveBeenCalledWith('/posts/saved');
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-saved1')).toBeInTheDocument();
      expect(screen.getByTestId('post-saved2')).toBeInTheDocument();
    });
    
    // Verify post content is displayed
    expect(screen.getByText('First saved post')).toBeInTheDocument();
    expect(screen.getByText('Second saved post')).toBeInTheDocument();
  });

  it('handles empty saved posts list', async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValueOnce({ data: [] });
    
    const { container } = render(<SavedPosts />);
    
    // Should call API
    expect(axiosInstance.get).toHaveBeenCalledWith('/posts/saved');
    
    // Wait for component to process empty response
    await waitFor(() => {
      // Container should be empty (no posts)
      expect(container.firstChild).toBeNull();
    });
  });

  it('handles API error when fetching saved posts', async () => {
    console.log = vi.fn(); // Mock console.log
    
    // Mock API error
    axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch saved posts'));
    
    render(<SavedPosts />);
    
    // Should log the error
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Failed to fetch saved posts');
    });
  });

  it('deletes a post successfully', async () => {
    // Mock successful delete
    axiosInstance.delete.mockResolvedValueOnce({});
    
    render(<SavedPosts />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-saved1')).toBeInTheDocument();
    });
    
    // Click delete button on first post
    fireEvent.click(screen.getByTestId('delete-btn-saved1'));
    
    // Check API was called with correct ID
    expect(axiosInstance.delete).toHaveBeenCalledWith('/delete/saved1');
    
    // Check post is removed from the DOM
    await waitFor(() => {
      expect(screen.queryByTestId('post-saved1')).not.toBeInTheDocument();
    });
    
    // But second post should still be there
    expect(screen.getByTestId('post-saved2')).toBeInTheDocument();
  });

  it('handles error when deleting a post', async () => {
    console.log = vi.fn(); // Mock console.log
    
    // Mock delete error
    axiosInstance.delete.mockRejectedValueOnce(new Error('Failed to delete post'));
    
    render(<SavedPosts />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-saved1')).toBeInTheDocument();
    });
    
    // Click delete button on first post
    fireEvent.click(screen.getByTestId('delete-btn-saved1'));
    
    // Check error is logged
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Failed to delete post');
    });
    
    // Post should still be in the DOM (not deleted)
    expect(screen.getByTestId('post-saved1')).toBeInTheDocument();
  }); 
});
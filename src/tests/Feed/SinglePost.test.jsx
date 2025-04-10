import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SinglePost from '../../pages/Feed/SinglePost';
import { axiosInstance } from '../../apis/axios';

// Mock navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom before other imports
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock axios
vi.mock('../../apis/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn()
  }
}));

// Mock PostContainer component
vi.mock('../../pages/Feed/MainFeed/FeedPosts/PostContainer', () => ({
  default: ({ post, handleSharePost, handleDeletePost }) => (
    <div data-testid="post-container">
      <h2 data-testid="post-title">{post.title || 'Post Title'}</h2>
      <p data-testid="post-content">{post.content || 'Post content'}</p>
      <button 
        data-testid="delete-post-btn" 
        onClick={handleDeletePost}
      >
        Delete Post
      </button>
      <button 
        data-testid="share-post-btn" 
        onClick={() => handleSharePost('Shared content', null, 'public', [], post.id, false)}
      >
        Share Post
      </button>
    </div>
  )
}));

describe('SinglePost Component', () => {
  // Setup function to render the component with mocked router
  const renderWithRouter = (postId = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/posts/${postId}`]}>
        <Routes>
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/feed" element={<div>Feed Page</div>} />
          <Route path="/error-404" element={<div>Error 404 Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should fetch and display a post successfully', async () => {
    // Mock successful API response
    const mockPost = {
      id: '123',
      title: 'Test Post',
      content: 'This is a test post content',
      author: 'User 1'
    };
    
    axiosInstance.get.mockResolvedValueOnce({ data: mockPost });
    
    renderWithRouter();
    
    // Check that the post is displayed after fetching
    await waitFor(() => {
      expect(screen.getByTestId('post-container')).toBeInTheDocument();
      expect(screen.getByTestId('post-title')).toHaveTextContent('Test Post');
      expect(screen.getByTestId('post-content')).toHaveTextContent('This is a test post content');
    });
    
    // Verify API was called with correct parameters
    expect(axiosInstance.get).toHaveBeenCalledWith('posts/123');
  });
  
  it('should navigate to 404 page when post is not found', async () => {
    // Mock failed API response
    axiosInstance.get.mockRejectedValueOnce(new Error('Post not found'));
    
    renderWithRouter();
    
    // Check that navigation to error page happens
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error-404');
    });
  });
  
  it('should handle post deletion correctly', async () => {
    // Mock successful API responses
    const mockPost = { id: '123', title: 'Test Post' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockPost });
    axiosInstance.delete.mockResolvedValueOnce({});
    
    renderWithRouter();
    
    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByTestId('post-container')).toBeInTheDocument();
    });
    
    // Delete the post
    const deleteButton = screen.getByTestId('delete-post-btn');
    await userEvent.click(deleteButton);
    
    // Check that deletion API was called and navigation happened
    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/delete/123');
      expect(mockNavigate).toHaveBeenCalledWith('/feed');
    });
  });
  
  it('should handle post sharing correctly', async () => {
    // Mock successful API responses
    const mockPost = { id: '123', title: 'Test Post' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockPost });
    axiosInstance.post.mockResolvedValueOnce({});
    
    renderWithRouter();
    
    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByTestId('post-container')).toBeInTheDocument();
    });
    
    // Share the post
    const shareButton = screen.getByTestId('share-post-btn');
    await userEvent.click(shareButton);
    
    // Check that share API was called with correct parameters
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('posts', {
        content: 'Shared content',
        media: null,
        taggedUsers: [],
        visibility: 'public',
        parentPostId: '123',
        isSilentRepost: false
      });
      expect(mockNavigate).toHaveBeenCalledWith('/feed');
    });
  });
  
  it('should handle API errors during post operations', async () => {
    // Mock responses
    const mockPost = { id: '123', title: 'Test Post' };
    axiosInstance.get.mockResolvedValueOnce({ data: mockPost });
    
    // Mock console.log to check error logging
    const originalConsoleLog = console.log;
    console.log = vi.fn();
    
    renderWithRouter();
    
    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByTestId('post-container')).toBeInTheDocument();
    });
    
    // Test delete with error
    axiosInstance.delete.mockRejectedValueOnce(new Error('Delete failed'));
    await userEvent.click(screen.getByTestId('delete-post-btn'));
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Delete failed');
    });
    
    // Test share with error
    axiosInstance.post.mockRejectedValueOnce(new Error('Share failed'));
    await userEvent.click(screen.getByTestId('share-post-btn'));
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Share failed');
    });
    
    // Restore original console.log
    console.log = originalConsoleLog;
  });
  
  it('should not fetch post when id is not provided', () => {
    // Render without providing an ID in the URL
    render(
      <MemoryRouter initialEntries={['/posts/']}>
        <Routes>
          <Route path="/posts/" element={<SinglePost />} />
        </Routes>
      </MemoryRouter>
    );
    
    // API should not be called
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });
});
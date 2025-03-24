import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock modules before importing the component
vi.mock('../apis/axios', () => {
  return {
    axiosInstance: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    }
  };
});

// Import the mocked module
import { axiosInstance } from '../apis/axios';
import CommentsContainer from '../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/CommentsContainer';

// Mock other dependencies
vi.mock('@mui/material', () => ({
  CircularProgress: ({ size }) => <div data-testid="circular-progress" data-size={size}>Loading...</div>
}));

vi.mock('@mui/icons-material/OpenInFull', () => ({
  default: () => <div data-testid="open-in-full-icon">OpenInFullIcon</div>
}));

// Mock child components
vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/AddForm', () => ({
  default: ({ handleAddFunction, type }) => (
    <div data-testid="add-form" data-type={type}>
      <button 
        data-testid="submit-comment" 
        onClick={() => handleAddFunction('New comment')}
      >
        Add Comment
      </button>
    </div>
  )
}));

vi.mock('../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/Comment', () => ({
  default: ({ comment, handleDeleteComment }) => (
    <div data-testid="comment" data-id={comment.id}>
      <div data-testid="comment-content">{comment.content}</div>
      <button 
        data-testid={`delete-comment-${comment.id}`}
        onClick={() => handleDeleteComment(comment.id)}
      >
        Delete
      </button>
    </div>
  )
}));

describe('CommentsContainer Component', () => {
  const mockIncrementCommentsNumber = vi.fn();
  const mockPostId = '123';
  const mockCommentsCount = 5;
  
  // Mock comment data
  const mockComments = [
    {
      id: 'comment1',
      content: 'First comment',
      authorId: 'user1',
      authorName: 'User One',
      timestamp: '2023-01-01T12:00:00Z',
      reactions: { like: 2, celebrate: 1 },
      replies: []
    },
    {
      id: 'comment2',
      content: 'Second comment',
      authorId: 'user2',
      authorName: 'User Two',
      timestamp: '2023-01-02T12:00:00Z',
      reactions: { like: 1 },
      replies: []
    }
  ];
  
  // New comment data
  const mockNewComment = {
    id: 'newcomment',
    content: 'New comment',
    authorId: 'mohsobh',
    authorName: 'Mohamed Sobh',
    timestamp: '2023-01-03T12:00:00Z',
    reactions: {},
    replies: []
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up default mock responses using the imported mock
    axiosInstance.get.mockResolvedValue({
      data: mockComments
    });
    
    axiosInstance.post.mockResolvedValue({
      data: mockNewComment
    });
    
    axiosInstance.delete.mockResolvedValue({});
  });
  
  it('fetches comments on mount', async () => {
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={mockCommentsCount}
      />
    );
    
    // Check if loading indicator is shown initially
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    
    // Check if axios get was called with correct params
    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/posts/comments/${mockPostId}`,
      expect.objectContaining({
        params: expect.objectContaining({ 
          page: 1,
          limit: 2
        })
      })
    );
    
    // Wait for comments to load
    await waitFor(() => {
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });
    
    // Check if comments are rendered
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
    
    // Check if "Load more" button is shown
    expect(screen.getByText('Load more comments')).toBeInTheDocument();
  });
  
  it('handles error state when fetching comments fails', async () => {
    // Setup axios to return an error
    axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch comments'));
    
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={mockCommentsCount}
      />
    );
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch comments')).toBeInTheDocument();
    });
    
    // Loading indicator should be gone
    expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    
    // No comments should be shown
    expect(screen.queryByTestId('comment')).not.toBeInTheDocument();
  });
  
  it('adds a new comment successfully', async () => {
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={mockCommentsCount}
      />
    );
    
    // Wait for comments to load
    await waitFor(() => {
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });
    
    // Click the add comment button
    fireEvent.click(screen.getByTestId('submit-comment'));
    
    // Check if axios post was called with correct data
    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/comment/${mockPostId}`,
      {
        content: 'New comment',
        taggedUsers: []
      }
    );
    
    // Wait for the incrementCommentsNumber to be called - this is asynchronous
    await waitFor(() => {
      expect(mockIncrementCommentsNumber).toHaveBeenCalledWith('inc');
    });
    
    // Wait for the new comment to be added
    await waitFor(() => {
      // The new comment should be at the top of the list
      const comments = screen.getAllByTestId('comment');
      expect(comments.length).toBe(3);
      expect(comments[0]).toHaveAttribute('data-id', 'newcomment');
    });
  });
  
  it('deletes a comment successfully', async () => {
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={mockCommentsCount}
      />
    );
    
    // Wait for comments to load
    await waitFor(() => {
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });
    
    // Initially, 2 comments should be visible
    expect(screen.getAllByTestId('comment')).toHaveLength(2);
    
    // Click delete on the first comment
    fireEvent.click(screen.getByTestId('delete-comment-comment1'));
    
    // Check if axios delete was called correctly
    expect(axiosInstance.delete).toHaveBeenCalledWith('/posts/comments/comment1');
    
    // Check if incrementCommentsNumber was called
    expect(mockIncrementCommentsNumber).toHaveBeenCalledWith('dec');
    
    // The first comment should be removed
    await waitFor(() => {
      expect(screen.queryByTestId('delete-comment-comment1')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('comment')).toHaveLength(1);
    });
  });
  
  it('loads more comments when "Load more" is clicked', async () => {
    // Set up sequential responses
    const moreComments = [
      {
        id: 'comment3',
        content: 'Third comment',
        authorId: 'user3',
        authorName: 'User Three',
        timestamp: '2023-01-03T12:00:00Z',
        reactions: {},
        replies: []
      },
      {
        id: 'comment4',
        content: 'Fourth comment',
        authorId: 'user4',
        authorName: 'User Four',
        timestamp: '2023-01-04T12:00:00Z',
        reactions: {},
        replies: []
      }
    ];
    
    // First call returns mockComments, second call returns moreComments
    axiosInstance.get
      .mockResolvedValueOnce({ data: mockComments })
      .mockResolvedValueOnce({ data: moreComments });
    
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={5} // Total of 5 comments
      />
    );
    
    // Wait for initial comments to load
    await waitFor(() => {
      expect(screen.getAllByTestId('comment')).toHaveLength(2);
    });
    
    // Click the "Load more" button
    fireEvent.click(screen.getByText('Load more comments'));
    
    // Check if loading indicator appears
    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    
    // Check if axios get was called with page=2
    expect(axiosInstance.get).toHaveBeenLastCalledWith(
      `/posts/comments/${mockPostId}`,
      expect.objectContaining({
        params: expect.objectContaining({ 
          page: 2,
          limit: 2
        })
      })
    );
    
    // Wait for more comments to load
    await waitFor(() => {
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });
    
    // Now all 4 comments should be visible
    expect(screen.getAllByTestId('comment')).toHaveLength(4);
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
    expect(screen.getByText('Third comment')).toBeInTheDocument();
    expect(screen.getByText('Fourth comment')).toBeInTheDocument();
    
    // "Load more" button should still be visible since commentsCount is 5
    expect(screen.getByText('Load more comments')).toBeInTheDocument();
  });
  
  it('hides "Load more" button when no more comments to load', async () => {
    // Make hasMore false by setting commentsCount equal to returned comments length
    render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={2} // Only 2 comments in total
      />
    );
    
    // Wait for comments to load
    await waitFor(() => {
      expect(screen.getAllByTestId('comment')).toHaveLength(2);
    });
    
    // "Load more" button should not be visible
    expect(screen.queryByText('Load more comments')).not.toBeInTheDocument();
  });
  
  it('handles AbortController correctly on component unmount', async () => {
    const abortMock = vi.fn();
    global.AbortController = vi.fn(() => ({
      signal: {},
      abort: abortMock
    }));
    
    const { unmount } = render(
      <CommentsContainer 
        postId={mockPostId}
        incrementCommentsNumber={mockIncrementCommentsNumber}
        commentsCount={mockCommentsCount}
      />
    );
    
    // Unmount component
    unmount();
    
    // Check if abort was called
    expect(abortMock).toHaveBeenCalled();
  });
});
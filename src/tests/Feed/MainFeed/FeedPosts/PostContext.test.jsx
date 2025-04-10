import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { PostProvider, usePost } from '../../../../pages/Feed/MainFeed/FeedPosts/PostContext';
import { axiosInstance } from '../../../../apis/axios';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('../../../../apis/axios', () => ({
  axiosInstance: {
    patch: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

// Test component to access context
function TestComponent({ testFunction }) {
  const context = usePost();
  testFunction(context);
  return null;
}

describe('PostContext', () => {
  const mockPost = {
    id: 'post123',
    content: 'Test post content',
    comments: 5,
    reactCounts: { like: 10, celebrate: 5 },
    reactType: 'like',
    isSaved: false,
    media: [],
    taggedUsers: [],
    visibility: 'public'
  };

  const mockProps = {
    initialPost: mockPost,
    handleSharePost: vi.fn(),
    handleDeletePost: vi.fn(),
    currentAuthorId: 'user123',
    currentAuthorName: 'Test User',
    currentAuthorPicture: 'profile.jpg',
    isAdmin: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides the correct initial context values', () => {
    const testFn = vi.fn();
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    expect(testFn).toHaveBeenCalledTimes(1);
    
    const contextValue = testFn.mock.calls[0][0];
    expect(contextValue).toMatchObject({
      post: mockPost,
      comments: [],
      replies: {},
      hasMoreComments: true,
      currentAuthorId: 'user123',
      currentAuthorName: 'Test User',
      currentAuthorPicture: 'profile.jpg',
      isAdmin: false
    });
    
    // Verify all required methods are present
    expect(typeof contextValue.handleEditPost).toBe('function');
    expect(typeof contextValue.handleSavePost).toBe('function');
    expect(typeof contextValue.handleReactOnPost).toBe('function');
    expect(typeof contextValue.handleCopyPost).toBe('function');
    expect(typeof contextValue.fetchComments).toBe('function');
    expect(typeof contextValue.handleAddComment).toBe('function');
  });

  it('updates post state when initialPost prop changes', async () => {
    const testFn = vi.fn();
    const { rerender } = render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    // Clear the mock call history after initial render
    testFn.mockClear();
    
    const updatedPost = { ...mockPost, content: 'Updated content' };
    
    rerender(
      <PostProvider {...mockProps} initialPost={updatedPost}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    // Now we only expect one call after rerender
    expect(testFn).toHaveBeenCalled();
    
    // Get the most recent call and check the post value
    const mostRecentCall = testFn.mock.calls[testFn.mock.calls.length - 1];
    expect(mostRecentCall[0].post).toEqual(updatedPost);
  });
  
  it('handles editing a post correctly', async () => {
    const testFn = vi.fn();
    axiosInstance.patch.mockResolvedValueOnce({});
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleEditPost('Updated text', ['image.jpg'], 'connections', ['user1']);
    });
    
    expect(axiosInstance.patch).toHaveBeenCalledWith(`/posts/${mockPost.id}`, {
      content: 'Updated text',
      media: ['image.jpg'],
      taggedUsers: ['user1'],
      visibility: 'connections'
    });
    
    // The context should be updated with the new values
    expect(testFn.mock.calls[1][0].post).toMatchObject({
      content: 'Updated text',
      media: ['image.jpg'],
      taggedUsers: ['user1'],
      visibility: 'connections',
      isEdited: true
    });
  });
  
  it('handles saving a post correctly', async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleSavePost();
    });
    
    expect(axiosInstance.post).toHaveBeenCalledWith(`posts/save/${mockPost.id}`);
    expect(testFn.mock.calls[1][0].post.isSaved).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('Post saved', expect.any(Object));
  });
  
  it('handles unsaving a post correctly', async () => {
    const testFn = vi.fn();
    axiosInstance.delete.mockResolvedValueOnce({});
    
    const savedPost = { ...mockPost, isSaved: true };
    render(
      <PostProvider {...mockProps} initialPost={savedPost}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleSavePost();
    });
    
    expect(axiosInstance.delete).toHaveBeenCalledWith(`posts/save/${mockPost.id}`);
    expect(testFn.mock.calls[1][0].post.isSaved).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Post unsaved.', expect.any(Object));
  });
  
  it('handles reactions on a post correctly', async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleReactOnPost('celebrate', 'like');
    });
    
    expect(axiosInstance.post).toHaveBeenCalledWith(`posts/react/${mockPost.id}`, {
      reactions: { celebrate: 1, like: 0 },
      postType: "Post"
    });
    
    // Check that reactCounts are updated correctly
    expect(testFn.mock.calls[1][0].post.reactCounts).toEqual({
      like: 9,  // Decreased by 1
      celebrate: 6 // Increased by 1
    });
    
    // Check that reactType is set to the new reaction
    expect(testFn.mock.calls[1][0].post.reactType).toBe('celebrate');
  });
  
  it('copies post link to clipboard', async () => {
    const testFn = vi.fn();
    const originalLocation = window.location;
    
    // Mock window.location
    delete window.location;
    window.location = {
      origin: 'https://example.com'
    };
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleCopyPost();
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `https://example.com/feed/${mockPost.id}`
    );
    expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard.', expect.any(Object));
    
    // Restore window.location
    window.location = originalLocation;
  });
  
  it('fetches comments correctly', async () => {
    const testFn = vi.fn();
    const mockComments = [
      { id: 'comment1', content: 'First comment' },
      { id: 'comment2', content: 'Second comment' }
    ];
    
    axiosInstance.get.mockResolvedValueOnce({ data: mockComments });
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.fetchComments();
    });
    
    expect(axiosInstance.get).toHaveBeenCalledWith(`/posts/comments/${mockPost.id}`, expect.any(Object));
    expect(testFn.mock.calls[1][0].comments).toEqual(mockComments);
  });
  
  it('adds a comment correctly', async () => {
    const testFn = vi.fn();
    const newComment = { 
      id: 'newcomment', 
      content: 'New comment',
      authorName: 'Test User' 
    };
    
    axiosInstance.post.mockResolvedValueOnce({ data: newComment });
    
    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>
    );
    
    const contextValue = testFn.mock.calls[0][0];
    
    await act(async () => {
      await contextValue.handleAddComment('New comment', ['user1']);
    });
    
    expect(axiosInstance.post).toHaveBeenCalledWith(`/posts/comment/${mockPost.id}`, {
      content: 'New comment',
      taggedUsers: ['user1'],
      isReply: false
    });
    
    // New comment should be at the beginning of the comments array
    expect(testFn.mock.calls[1][0].comments[0]).toEqual(newComment);
    
    // Post comment count should increase
    expect(testFn.mock.calls[1][0].post.comments).toBe(6);
  });
  
  it('throws an error when used outside of PostProvider', () => {
    const consoleError = console.error;
    console.error = vi.fn(); // Suppress React error logs
    
    const TestWithoutProvider = () => {
      usePost();
      return null;
    };
    
    expect(() => render(<TestWithoutProvider />)).toThrow('usePost must be used within a PostProvider');
    
    console.error = consoleError; // Restore console.error
  });
});
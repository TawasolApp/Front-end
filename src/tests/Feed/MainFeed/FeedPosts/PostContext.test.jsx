import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react"; // Added waitFor import
import {
  PostProvider,
  usePost,
} from "../../../../pages/Feed/MainFeed/FeedPosts/PostContext";
import { axiosInstance } from "../../../../apis/axios";
import { toast } from "react-toastify";

// Mock dependencies
vi.mock("../../../../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock AbortController
global.AbortController = class {
  signal = "mock-signal";
  abort = vi.fn();
};

// Helper for mock response creation
const createMockResponse = (data) => ({ data });

// Test component to access context
function TestComponent({ testFunction }) {
  const context = usePost();
  testFunction(context);
  return null;
}

describe("PostContext", () => {
  const mockPost = {
    id: "post123",
    content: "Test post content",
    comments: 5,
    reactCounts: { like: 10, celebrate: 5 },
    reactType: "like",
    isSaved: false,
    media: [],
    taggedUsers: [],
    visibility: "public",
  };

  const mockProps = {
    initialPost: mockPost,
    handleSharePost: vi.fn(),
    handleDeletePost: vi.fn(),
    currentAuthorId: "user123",
    currentAuthorName: "Test User",
    currentAuthorPicture: "profile.jpg",
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Basic context functionality tests
  it("provides the correct initial context values", () => {
    const testFn = vi.fn();

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    expect(testFn).toHaveBeenCalledTimes(1);

    const contextValue = testFn.mock.calls[0][0];
    expect(contextValue).toMatchObject({
      post: mockPost,
      comments: [],
      replies: {},
      hasMoreComments: true,
      currentAuthorId: "user123",
      currentAuthorName: "Test User",
      currentAuthorPicture: "profile.jpg",
      isAdmin: false,
    });

    // Verify all required methods are present
    expect(typeof contextValue.handleEditPost).toBe("function");
    expect(typeof contextValue.handleSavePost).toBe("function");
    expect(typeof contextValue.handleReactOnPost).toBe("function");
    expect(typeof contextValue.handleCopyPost).toBe("function");
    expect(typeof contextValue.fetchComments).toBe("function");
    expect(typeof contextValue.handleAddComment).toBe("function");
    expect(typeof contextValue.handleEditComment).toBe("function");
    expect(typeof contextValue.handleDeleteComment).toBe("function");
    expect(typeof contextValue.handleReactOnComment).toBe("function");
    expect(typeof contextValue.fetchReplies).toBe("function");
    expect(typeof contextValue.handleAddReplyToComment).toBe("function");
    expect(typeof contextValue.handleEditReplyToComment).toBe("function");
    expect(typeof contextValue.handleDeleteReplyToComment).toBe("function");
    expect(typeof contextValue.handleReactOnReplyToComment).toBe("function");
  });

  it("updates post state when initialPost prop changes", async () => {
    const testFn = vi.fn();
    const { rerender } = render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    // Clear the mock call history after initial render
    testFn.mockClear();

    const updatedPost = { ...mockPost, content: "Updated content" };

    rerender(
      <PostProvider {...mockProps} initialPost={updatedPost}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    // Now we only expect one call after rerender
    expect(testFn).toHaveBeenCalled();

    // Get the most recent call and check the post value
    const mostRecentCall = testFn.mock.calls[testFn.mock.calls.length - 1];
    expect(mostRecentCall[0].post).toEqual(updatedPost);
  });

  // Post editing tests
  it("handles editing a post correctly", async () => {
    const testFn = vi.fn();
    axiosInstance.patch.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleEditPost(
        "Updated text",
        ["image.jpg"],
        "connections",
        ["user1"],
      );
    });

    expect(axiosInstance.patch).toHaveBeenCalledWith(`/posts/user123/${mockPost.id}`, {
      content: "Updated text",
      media: ["image.jpg"],
      taggedUsers: ["user1"],
      visibility: "connections",
    });

    // The context should be updated with the new values
    expect(testFn.mock.calls[1][0].post).toMatchObject({
      content: "Updated text",
      media: ["image.jpg"],
      taggedUsers: ["user1"],
      visibility: "connections",
      isEdited: true,
    });
  });

  // Post saving tests
  it("handles saving a post correctly", async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleSavePost();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/user123/save/${mockPost.id}`,
    );
    expect(testFn.mock.calls[1][0].post.isSaved).toBe(true);
    expect(toast.success).toHaveBeenCalledWith(
      "Post saved",
      expect.any(Object),
    );
  });

  it("handles unsaving a post correctly", async () => {
    const testFn = vi.fn();
    axiosInstance.delete.mockResolvedValueOnce({});

    const savedPost = { ...mockPost, isSaved: true };
    render(
      <PostProvider {...mockProps} initialPost={savedPost}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleSavePost();
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(
      `/posts/user123/save/${mockPost.id}`,
    );
    expect(testFn.mock.calls[1][0].post.isSaved).toBe(false);
    expect(toast.success).toHaveBeenCalledWith(
      "Post unsaved.",
      expect.any(Object),
    );
  });

  // Post reaction tests
  it("handles reactions on a post correctly", async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleReactOnPost("celebrate", "like");
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/user123/react/${mockPost.id}`,
      {
        reactions: { celebrate: 1, like: 0 },
        postType: "Post",
      },
    );

    // Check that reactCounts are updated correctly
    expect(testFn.mock.calls[1][0].post.reactCounts).toEqual({
      like: 9, // Decreased by 1
      celebrate: 6, // Increased by 1
    });

    // Check that reactType is set to the new reaction
    expect(testFn.mock.calls[1][0].post.reactType).toBe("celebrate");
  });

  it("handles adding a reaction to a post without removing another", async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleReactOnPost("celebrate", null);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/user123/react/${mockPost.id}`,
      {
        reactions: { celebrate: 1 },
        postType: "Post",
      },
    );

    expect(testFn.mock.calls[1][0].post.reactCounts.celebrate).toBe(6);
  });

  it("handles removing a reaction from a post without adding another", async () => {
    const testFn = vi.fn();
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleReactOnPost(null, "like");
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/user123/react/${mockPost.id}`,
      {
        reactions: { like: 0 },
        postType: "Post",
      },
    );

    expect(testFn.mock.calls[1][0].post.reactCounts.like).toBe(9);
    expect(testFn.mock.calls[1][0].post.reactType).toBe(null);
  });

  // Copy post link test
  it("copies post link to clipboard", async () => {
    const testFn = vi.fn();
    const originalLocation = window.location;

    // Mock window.location
    delete window.location;
    window.location = {
      origin: "https://example.com",
    };

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleCopyPost();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `https://example.com/feed/${mockPost.id}`,
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Link copied to clipboard.",
      expect.any(Object),
    );

    // Restore window.location
    window.location = originalLocation;
  });

  // Comment fetching tests
  it("fetches comments correctly", async () => {
    const testFn = vi.fn();
    const mockComments = [
      { id: "comment1", content: "First comment" },
      { id: "comment2", content: "Second comment" },
    ];

    axiosInstance.get.mockResolvedValueOnce({ data: mockComments });

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.fetchComments();
    });

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/posts/user123/comments/${mockPost.id}`,
      expect.any(Object),
    );
    expect(testFn.mock.calls[1][0].comments).toEqual(mockComments);
    expect(testFn.mock.calls[1][0].hasMoreComments).toBe(true);
  });

  it("merges new comments with existing ones and removes duplicates", async () => {
    const testFn = vi.fn();
    const existingComment = { id: "comment1", content: "Existing comment" };
    const mockComments = [
      existingComment, // Duplicate that should be merged
      { id: "comment2", content: "New comment" },
    ];

    // Setup initial comments
    axiosInstance.get.mockResolvedValueOnce({ data: [existingComment] });

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load the initial comment
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Mock the API response for new comments
    axiosInstance.get.mockResolvedValueOnce({ data: mockComments });

    // Fetch more comments
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Verify unique comments are in the result
    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.comments.length).toBe(2);
    expect(
      newContextValue.comments.find((c) => c.id === "comment1"),
    ).toBeTruthy();
    expect(
      newContextValue.comments.find((c) => c.id === "comment2"),
    ).toBeTruthy();
  });

  it("handles 404 error when fetching comments", async () => {
    const testFn = vi.fn();
    const error = new Error("Not found");
    error.response = { status: 404 };
    axiosInstance.get.mockRejectedValueOnce(error);

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.fetchComments();
    });

    expect(testFn.mock.calls[1][0].hasMoreComments).toBe(false);
  });

  it("handles aborted fetch requests for comments", async () => {
    const testFn = vi.fn();
    const error = new Error("Request aborted");
    error.name = "CanceledError";
    axiosInstance.get.mockRejectedValueOnce(error);

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.fetchComments();
    });

    // No state should change when request is aborted
    expect(testFn.mock.calls.length).toBe(1);
  });

  it("handles generic errors when fetching comments", async () => {
    const testFn = vi.fn();
    const error = new Error("Generic error");
    axiosInstance.get.mockRejectedValueOnce(error);

    // Spy on console.log to verify error logging
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await expect(contextValue.fetchComments()).rejects.toThrow(
      "Error in fetching comments!",
    );

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // Comment adding tests
  it("adds a comment correctly", async () => {
    const testFn = vi.fn();
    const newComment = {
      id: "newcomment",
      content: "New comment",
      authorName: "Test User",
    };

    axiosInstance.post.mockResolvedValueOnce({ data: newComment });

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    await act(async () => {
      await contextValue.handleAddComment("New comment", ["user1"]);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `/posts/user123/comment/${mockPost.id}`,
      {
        content: "New comment",
        taggedUsers: ["user1"],
        isReply: false,
      },
    );

    // New comment should be at the beginning of the comments array
    expect(testFn.mock.calls[1][0].comments[0]).toEqual(newComment);

    // Post comment count should increase
    expect(testFn.mock.calls[1][0].post.comments).toBe(6);
  });

  // Comment editing tests
  it("edits a comment correctly", async () => {
    const testFn = vi.fn();
    const existingComment = {
      id: "comment1",
      content: "Original comment",
      taggedUsers: [],
    };
    axiosInstance.get.mockResolvedValueOnce({ data: [existingComment] });
    axiosInstance.patch.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load the comment
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Now edit the comment
    await act(async () => {
      await contextValue.handleEditComment("comment1", "Updated comment", [
        "user2",
      ]);
    });

    expect(axiosInstance.patch).toHaveBeenCalledWith(
      "/posts/user123/comment/comment1",
      {
        content: "Updated comment",
        tagged: ["user2"],
        isReply: false,
      },
    );

    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.comments[0].content).toBe("Updated comment");
    expect(newContextValue.comments[0].taggedUsers).toEqual(["user2"]);
  });

  // Comment deletion tests
  it("deletes a comment correctly", async () => {
    const testFn = vi.fn();
    const comment1 = { id: "comment1", content: "First comment" };
    const comment2 = { id: "comment2", content: "Second comment" };

    // Set up getting comments
    axiosInstance.get.mockResolvedValueOnce({ data: [comment1, comment2] });
    axiosInstance.delete.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load the comments
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Now delete a comment
    await act(async () => {
      await contextValue.handleDeleteComment("comment1");
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(
      "/posts/user123/comment/comment1",
    );

    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.comments.length).toBe(1);
    expect(newContextValue.comments[0].id).toBe("comment2");
    expect(newContextValue.post.comments).toBe(4); // Decreased by 1
  });

  // Comment reaction tests
  it("handles reactions on a comment correctly", async () => {
    const testFn = vi.fn();
    const comment = {
      id: "comment1",
      content: "Test comment",
      reactCounts: { like: 5, celebrate: 2 },
      reactType: null,
    };

    // Set up the API responses
    axiosInstance.get.mockResolvedValueOnce({ data: [comment] });
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load the comments
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Now react to the comment
    await act(async () => {
      await contextValue.handleReactOnComment("comment1", "like", null);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith("/posts/user123/react/comment1", {
      reactions: { like: 1 },
      postType: "Comment",
    });

    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.comments[0].reactCounts.like).toBe(6);
    expect(newContextValue.comments[0].reactType).toBe("like");
  });

  it("handles removing a reaction from a comment", async () => {
    const testFn = vi.fn();
    const comment = {
      id: "comment1",
      content: "Test comment",
      reactCounts: { like: 5, celebrate: 2 },
      reactType: "like",
    };

    // Set up API responses
    axiosInstance.get.mockResolvedValueOnce({ data: [comment] });
    axiosInstance.post.mockResolvedValueOnce({});

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load comments
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Now perform the reaction removal
    await act(async () => {
      await contextValue.handleReactOnComment("comment1", null, "like");
    });

    expect(axiosInstance.post).toHaveBeenCalledWith("/posts/user123/react/comment1", {
      reactions: { like: 0 },
      postType: "Comment",
    });

    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.comments[0].reactCounts.like).toBe(4);
    expect(newContextValue.comments[0].reactType).toBe(null);
  });

  it("handles 500 error when fetching replies", async () => {
    const testFn = vi.fn();
    const comment = {
      id: "comment1",
      content: "Test comment",
      repliesCount: 3,
    };
    const error = new Error("Server error");
    error.response = { status: 500 };

    // Setup API responses
    axiosInstance.get
      .mockResolvedValueOnce({ data: [comment] }) // Load comments
      .mockRejectedValueOnce(error); // Fail on replies

    render(
      <PostProvider {...mockProps}>
        <TestComponent testFunction={testFn} />
      </PostProvider>,
    );

    const contextValue = testFn.mock.calls[0][0];

    // First load comments
    await act(async () => {
      await contextValue.fetchComments();
    });

    // Clear previous calls
    testFn.mockClear();

    // Now try to fetch replies but with error
    await act(async () => {
      await contextValue.fetchReplies("comment1");
    });

    const newContextValue = testFn.mock.calls[0][0];
    expect(newContextValue.replies.comment1?.hasMore).toBe(false);
    expect(newContextValue.replies.comment1?.replyPage).toBe(2);
  });
});

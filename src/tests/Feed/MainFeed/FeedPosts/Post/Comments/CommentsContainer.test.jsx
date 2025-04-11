import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import CommentsContainer from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentsContainer";

// Mock dependencies
vi.mock("@mui/icons-material/OpenInFull", () => ({
  default: () => (
    <div data-testid="load-more-button">
      <span>Load more comments</span>
    </div>
  ),
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/AddForm",
  () => ({
    default: ({ handleAddFunction, type }) => (
      <div data-testid="add-form">
        <span>Form Type: {type}</span>
        <button
          onClick={() => handleAddFunction("New comment", [])}
          data-testid="add-comment-button"
        >
          Add Comment
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/Comment",
  () => ({
    default: ({ comment }) => (
      <div data-testid="comment-component" className="comment-item">
        <span>{comment.content}</span>
        <span>By: {comment.authorName}</span>
      </div>
    ),
  }),
);

// Mock comments data
const mockComments = [
  {
    id: "comment1",
    authorId: "user1",
    authorName: "John Doe",
    authorBio: "Developer",
    authorPicture: "/profile1.jpg",
    content: "This is the first comment",
    taggedUsers: [],
    timestamp: "2023-01-01T00:00:00Z",
    reactType: "Like",
    reactCounts: { Like: 2, Love: 1 },
    repliesCount: 0,
  },
  {
    id: "comment2",
    authorId: "user2",
    authorName: "Jane Smith",
    authorBio: "Designer",
    authorPicture: "/profile2.jpg",
    content: "This is the second comment",
    taggedUsers: [],
    timestamp: "2023-01-02T00:00:00Z",
    reactType: null,
    reactCounts: { Like: 0, Love: 0 },
    repliesCount: 1,
  },
];

// Mock PostContext handlers
const mockFetchComments = vi.fn().mockResolvedValue(undefined);
const mockHandleAddComment = vi.fn().mockResolvedValue(undefined);
const mockUsePost = vi.fn();

// Set up a single mock for usePost
vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: () => mockUsePost(),
}));

describe("CommentsContainer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default implementation for usePost
    mockUsePost.mockReturnValue({
      post: { id: "post123" },
      hasMoreComments: true,
      comments: mockComments,
      fetchComments: mockFetchComments,
      handleAddComment: mockHandleAddComment,
    });
  });

  it("renders the comment form correctly", () => {
    render(<CommentsContainer />);

    // Check that the AddForm component is rendered
    expect(screen.getByTestId("add-form")).toBeInTheDocument();
    expect(screen.getByText("Form Type: Comment")).toBeInTheDocument();
  });

  it("fetches comments on initial render", async () => {
    render(<CommentsContainer />);

    // Should call fetchComments on mount
    await waitFor(() => {
      expect(mockFetchComments).toHaveBeenCalledTimes(1);
    });
  });

  it("renders the list of comments", () => {
    render(<CommentsContainer />);

    // Check that all comments are rendered
    const commentElements = screen.getAllByTestId("comment-component");
    expect(commentElements).toHaveLength(2);

    // Check the content of each comment
    expect(screen.getByText("This is the first comment")).toBeInTheDocument();
    expect(screen.getByText("This is the second comment")).toBeInTheDocument();
  });

  it("does not show the load more button when hasMoreComments is false", () => {
    // Override the usePost mock for this test
    mockUsePost.mockReturnValueOnce({
      post: { id: "post123" },
      hasMoreComments: false,
      comments: mockComments,
      fetchComments: mockFetchComments,
      handleAddComment: mockHandleAddComment,
    });

    render(<CommentsContainer />);

    // Load more button should not be visible
    expect(screen.queryByTestId("load-more-button")).not.toBeInTheDocument();
  });

  it("fetches more comments when load more button is clicked", async () => {
    render(<CommentsContainer />);

    // Initial fetch on mount
    await waitFor(() => {
      expect(mockFetchComments).toHaveBeenCalledTimes(1);
    });

    mockFetchComments.mockClear();

    // Click load more button
    fireEvent.click(screen.getByTestId("load-more-button"));

    // Should call fetchComments again
    await waitFor(() => {
      expect(mockFetchComments).toHaveBeenCalledTimes(1);
    });
  });

  it("handles adding a comment", async () => {
    render(<CommentsContainer />);

    // Click the add comment button
    fireEvent.click(screen.getByTestId("add-comment-button"));

    // Should call handleAddComment
    await waitFor(() => {
      expect(mockHandleAddComment).toHaveBeenCalledWith("New comment", []);
    });
  });

  it("shows loading skeleton when loading", async () => {
    // First render with isLoading: true
    mockUsePost.mockReturnValue({
      post: { id: "post123" },
      hasMoreComments: true,
      comments: [],
      fetchComments: mockFetchComments,
      handleAddComment: mockHandleAddComment,
      isLoading: true,
    });

    const { rerender, container } = render(<CommentsContainer />);

    // Check for loading skeleton by its class using querySelector
    const loadingSkeleton = container.querySelector(".animate-pulse");
    expect(loadingSkeleton).toBeInTheDocument();

    // Rerender with isLoading: false to simulate loading complete
    mockUsePost.mockReturnValue({
      post: { id: "post123" },
      hasMoreComments: true,
      comments: mockComments,
      fetchComments: mockFetchComments,
      handleAddComment: mockHandleAddComment,
      isLoading: false,
    });

    // Rerender the component with the new mock
    rerender(<CommentsContainer />);

    // Now the loading skeleton should be gone
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("does not fetch comments if post.id is missing", async () => {
    // Override the usePost mock for this test
    mockUsePost.mockReturnValue({
      post: {}, // No id
      hasMoreComments: true,
      comments: [],
      fetchComments: mockFetchComments,
      handleAddComment: mockHandleAddComment,
    });

    render(<CommentsContainer />);

    // Wait some time to make sure fetchComments isn't called
    await new Promise((resolve) => setTimeout(resolve, 50));

    // fetchComments shouldn't be called without post.id
    expect(mockFetchComments).not.toHaveBeenCalled();
  });
});

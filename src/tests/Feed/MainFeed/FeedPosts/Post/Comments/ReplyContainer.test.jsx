import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies
vi.mock("@mui/icons-material/OpenInFull", () => ({
  default: () => <div data-testid="open-in-full-icon">Open Icon</div>,
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentThreadWrapper",
  () => ({
    default: ({ children, hasReplies, isLastReply }) => (
      <div
        data-testid="comment-thread-wrapper"
        data-has-replies={hasReplies.toString()}
        data-is-last-reply={isLastReply?.toString() || "false"}
      >
        {children}
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/AddForm",
  () => ({
    default: ({ handleAddFunction, type }) => (
      <div data-testid="add-form">
        <span>Form Type: {type}</span>
        <button
          onClick={() => handleAddFunction("New reply text", [])}
          data-testid="submit-reply"
        >
          Add Reply
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/Reply",
  () => ({
    default: ({ commentId, reply }) => (
      <div data-testid="reply-component" data-reply-id={reply.id}>
        <span>{reply.content}</span>
      </div>
    ),
  }),
);

// Mock reply data
const mockReplies = {
  comment123: {
    hasMore: true,
    data: [
      {
        id: "reply1",
        content: "First reply content",
        authorId: "user1",
        authorName: "Test User 1",
      },
      {
        id: "reply2",
        content: "Second reply content",
        authorId: "user2",
        authorName: "Test User 2",
      },
    ],
  },
};

// Mock the usePost hook and create a function to modify it for individual tests
const mockFetchReplies = vi.fn().mockResolvedValue(undefined);
const mockHandleAddReplyToComment = vi.fn().mockResolvedValue(undefined);

// Default mock implementation
const defaultMockPostContext = {
  replies: mockReplies,
  fetchReplies: mockFetchReplies,
  handleAddReplyToComment: mockHandleAddReplyToComment,
};

// Create a mock that can be easily modified in tests
const mockUsePost = vi.fn().mockReturnValue(defaultMockPostContext);

vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: () => mockUsePost(),
}));

// Now import the component after all mocks are set up
import ReplyContainer from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/ReplyContainer";

describe("ReplyContainer Component", () => {
  const commentId = "comment123";

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock implementation before each test
    mockUsePost.mockReturnValue(defaultMockPostContext);
  });

  it("fetches replies on initial render", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      expect(mockFetchReplies).toHaveBeenCalledTimes(1);
      expect(mockFetchReplies).toHaveBeenCalledWith(commentId);
    });
  });

  it("renders the list of replies", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      const replyComponents = screen.getAllByTestId("reply-component");
      expect(replyComponents).toHaveLength(2);

      expect(screen.getByText("First reply content")).toBeInTheDocument();
      expect(screen.getByText("Second reply content")).toBeInTheDocument();
    });
  });

  it("renders the reply form correctly", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      expect(screen.getByTestId("add-form")).toBeInTheDocument();
      expect(screen.getByText("Form Type: Reply")).toBeInTheDocument();
    });
  });

  it("handles adding a reply correctly", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      // Find and click the submit button in the AddForm
      fireEvent.click(screen.getByTestId("submit-reply"));

      expect(mockHandleAddReplyToComment).toHaveBeenCalledWith(
        commentId,
        "New reply text",
        [],
      );
    });
  });

  it("shows the load more button when hasMoreReplies is true", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      // The load more button should be visible
      expect(screen.getByText("Load more Replies")).toBeInTheDocument();
    });
  });

  it("does not show the load more button when hasMoreReplies is false", async () => {
    // Override the usePost hook for this test
    mockUsePost.mockReturnValueOnce({
      replies: {
        comment123: {
          hasMore: false,
          data: mockReplies["comment123"].data,
        },
      },
      fetchReplies: mockFetchReplies,
      handleAddReplyToComment: mockHandleAddReplyToComment,
    });

    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      // The load more button should not be visible
      expect(screen.queryByText("Load more Replies")).not.toBeInTheDocument();
    });
  });

  it("fetches more replies when load more button is clicked", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      expect(mockFetchReplies).toHaveBeenCalledTimes(1);
    });

    // Clear the initial call counter
    mockFetchReplies.mockClear();

    // Click the load more button
    fireEvent.click(screen.getByText("Load more Replies"));

    // Should call fetchReplies again
    await waitFor(() => {
      expect(mockFetchReplies).toHaveBeenCalledTimes(1);
      expect(mockFetchReplies).toHaveBeenCalledWith(commentId);
    });
  });

  it("uses correct thread wrapper props for replies and form", async () => {
    render(<ReplyContainer commentId={commentId} />);

    await waitFor(() => {
      const wrappers = screen.getAllByTestId("comment-thread-wrapper");

      // Get the last wrapper (should be the reply form)
      const formWrapper = wrappers[wrappers.length - 1];

      // Check if it has the correct props
      expect(formWrapper).toHaveAttribute("data-has-replies", "true");
      expect(formWrapper).toHaveAttribute("data-is-last-reply", "true");
    });
  });

  it("does not render replies section if no replies exist", async () => {
    // Override the usePost hook for this test
    mockUsePost.mockReturnValueOnce({
      replies: {},
      fetchReplies: mockFetchReplies,
      handleAddReplyToComment: mockHandleAddReplyToComment,
    });

    render(<ReplyContainer commentId="comment456" />);

    await waitFor(() => {
      // Should not find any reply components
      expect(screen.queryByTestId("reply-component")).not.toBeInTheDocument();
    });
  });
});

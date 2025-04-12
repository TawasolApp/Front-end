import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Comment from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/Comment";

// Mock dependencies
vi.mock("@mui/icons-material/MoreHoriz", () => ({
  default: () => <div data-testid="more-icon">More</div>,
}));

vi.mock("@mui/icons-material/Flag", () => ({
  default: () => <div data-testid="flag-icon">Flag</div>,
}));

vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <div data-testid="edit-icon">Edit</div>,
}));

vi.mock("@mui/icons-material/Delete", () => ({
  default: () => <div data-testid="delete-icon">Delete</div>,
}));

vi.mock("../../../../../../utils", () => ({
  formatDate: () => "2h ago",
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/ActorHeader", () => ({
  default: ({ authorName, authorPicture }) => (
    <div data-testid="actor-header">
      <img src={authorPicture} alt={authorName} />
      <span>{authorName}</span>
    </div>
  ),
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/DropdownMenu", () => ({
  default: ({ children, menuItems }) => (
    <div data-testid="dropdown-menu">
      {children}
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={item.onClick}
            data-testid={`menu-item-${index}`}
          >
            <item.icon />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal",
  () => ({
    default: ({ setShowLikes }) => (
      <div data-testid="reactions-modal">
        <button onClick={setShowLikes} data-testid="close-reactions">
          Close
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/ActivitiesHolder",
  () => ({
    default: ({
      currentReaction,
      reactions,
      handleReaction,
      setShowReactions,
      replies,
      setShowReplies,
    }) => (
      <div data-testid="activities-holder">
        <button
          onClick={() => handleReaction("Like", null)}
          data-testid="react-button"
        >
          React
        </button>
        <button onClick={setShowReactions} data-testid="show-reactions">
          Show Reactions (
          {Object.values(reactions).reduce((sum, count) => sum + count, 0)})
        </button>
        <button onClick={setShowReplies} data-testid="show-replies">
          Show Replies ({replies})
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentThreadWrapper",
  () => ({
    default: ({ children }) => (
      <div data-testid="thread-wrapper">{children}</div>
    ),
  }),
);

vi.mock("../../../../../../pages/Feed/GenericComponents/TextViewer", () => ({
  default: ({ text }) => <div data-testid="text-viewer">{text}</div>,
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/AddForm",
  () => ({
    default: ({ handleAddFunction, initialText, close, type }) => (
      <div data-testid="add-form">
        <span>Form Type: {type}</span>
        <textarea value={initialText} readOnly />
        <button
          onClick={() => handleAddFunction("Edited text", [])}
          data-testid="submit-edit"
        >
          Submit
        </button>
        <button onClick={close} data-testid="cancel-edit">
          Cancel
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/ReplyContainer",
  () => ({
    default: ({ commentId }) => (
      <div data-testid="reply-container">Replies for comment {commentId}</div>
    ),
  }),
);

// Mock PostContext - Fix the path and create a mock PostProvider
const mockHandleDeleteComment = vi.fn();
const mockHandleEditComment = vi.fn().mockResolvedValue({});
const mockHandleReactOnComment = vi.fn().mockResolvedValue({});

vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => {
  // Create an actual context object to use in tests
  const { createContext } = require("react");
  const actualContext = createContext(null);

  return {
    PostContext: actualContext,
    usePost: () => ({
      currentAuthorId: "current-user-123",
      handleDeleteComment: mockHandleDeleteComment,
      handleEditComment: mockHandleEditComment,
      handleReactOnComment: mockHandleReactOnComment,
    }),
    PostProvider: ({ children }) => {
      return (
        <actualContext.Provider
          value={{
            currentAuthorId: "current-user-123",
            handleDeleteComment: mockHandleDeleteComment,
            handleEditComment: mockHandleEditComment,
            handleReactOnComment: mockHandleReactOnComment,
          }}
        >
          {children}
        </actualContext.Provider>
      );
    },
  };
});

// Import PostProvider after mocking
import { PostProvider } from "../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Custom render function that wraps components with PostProvider
const customRender = (ui, options) => {
  return render(<PostProvider>{ui}</PostProvider>, options);
};

describe("Comment Component", () => {
  const mockComment = {
    id: "comment-123",
    authorId: "user-456",
    authorName: "Jane Doe",
    authorBio: "Software Developer",
    authorPicture: "/path/to/profile.jpg",
    content: "This is a test comment",
    taggedUsers: [],
    timestamp: new Date().toISOString(),
    reactType: null,
    reactCounts: { Like: 5, Love: 2, Celebrate: 1, Insightful: 0, Support: 0 },
    repliesCount: 3,
  };

  const mockOwnComment = {
    ...mockComment,
    authorId: "current-user-123", // Same as currentAuthorId from context
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders comment content correctly", () => {
    customRender(<Comment comment={mockComment} />);

    // Check that basic elements are rendered
    expect(screen.getByTestId("actor-header")).toBeInTheDocument();
    expect(screen.getByTestId("text-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("text-viewer").textContent).toBe(
      mockComment.content,
    );
    expect(screen.getByText("2h ago")).toBeInTheDocument();
  });

  it("shows report option for any comment", () => {
    customRender(<Comment comment={mockComment} />);

    // Click dropdown menu
    fireEvent.click(screen.getByTestId("more-icon"));

    // Report option should be visible
    expect(screen.getByText("Report comment")).toBeInTheDocument();
  });

  it("shows edit and delete options for own comments", () => {
    customRender(<Comment comment={mockOwnComment} />);

    // Click dropdown menu
    fireEvent.click(screen.getByTestId("more-icon"));

    // Edit and Delete options should be visible
    expect(screen.getByText("Edit comment")).toBeInTheDocument();
    expect(screen.getByText("Delete comment")).toBeInTheDocument();
  });

  it("does not show edit and delete options for other users comments", () => {
    customRender(<Comment comment={mockComment} />);

    // Click dropdown menu
    fireEvent.click(screen.getByTestId("more-icon"));

    // Edit and Delete options should not be visible
    expect(screen.queryByText("Edit comment")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete comment")).not.toBeInTheDocument();
  });

  it("switches to edit mode when edit option is clicked", () => {
    const { getByText, getByTestId } = customRender(
      <Comment comment={mockOwnComment} />,
    );

    // Click dropdown menu
    fireEvent.click(getByTestId("more-icon"));

    // Click edit option
    fireEvent.click(getByText("Edit comment"));

    // Should show edit form
    expect(getByTestId("add-form")).toBeInTheDocument();
    expect(getByText("Form Type: Edit Comment")).toBeInTheDocument();
  });

  it("calls delete handler when delete option is clicked", () => {
    customRender(<Comment comment={mockOwnComment} />);

    // Click dropdown menu
    fireEvent.click(screen.getByTestId("more-icon"));

    // Click delete option
    fireEvent.click(screen.getByText("Delete comment"));

    // Delete handler should be called
    expect(mockHandleDeleteComment).toHaveBeenCalledWith(mockOwnComment.id);
  });

  it("submits edited comment correctly", async () => {
    customRender(<Comment comment={mockOwnComment} />);

    // Click dropdown menu and edit option
    fireEvent.click(screen.getByTestId("more-icon"));
    fireEvent.click(screen.getByText("Edit comment"));

    // Submit edited comment
    fireEvent.click(screen.getByTestId("submit-edit"));

    // Edit handler should be called
    await waitFor(() => {
      expect(mockHandleEditComment).toHaveBeenCalledWith(
        mockOwnComment.id,
        "Edited text",
        [],
      );
    });

    // Should return to view mode
    expect(screen.queryByTestId("add-form")).not.toBeInTheDocument();
  });

  it("cancels edit mode when cancel button is clicked", () => {
    customRender(<Comment comment={mockOwnComment} />);

    // Click dropdown menu and edit option
    fireEvent.click(screen.getByTestId("more-icon"));
    fireEvent.click(screen.getByText("Edit comment"));

    // Click cancel button
    fireEvent.click(screen.getByTestId("cancel-edit"));

    // Should return to view mode without saving
    expect(screen.queryByTestId("add-form")).not.toBeInTheDocument();
  });

  it("shows reactions modal when show reactions is clicked", () => {
    customRender(<Comment comment={mockComment} />);

    // Click show reactions
    fireEvent.click(screen.getByTestId("show-reactions"));

    // Reactions modal should be visible
    expect(screen.getByTestId("reactions-modal")).toBeInTheDocument();
  });

  it("closes reactions modal correctly", () => {
    customRender(<Comment comment={mockComment} />);

    // Open and close reactions modal
    fireEvent.click(screen.getByTestId("show-reactions"));
    fireEvent.click(screen.getByTestId("close-reactions"));

    // Reactions modal should be closed
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();
  });

  it("shows replies when show replies is clicked", () => {
    customRender(<Comment comment={mockComment} />);

    // Click show replies
    fireEvent.click(screen.getByTestId("show-replies"));

    // Reply container should be visible
    expect(screen.getByTestId("reply-container")).toBeInTheDocument();
    expect(
      screen.getByText(`Replies for comment ${mockComment.id}`),
    ).toBeInTheDocument();
  });

  it("handles reaction on comment correctly", async () => {
    customRender(<Comment comment={mockComment} />);

    // Click react button
    fireEvent.click(screen.getByTestId("react-button"));

    // React handler should be called
    expect(mockHandleReactOnComment).toHaveBeenCalledWith(
      mockComment.id,
      "Like",
      null,
    );
  });
});

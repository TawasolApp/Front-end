import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Mock the usePost hook directly without importing it
const mockHandleDeleteReplyToComment = vi.fn();
const mockHandleEditReplyToComment = vi.fn();
const mockHandleReactOnReplyToComment = vi.fn();
const mockCurrentAuthorId = "user123";

// Mock the usePost hook - do this before importing the component
vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: () => ({
    currentAuthorId: mockCurrentAuthorId,
    handleDeleteReplyToComment: mockHandleDeleteReplyToComment,
    handleEditReplyToComment: mockHandleEditReplyToComment,
    handleReactOnReplyToComment: mockHandleReactOnReplyToComment,
  }),
}));

// Import Reply after mocking dependencies
import Reply from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/Reply";

// Mock dependencies
vi.mock("@mui/icons-material/Flag", () => ({
  default: () => <div>FlagIcon</div>,
}));

vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <div>EditIcon</div>,
}));

vi.mock("@mui/icons-material/Delete", () => ({
  default: () => <div>DeleteIcon</div>,
}));

vi.mock("@mui/icons-material/MoreHoriz", () => ({
  default: () => <div>MoreHorizIcon</div>,
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/DropdownMenu", () => ({
  default: ({ children, menuItems }) => (
    <div data-testid="dropdown-menu">
      {children}
      <div data-testid="menu-items">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            data-testid={`menu-item-${index}`}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  ),
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/ActorHeader", () => ({
  default: (props) => (
    <div data-testid="actor-header">
      <span>{props.authorName}</span>
    </div>
  ),
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/ActivitiesHolder",
  () => ({
    default: ({ handleReaction, setShowReactions }) => (
      <div data-testid="activities-holder">
        <button
          onClick={() => handleReaction("Like", null)}
          data-testid="like-button"
        >
          Like
        </button>
        <button onClick={setShowReactions} data-testid="show-reactions">
          Show Reactions
        </button>
      </div>
    ),
  }),
);

vi.mock("../../../../../../utils", () => ({
  formatDate: () => "2 days ago",
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/TextViewer", () => ({
  default: ({ text }) => <div data-testid="text-viewer">{text}</div>,
}));

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/AddForm",
  () => ({
    default: ({ handleAddFunction, initialText, close, type }) => (
      <div data-testid="add-form">
        <span>{type}</span>
        <div>{initialText}</div>
        <button
          onClick={() => handleAddFunction("Updated text", [])}
          data-testid="submit-edit"
        >
          Save
        </button>
        <button onClick={close} data-testid="cancel-edit">
          Cancel
        </button>
      </div>
    ),
  }),
);

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
  "../../../../../../pages/Feed/MainFeed/FeedPosts/DeleteModal/DeletePostModal",
  () => ({
    default: ({ closeModal, deleteFunc }) => (
      <div data-testid="delete-modal">
        <button onClick={deleteFunc} data-testid="confirm-delete">
          Confirm Delete
        </button>
        <button onClick={closeModal} data-testid="cancel-delete">
          Cancel
        </button>
      </div>
    ),
  })
);

describe("Reply Component", () => {
  const mockReply = {
    id: "reply123",
    authorId: "user123",
    authorName: "John Doe",
    authorBio: "Software Developer",
    authorPicture: "/profile.jpg",
    content: "This is a reply to a comment",
    taggedUsers: [],
    timestamp: "2023-01-01T12:00:00Z",
    reactType: "Like",
    reactCounts: { Like: 5, Love: 2 },
  };

  const mockCommentId = "comment123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders reply content correctly", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    expect(screen.getByTestId("actor-header")).toBeInTheDocument();
    expect(screen.getByTestId("text-viewer")).toHaveTextContent(
      "This is a reply to a comment",
    );
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it("shows edit and delete options when the reply author is the current user", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    // The mock already sets currentAuthorId to match reply.authorId
    expect(screen.getByTestId("menu-item-0")).toHaveTextContent("Report reply");
    expect(screen.getByTestId("menu-item-1")).toHaveTextContent("Edit reply");
    expect(screen.getByTestId("menu-item-2")).toHaveTextContent("Delete reply");
  });

  it("hides edit and delete options when the reply author is not the current user", () => {
    const differentAuthorReply = {
      ...mockReply,
      authorId: "different-user",
    };

    render(<Reply commentId={mockCommentId} reply={differentAuthorReply} />);

    expect(screen.getByTestId("menu-item-0")).toHaveTextContent("Report reply");
    expect(screen.queryByTestId("menu-item-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("menu-item-2")).not.toBeInTheDocument();
  });

  it("handles delete action correctly", async () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);
  
    // Click delete option in menu to open the modal
    fireEvent.click(screen.getByTestId("menu-item-2"));
    
    // The delete modal should now be visible
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    
    // Click the confirm button in the modal
    fireEvent.click(screen.getByTestId("confirm-delete"));
  
    // Now the delete function should have been called
    expect(mockHandleDeleteReplyToComment).toHaveBeenCalledWith(
      mockCommentId,
      mockReply.id
    );
    
    // Wait for the modal to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });
  });

  it("shows edit form when edit action is clicked", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    fireEvent.click(screen.getByTestId("menu-item-1")); // Click edit option

    expect(screen.getByTestId("add-form")).toBeInTheDocument();
    expect(screen.getByText("Edit Reply")).toBeInTheDocument();
  });

  it("handles edit submission correctly", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    // Click edit option
    fireEvent.click(screen.getByTestId("menu-item-1"));

    // Submit the edit form
    fireEvent.click(screen.getByTestId("submit-edit"));

    expect(mockHandleEditReplyToComment).toHaveBeenCalledWith(
      mockCommentId,
      mockReply.id,
      "Updated text",
      [],
    );

    // Should exit edit mode after submission
    expect(screen.queryByTestId("add-form")).not.toBeInTheDocument();
  });

  it("cancels edit mode when close is clicked", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    // Click edit option
    fireEvent.click(screen.getByTestId("menu-item-1"));

    // Cancel the edit
    fireEvent.click(screen.getByTestId("cancel-edit"));

    // Should exit edit mode
    expect(screen.queryByTestId("add-form")).not.toBeInTheDocument();
  });

  it("handles reaction correctly", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    // Click the like button
    fireEvent.click(screen.getByTestId("like-button"));

    expect(mockHandleReactOnReplyToComment).toHaveBeenCalledWith(
      mockCommentId,
      mockReply.id,
      "Like",
      null,
    );
  });

  it("shows and hides reactions modal", () => {
    render(<Reply commentId={mockCommentId} reply={mockReply} />);

    // Open reactions modal
    fireEvent.click(screen.getByTestId("show-reactions"));

    // Modal should be visible
    expect(screen.getByTestId("reactions-modal")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByTestId("close-reactions"));

    // Modal should no longer be visible
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();
  });
});

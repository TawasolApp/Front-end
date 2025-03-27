import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivitiesHolder from "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/ActivitiesHolder";

// Mock the child components
vi.mock(
  "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/LikeButton",
  () => ({
    default: ({ initReactValue, handleReaction }) => (
      <div
        data-testid="like-button"
        data-init-react-value={initReactValue}
        data-handle-reaction={!!handleReaction}
      >
        Like Button
      </div>
    ),
  }),
);

vi.mock(
  "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/CommentButton",
  () => ({
    default: ({ setShowComments }) => (
      <div
        data-testid="comment-button"
        data-set-show-comments={!!setShowComments}
      >
        Comment Button
      </div>
    ),
  }),
);

vi.mock(
  "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/RepostButton",
  () => ({
    default: () => <div data-testid="repost-button">Repost Button</div>,
  }),
);

vi.mock(
  "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/SendButton",
  () => ({
    default: () => <div data-testid="send-button">Send Button</div>,
  }),
);

describe("ActivitiesHolder Component", () => {
  // Mock props
  const mockInitReactValue = "like";
  const mockOnChange = vi.fn();
  const mockSetShowComments = vi.fn();

  it("renders all four activity buttons", () => {
    render(
      <ActivitiesHolder
        initReactValue={mockInitReactValue}
        onChange={mockOnChange}
        setShowComments={mockSetShowComments}
      />,
    );

    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByTestId("comment-button")).toBeInTheDocument();
    expect(screen.getByTestId("repost-button")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });

  it("passes correct props to LikeButton", () => {
    render(
      <ActivitiesHolder
        initReactValue={mockInitReactValue}
        handleReaction={mockOnChange}
        setShowComments={mockSetShowComments}
      />,
    );

    const likeButton = screen.getByTestId("like-button");
    expect(likeButton.dataset.initReactValue).toBe(mockInitReactValue);
    expect(likeButton.dataset.handleReaction).toBe("true");
  });

  it("passes correct props to CommentButton", () => {
    render(
      <ActivitiesHolder
        initReactValue={mockInitReactValue}
        onChange={mockOnChange}
        setShowComments={mockSetShowComments}
      />,
    );

    const commentButton = screen.getByTestId("comment-button");
    expect(commentButton.dataset.setShowComments).toBe("true");
  });

  it("applies grid layout to container", () => {
    const { container } = render(
      <ActivitiesHolder
        initReactValue={mockInitReactValue}
        onChange={mockOnChange}
        setShowComments={mockSetShowComments}
      />,
    );

    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass("grid");
    expect(gridContainer).toHaveClass("grid-cols-4");
  });

  it("renders with default props when not provided", () => {
    // Render with no props
    render(<ActivitiesHolder />);

    // Component should still render without errors
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByTestId("comment-button")).toBeInTheDocument();
    expect(screen.getByTestId("repost-button")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });
});

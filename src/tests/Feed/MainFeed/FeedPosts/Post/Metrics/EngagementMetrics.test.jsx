import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EngagementMetrics from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Metrics/EngagementMetrics";
import { usePost } from "../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";
import { useNavigate } from "react-router-dom";

// Mock dependencies
vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// Mock reactionIcons
vi.mock("../../../../../../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    like: { Icon: () => <div data-testid="icon-like">Like Icon</div> },
    celebrate: {
      Icon: () => <div data-testid="icon-celebrate">Celebrate Icon</div>,
    },
    support: { Icon: () => <div data-testid="icon-support">Support Icon</div> },
    funny: { Icon: () => <div data-testid="icon-funny">Funny Icon</div> },
    love: { Icon: () => <div data-testid="icon-love">Love Icon</div> },
    insightful: {
      Icon: () => <div data-testid="icon-insightful">Insightful Icon</div>,
    },
    curious: { Icon: () => <div data-testid="icon-curious">Curious Icon</div> },
  },
}));

describe("EngagementMetrics Component", () => {
  const mockSetShowLikes = vi.fn();
  const mockSetShowComments = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  it("renders correctly with no engagements", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 0,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // No reaction icons should be visible
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument();

    // No counts should be visible
    expect(screen.queryByText(/comment/)).not.toBeInTheDocument();
    expect(screen.queryByText(/repost/)).not.toBeInTheDocument();
  });

  it("displays top reactions in descending order", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {
          like: 5,
          celebrate: 10,
          support: 3,
          funny: 1,
        },
        comments: 0,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Top 3 reactions should be shown in order: celebrate, like, support
    const icons = screen.getAllByTestId(/icon-/);
    expect(icons.length).toBe(3);
    expect(icons[0]).toHaveTextContent("Celebrate Icon");
    expect(icons[1]).toHaveTextContent("Like Icon");
    expect(icons[2]).toHaveTextContent("Support Icon");

    // Total count should be displayed
    expect(screen.getByText("19")).toBeInTheDocument();
  });

  it("calls setShowLikes when reactions button is clicked", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: { like: 5 },
        comments: 0,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Click the reactions button
    fireEvent.click(screen.getByText("5"));

    // setShowLikes should be called
    expect(mockSetShowLikes).toHaveBeenCalledTimes(1);
  });

  it("displays singular comment text when there is 1 comment", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 1,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    expect(screen.getByText("1 comment")).toBeInTheDocument();
  });

  it("displays plural comment text when there are multiple comments", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 5,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    expect(screen.getByText("5 comments")).toBeInTheDocument();
  });

  it("calls setShowComments when comments button is clicked", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 5,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Click the comments button
    fireEvent.click(screen.getByText("5 comments"));

    // setShowComments should be called
    expect(mockSetShowComments).toHaveBeenCalledTimes(1);
  });

  it("displays singular repost text when there is 1 share", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 0,
        shares: 1,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    expect(screen.getByText("1 repost")).toBeInTheDocument();
  });

  it("displays plural repost text when there are multiple shares", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 0,
        shares: 3,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    expect(screen.getByText("3 reposts")).toBeInTheDocument();
  });

  it("navigates to reposts page when shares button is clicked", () => {
    const postId = "post123";
    usePost.mockReturnValue({
      post: {
        id: postId,
        reactCounts: {},
        comments: 0,
        shares: 3,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Click the reposts button
    fireEvent.click(screen.getByText("3 reposts"));

    // navigate should be called with the correct path
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/feed/reposts/${postId}`);
  });

  it("displays separator dot between comments and shares", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 2,
        shares: 3,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Separator dot should be visible
    expect(screen.getByText("•")).toBeInTheDocument();
  });

  it("does not display separator dot when only comments are present", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 2,
        shares: 0,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Separator dot should not be visible
    expect(screen.queryByText("•")).not.toBeInTheDocument();
  });

  it("does not display separator dot when only shares are present", () => {
    usePost.mockReturnValue({
      post: {
        id: "post123",
        reactCounts: {},
        comments: 0,
        shares: 3,
      },
    });

    render(
      <EngagementMetrics
        setShowLikes={mockSetShowLikes}
        setShowComments={mockSetShowComments}
      />,
    );

    // Separator dot should not be visible
    expect(screen.queryByText("•")).not.toBeInTheDocument();
  });
});

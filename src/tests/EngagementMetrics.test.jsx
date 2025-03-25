import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EngagementMetrics from "../pages/Feed/MainFeed/FeedPosts/PostCard/Metrics/EngagementMetrics";

// Mock the reactionIcons module
vi.mock("../pages/Feed/GenericComponents/reactionIcons", () => {
  return {
    default: {
      like: {
        Icon: () => <div data-testid="like-icon">Like Icon</div>,
        color: "blue",
      },
      celebrate: {
        Icon: () => <div data-testid="celebrate-icon">Celebrate Icon</div>,
        color: "orange",
      },
      support: {
        Icon: () => <div data-testid="support-icon">Support Icon</div>,
        color: "purple",
      },
      funny: {
        Icon: () => <div data-testid="funny-icon">Funny Icon</div>,
        color: "yellow",
      },
      love: {
        Icon: () => <div data-testid="love-icon">Love Icon</div>,
        color: "red",
      },
      insightful: {
        Icon: () => <div data-testid="insightful-icon">Insightful Icon</div>,
        color: "green",
      },
    },
  };
});

describe("EngagementMetrics Component", () => {
  const setShowLikes = vi.fn();
  const setShowComments = vi.fn();
  const setShowReposts = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    setShowLikes.mockReset();
    setShowComments.mockReset();
    setShowReposts.mockReset();
  });

  it("renders nothing when there are no metrics", () => {
    render(
      <EngagementMetrics
        reactions={{}}
        comments={0}
        reposts={0}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // No reaction icons should be visible
    expect(screen.queryByTestId(/.*-icon/)).not.toBeInTheDocument();

    // No counts should be visible
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    expect(screen.queryByText("comment")).not.toBeInTheDocument();
    expect(screen.queryByText("comments")).not.toBeInTheDocument();
    expect(screen.queryByText("repost")).not.toBeInTheDocument();
    expect(screen.queryByText("reposts")).not.toBeInTheDocument();
  });

  it("displays top 3 reaction icons in order of count", () => {
    const reactions = {
      like: 5,
      celebrate: 10,
      support: 3,
      funny: 8,
      love: 1,
    };

    render(
      <EngagementMetrics
        reactions={reactions}
        comments={0}
        reposts={0}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // The top 3 reactions should be celebrate (10), funny (8), and like (5)
    expect(screen.getByTestId("celebrate-icon")).toBeInTheDocument();
    expect(screen.getByTestId("funny-icon")).toBeInTheDocument();
    expect(screen.getByTestId("like-icon")).toBeInTheDocument();

    // Lower-count reactions should not be shown
    expect(screen.queryByTestId("support-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("love-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("insightful-icon")).not.toBeInTheDocument();

    // Total count (27) should be shown
    expect(screen.getByText("27")).toBeInTheDocument();
  });

  it("displays singular form for 1 comment and 1 repost", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 1 }}
        comments={1}
        reposts={1}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Singular form should be used for 1 comment
    expect(screen.getByText("1 comment")).toBeInTheDocument();

    // Singular form should be used for 1 repost
    expect(screen.getByText("1 repost")).toBeInTheDocument();

    // Separator bullet should be shown between comments and reposts
    expect(screen.getByText("•")).toBeInTheDocument();
  });

  it("displays plural form for multiple comments and reposts", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 1 }}
        comments={5}
        reposts={10}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Plural form should be used for multiple comments
    expect(screen.getByText("5 comments")).toBeInTheDocument();

    // Plural form should be used for multiple reposts
    expect(screen.getByText("10 reposts")).toBeInTheDocument();
  });

  it("shows separator only when both comments and reposts exist", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 1 }}
        comments={5}
        reposts={0}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Comments should be shown
    expect(screen.getByText("5 comments")).toBeInTheDocument();

    // No reposts, so no separator
    expect(screen.queryByText("•")).not.toBeInTheDocument();

    // Re-render with reposts but no comments
    render(
      <EngagementMetrics
        reactions={{ like: 1 }}
        comments={0}
        reposts={10}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Reposts should be shown
    expect(screen.getByText("10 reposts")).toBeInTheDocument();

    // No comments, so no separator
    expect(screen.queryByText("•")).not.toBeInTheDocument();
  });

  it("calls setShowLikes when reactions count is clicked", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 5 }}
        comments={0}
        reposts={0}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Click on the reactions button
    fireEvent.click(screen.getByText("5"));

    // setShowLikes should be called with true
    expect(setShowLikes).toHaveBeenCalledWith(true);
    expect(setShowLikes).toHaveBeenCalledTimes(1);

    // Other methods should not be called
    expect(setShowComments).not.toHaveBeenCalled();
    expect(setShowReposts).not.toHaveBeenCalled();
  });

  it("calls setShowComments when comments count is clicked", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 5 }}
        comments={10}
        reposts={0}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Click on the comments button
    fireEvent.click(screen.getByText("10 comments"));

    // setShowComments should be called with true
    expect(setShowComments).toHaveBeenCalledWith(true);
    expect(setShowComments).toHaveBeenCalledTimes(1);

    // Other methods should not be called
    expect(setShowLikes).not.toHaveBeenCalled();
    expect(setShowReposts).not.toHaveBeenCalled();
  });

  it("calls setShowReposts when reposts count is clicked", () => {
    render(
      <EngagementMetrics
        reactions={{ like: 5 }}
        comments={0}
        reposts={15}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // Click on the reposts button
    fireEvent.click(screen.getByText("15 reposts"));

    // setShowReposts should be called with true
    expect(setShowReposts).toHaveBeenCalledWith(true);
    expect(setShowReposts).toHaveBeenCalledTimes(1);

    // Other methods should not be called
    expect(setShowLikes).not.toHaveBeenCalled();
    expect(setShowComments).not.toHaveBeenCalled();
  });

  it("handles empty reactions object gracefully", () => {
    render(
      <EngagementMetrics
        reactions={{}}
        comments={5}
        reposts={10}
        setShowLikes={setShowLikes}
        setShowComments={setShowComments}
        setShowReposts={setShowReposts}
      />,
    );

    // No reaction icons should be visible
    expect(screen.queryByTestId(/.*-icon/)).not.toBeInTheDocument();

    // Total count should not be shown
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();

    // Comments and reposts should still be visible
    expect(screen.getByText("5 comments")).toBeInTheDocument();
    expect(screen.getByText("10 reposts")).toBeInTheDocument();
  });
});

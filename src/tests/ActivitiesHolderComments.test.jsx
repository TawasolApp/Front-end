import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivitiesHolder from "../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/ActivitiesHolder";

// Mock dependencies with the right casing for reaction types
vi.mock("../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    like: {
      Icon: ({ className }) => (
        <div data-testid="like-icon" className={className}>
          Like Icon
        </div>
      ),
      color: "blue",
      label: "Like",
    },
    celebrate: {
      Icon: ({ className }) => (
        <div data-testid="celebrate-icon" className={className}>
          Celebrate Icon
        </div>
      ),
      color: "yellow",
      label: "Celebrate",
    },
    support: {
      Icon: ({ className }) => (
        <div data-testid="support-icon" className={className}>
          Support Icon
        </div>
      ),
      color: "purple",
      label: "Support",
    },
    insightful: {
      Icon: ({ className }) => (
        <div data-testid="insightful-icon" className={className}>
          Insightful Icon
        </div>
      ),
      color: "green",
      label: "Insightful",
    },
  },
}));

vi.mock("../pages/Feed/GenericComponents/ReactionPicker", () => ({
  default: ({ children, onSelectReaction }) => (
    <div data-testid="reaction-picker">
      {children}
      <button
        data-testid="select-celebrate"
        onClick={() => onSelectReaction("celebrate")}
      >
        Select Celebrate
      </button>
    </div>
  ),
}));

describe("Comment ActivitiesHolder Component", () => {
  const mockOnReactionChange = vi.fn();
  const mockSetShowReactions = vi.fn();
  const mockSetShowReplies = vi.fn();

  // Sample reaction data - ensure these keys match exactly with the mock above
  const sampleReactions = {
    like: 5,
    celebrate: 3,
    support: 1,
    insightful: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with no initial reaction", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should show "Like" text
    expect(screen.getByText("Like")).toBeInTheDocument();

    // Should show Reply button
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("displays reaction count when reactions exist", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should show total likes (5+3+1=9)
    expect(screen.getByText("9")).toBeInTheDocument();

    // Should show the top 3 reaction icons (we'll only have like, celebrate, support since they have non-zero counts)
    expect(screen.getByTestId("like-icon")).toBeInTheDocument();
    expect(screen.getByTestId("celebrate-icon")).toBeInTheDocument();
    expect(screen.getByTestId("support-icon")).toBeInTheDocument();
  });

  it("displays replies count when replies exist", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={3}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should show 3 replies
    expect(screen.getByText("3 replies")).toBeInTheDocument();
  });

  it("displays correct singular form for 1 reply", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={1}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should show "1 reply" (singular)
    expect(screen.getByText("1 reply")).toBeInTheDocument();
  });

  it("calls setShowReplies when Reply button is clicked", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Click Reply button
    fireEvent.click(screen.getByText("Reply"));

    // Should call setShowReplies with true
    expect(mockSetShowReplies).toHaveBeenCalledWith(true);
  });

  it("calls setShowReactions when reaction count is clicked", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Click on the reactions count area
    fireEvent.click(screen.getByText("9").closest("div"));

    // Should call setShowReactions
    expect(mockSetShowReactions).toHaveBeenCalled();
  });

  it("handles reaction toggle when clicking Like button", () => {
    render(
      <ActivitiesHolder
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Click Like button
    fireEvent.click(screen.getByText("Like").closest("button"));

    // Should call onReactionChange with 'like' (default reaction)
    expect(mockOnReactionChange).toHaveBeenCalledWith("like", null);
  });

  it("displays the current reaction when one is active", () => {
    render(
      <ActivitiesHolder
        initReactValue="celebrate"
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should show "Celebrate" text with the correct color
    const celebrateText = screen.getByText("Celebrate");
    expect(celebrateText).toBeInTheDocument();
    expect(celebrateText.style.color).toBe("yellow");
  });

  it("changes reaction when selecting a different one", () => {
    render(
      <ActivitiesHolder
        initReactValue="like"
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Click on the reaction picker selector (mocked to select 'celebrate')
    fireEvent.click(screen.getByTestId("select-celebrate"));

    // Should call onReactionChange with 'celebrate' as new and 'like' as previous
    expect(mockOnReactionChange).toHaveBeenCalledWith("celebrate", "like");
  });

  it("removes reaction when clicking the same reaction", () => {
    render(
      <ActivitiesHolder
        initReactValue="like"
        reactions={sampleReactions}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Click on the Like button
    fireEvent.click(screen.getByText("Like").closest("button"));

    // Should call onReactionChange with null as new and 'like' as previous
    expect(mockOnReactionChange).toHaveBeenCalledWith(null, "like");
  });

  it("handles empty reactions object gracefully", () => {
    render(
      <ActivitiesHolder
        reactions={{}}
        onReactionChange={mockOnReactionChange}
        setShowReactions={mockSetShowReactions}
        replies={0}
        setShowReplies={mockSetShowReplies}
      />,
    );

    // Should not display any reaction count
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });
});

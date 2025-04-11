import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ActivitiesHolder from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/ActivitiesHolder";

// Mock the dependencies
vi.mock("../../../../../../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    Like: {
      Icon: () => <div data-testid="like-icon">👍</div>,
      color: "blue",
      label: "Like",
    },
    Love: {
      Icon: () => <div data-testid="love-icon">❤️</div>,
      color: "red",
      label: "Love",
    },
    Celebrate: {
      Icon: () => <div data-testid="celebrate-icon">🎉</div>,
      color: "orange",
      label: "Celebrate",
    },
    Support: {
      Icon: () => <div data-testid="support-icon">🙌</div>,
      color: "purple",
      label: "Support",
    },
    Insightful: {
      Icon: () => <div data-testid="insightful-icon">💡</div>,
      color: "green",
      label: "Insightful",
    },
  },
}));

vi.mock(
  "../../../../../../pages/Feed/GenericComponents/ReactionPicker",
  () => ({
    default: ({ children, onSelectReaction }) => (
      <div
        data-testid="reaction-picker"
        onClick={() => onSelectReaction("Love")}
      >
        {children}
      </div>
    ),
  }),
);

vi.mock("@mui/material/CircularProgress", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("ActivitiesHolder Component", () => {
  // Common props for testing
  const defaultProps = {
    currentReaction: null,
    reactions: {
      Like: 5,
      Love: 3,
      Celebrate: 2,
      Support: 0,
      Insightful: 1,
    },
    handleReaction: vi.fn().mockResolvedValue(undefined),
    setShowReactions: vi.fn(),
    replies: 2,
    setShowReplies: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    render(<ActivitiesHolder {...defaultProps} />);

    // Check for "Like" text when no reaction is selected
    expect(screen.getByText("Like")).toBeInTheDocument();

    // Check for total reactions count
    expect(screen.getByText("11")).toBeInTheDocument();

    // Check for reply button
    expect(screen.getByText("Reply")).toBeInTheDocument();

    // Check for replies count
    expect(screen.getByText("2 replies")).toBeInTheDocument();
  });

  it("displays current reaction when one is selected", () => {
    const props = {
      ...defaultProps,
      currentReaction: "Love",
    };

    render(<ActivitiesHolder {...props} />);

    // Should show "Love" instead of "Like"
    expect(screen.getByText("Love")).toBeInTheDocument();
  });

  it("shows loading state during reaction submission", async () => {
    // Mock a slow reaction handler to test loading state
    const slowReactionHandler = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 100);
      });
    });

    const props = {
      ...defaultProps,
      handleReaction: slowReactionHandler,
    };

    render(<ActivitiesHolder {...props} />);

    // Click the like button
    const likeButton = screen.getByText("Like");
    await act(async () => {
      fireEvent.click(likeButton);
    });

    // Loading spinner should appear (briefly)
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Wait for the reaction to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  });

  it("calls handleReaction with correct params when adding a reaction", async () => {
    render(<ActivitiesHolder {...defaultProps} />);

    // Click the reaction button to add a Like
    await act(async () => {
      fireEvent.click(screen.getByText("Like"));
    });

    // handleReaction should be called with 'Like' as the new reaction and null as the old reaction
    expect(defaultProps.handleReaction).toHaveBeenCalledWith("Like", null);
  });

  it("calls handleReaction with correct params when changing reaction", async () => {
    const props = {
      ...defaultProps,
      currentReaction: "Like",
    };

    render(<ActivitiesHolder {...props} />);

    // Click the reaction picker to choose Love
    await act(async () => {
      fireEvent.click(screen.getByTestId("reaction-picker"));
    });

    // handleReaction should be called with 'Love' as new reaction and 'Like' as old reaction
    expect(props.handleReaction).toHaveBeenCalledWith("Love", "Like");
  });

  it("calls handleReaction with correct params when removing a reaction", async () => {
    const props = {
      ...defaultProps,
      currentReaction: "Like",
    };

    render(<ActivitiesHolder {...props} />);

    // Click the 'Like' button to remove the reaction
    await act(async () => {
      fireEvent.click(screen.getByText("Like"));
    });

    // handleReaction should be called with null (removing) and 'Like' as the old reaction
    expect(props.handleReaction).toHaveBeenCalledWith(null, "Like");
  });

  it("calls setShowReactions when clicking on the reactions count", () => {
    render(<ActivitiesHolder {...defaultProps} />);

    // Click on the reactions count
    fireEvent.click(screen.getByText("11"));

    // setShowReactions should be called
    expect(defaultProps.setShowReactions).toHaveBeenCalled();
  });

  it("calls setShowReplies when clicking on Reply button", () => {
    render(<ActivitiesHolder {...defaultProps} />);

    // Click on the Reply button
    fireEvent.click(screen.getByText("Reply"));

    // setShowReplies should be called
    expect(defaultProps.setShowReplies).toHaveBeenCalled();
  });

  it('displays singular "reply" text when there is only one reply', () => {
    const props = {
      ...defaultProps,
      replies: 1,
    };

    render(<ActivitiesHolder {...props} />);

    // Should show "1 reply" instead of "1 replies"
    expect(screen.getByText("1 reply")).toBeInTheDocument();
  });

  it("hides replies count when isReply is true", () => {
    const props = {
      ...defaultProps,
      isReply: true,
    };

    render(<ActivitiesHolder {...props} />);

    // Should not show the replies text
    expect(screen.queryByText("2 replies")).not.toBeInTheDocument();
  });

  it("displays top 3 reactions correctly", () => {
    render(<ActivitiesHolder {...defaultProps} />);

    // The top 3 reactions in defaultProps are Like, Love, and Celebrate
    expect(screen.getByTestId("like-icon")).toBeInTheDocument();
    expect(screen.getByTestId("love-icon")).toBeInTheDocument();
    expect(screen.getByTestId("celebrate-icon")).toBeInTheDocument();

    // Insightful is 4th so it shouldn't be shown
    expect(screen.queryByTestId("insightful-icon")).not.toBeInTheDocument();
  });

  it("handles error during reaction submission gracefully", async () => {
    // Mock a reaction handler that throws an error
    const errorReactionHandler = vi
      .fn()
      .mockRejectedValue(new Error("Failed to react"));

    const props = {
      ...defaultProps,
      handleReaction: errorReactionHandler,
    };

    // Mock console.log to verify error is logged
    const consoleSpy = vi.spyOn(console, "log");

    render(<ActivitiesHolder {...props} />);

    // Click the like button
    await act(async () => {
      fireEvent.click(screen.getByText("Like"));
    });

    // Check that error was logged
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    // UI should return to initial state after error
    expect(screen.getByText("Like")).toBeInTheDocument();
  });
});

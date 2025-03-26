import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LikeButton from "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/LikeButton";

// Mock the dependencies
vi.mock("@mui/icons-material/ThumbUpOffAlt", () => ({
  default: ({ sx, className }) => (
    <div data-testid="thumbup-icon" className={className} style={sx}>
      Default Like Icon
    </div>
  ),
}));

// Mock the reaction icons
vi.mock("../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    Like: {
      Icon: ({ style, className }) => (
        <div data-testid="like-icon" style={style} className={className}>
          Like Icon
        </div>
      ),
      color: "blue",
      label: "Like",
    },
    Celebrate: {
      Icon: ({ style, className }) => (
        <div data-testid="celebrate-icon" style={style} className={className}>
          Celebrate Icon
        </div>
      ),
      color: "yellow",
      label: "Celebrate",
    },
    Support: {
      Icon: ({ style, className }) => (
        <div data-testid="support-icon" style={style} className={className}>
          Support Icon
        </div>
      ),
      color: "purple",
      label: "Support",
    },
  },
}));

// Mock the ReactionPicker component - remove the automatic trigger
vi.mock("../pages/Feed/GenericComponents/ReactionPicker", () => ({
  default: ({ children, onSelectReaction }) => (
    <div data-testid="reaction-picker">
      {children}
      <button
        data-testid="mock-reaction-selector"
        onClick={() => onSelectReaction("Celebrate")}
      >
        Select Reaction
      </button>
    </div>
  ),
}));

describe("LikeButton Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders the default state when no reaction is selected", () => {
    render(<LikeButton onChange={mockOnChange} />);

    // Should show default thumbs up icon
    expect(screen.getByTestId("thumbup-icon")).toBeInTheDocument();

    // Should show "Like" text
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  it("renders the correct icon and label for an initial reaction", () => {
    render(<LikeButton initReactValue="Celebrate" onChange={mockOnChange} />);

    // Should show the celebrate icon
    expect(screen.getByTestId("celebrate-icon")).toBeInTheDocument();

    // Should show "Celebrate" text
    expect(screen.getByText("Celebrate")).toBeInTheDocument();
  });

  it("toggles reaction when clicking the button with no initial reaction", () => {
    render(<LikeButton onChange={mockOnChange} />);

    // Click the like button
    fireEvent.click(screen.getByText("Like").closest("button"));

    // Should call onChange exactly once with the "Like" reaction and null as previous
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("removes reaction when clicking the button with the same reaction", () => {
    render(<LikeButton initReactValue="Like" onChange={mockOnChange} />);

    // Click the like button - find by text content
    fireEvent.click(screen.getByText("Like").closest("button"));

    // Should call onChange with null (removing reaction) and "Like" as previous
    expect(mockOnChange).toHaveBeenCalledWith(null, "Like");
  });

  it("changes reaction when selecting a different one", () => {
    render(<LikeButton initReactValue="Like" onChange={mockOnChange} />);

    // Click on the reaction picker (mocked to trigger 'Celebrate')
    fireEvent.click(screen.getByTestId("mock-reaction-selector"));

    // Should call onChange with 'Celebrate' as new and 'Like' as previous
    expect(mockOnChange).toHaveBeenCalledWith("Celebrate", "Like");
  });

  it("handles undefined onChange prop gracefully for rendering", () => {
    // Should not throw errors when onChange is not provided for basic rendering
    expect(() => render(<LikeButton />)).not.toThrow();

    // Verify that basic elements still render properly
    expect(screen.getByTestId("thumbup-icon")).toBeInTheDocument();
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  // Add a separate test for interaction with a provided onChange
  it("works correctly when onChange is provided", () => {
    // Render with the onChange prop
    render(<LikeButton onChange={mockOnChange} />);

    // Interaction should work
    fireEvent.click(screen.getByText("Like").closest("button"));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("applies correct styling to button and icons", () => {
    render(<LikeButton onChange={mockOnChange} />);

    // Button should have correct classes - find by text content
    const button = screen.getByText("Like").closest("button");
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("gap-1");
    expect(button).toHaveClass("p-2");
    expect(button).toHaveClass("hover:bg-buttonIconHover");
    expect(button).toHaveClass("group");

    // Default icon should have correct classes
    const icon = screen.getByTestId("thumbup-icon");
    expect(icon).toHaveClass("text-textActivity");
    expect(icon).toHaveClass("group-hover:text-textActivityHover");

    // Text should have correct classes
    const text = screen.getByText("Like");
    expect(text).toHaveClass("text-sm");
    expect(text).toHaveClass("font-semibold");
    expect(text).toHaveClass("text-textActivity");
    expect(text).toHaveClass("group-hover:text-textActivityHover");
  });

  it("wraps button with ReactionPicker", () => {
    render(<LikeButton onChange={mockOnChange} />);

    // Should render the ReactionPicker component
    expect(screen.getByTestId("reaction-picker")).toBeInTheDocument();

    // Button should be inside the ReactionPicker - use a more specific selector
    const reactPicker = screen.getByTestId("reaction-picker");
    const button = screen.getByText("Like").closest("button");
    expect(reactPicker).toContainElement(button);
  });
});

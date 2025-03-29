import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentButton from "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/CommentButton";

// Mock the Material-UI icon
vi.mock("@mui/icons-material/ChatBubbleOutline", () => ({
  default: ({ sx, className }) => (
    <div data-testid="comment-icon" className={className} style={sx}>
      Comment Icon
    </div>
  ),
}));

describe("CommentButton Component", () => {
  it("renders correctly with icon and text", () => {
    render(<CommentButton setShowComments={() => {}} />);

    // Check if the icon is rendered
    expect(screen.getByTestId("comment-icon")).toBeInTheDocument();

    // Check if the text is rendered
    expect(screen.getByText("Comment")).toBeInTheDocument();

    // Check if they're inside a button element
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toContainElement(screen.getByTestId("comment-icon"));
    expect(button).toContainElement(screen.getByText("Comment"));
  });

  it("calls setShowComments when clicked", () => {
    const mockSetShowComments = vi.fn();
    render(<CommentButton setShowComments={mockSetShowComments} />);

    // Click the button
    fireEvent.click(screen.getByRole("button"));

    // Check if the function was called (without checking arguments)
    expect(mockSetShowComments).toHaveBeenCalledTimes(1);
    // No longer checking for arguments since the function is now called directly
  });

  it("has the correct styling classes", () => {
    render(<CommentButton setShowComments={() => {}} />);

    const button = screen.getByRole("button");

    // Check button styling
    expect(button).toHaveClass("p-2");
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("gap-1");
    expect(button).toHaveClass("group");
    expect(button).toHaveClass("hover:bg-buttonIconHover");

    // Check icon styling
    const icon = screen.getByTestId("comment-icon");
    expect(icon).toHaveClass("text-textActivity");
    expect(icon).toHaveClass("group-hover:text-textActivityHover");

    // Check text styling
    const text = screen.getByText("Comment").closest("span");
    expect(text).toHaveClass("text-sm");
    expect(text).toHaveClass("font-semibold");
    expect(text).toHaveClass("text-textActivity");
    // Note: There's a typo in the class name - textActivityHove instead of textActivityHover
    expect(text).toHaveClass("group-hover:text-textActivityHove");
  });

  it("handles missing props gracefully", () => {
    // This should log a console error but not crash
    expect(() => render(<CommentButton />)).not.toThrow();
  });

  it("renders with correct icon size", () => {
    render(<CommentButton setShowComments={() => {}} />);

    const icon = screen.getByTestId("comment-icon");
    // Check if the fontSize style was applied (from sx prop)
    expect(icon.style.fontSize).toBe("16px");
  });
});

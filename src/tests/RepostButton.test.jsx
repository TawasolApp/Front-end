import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RepostButton from "../pages/Feed/MainFeed/FeedPosts/PostCard/Activities/RepostButton";

// Mock the Material-UI icon
vi.mock("@mui/icons-material/Repeat", () => ({
  default: ({ sx, className }) => (
    <div data-testid="repeat-icon" className={className} style={sx}>
      Repeat Icon
    </div>
  ),
}));

describe("RepostButton Component", () => {
  it("renders correctly with icon and text", () => {
    render(<RepostButton />);

    // Check if the icon is rendered
    expect(screen.getByTestId("repeat-icon")).toBeInTheDocument();

    // Check if the text is rendered
    expect(screen.getByText("Repost")).toBeInTheDocument();

    // Check if they're inside a button element
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toContainElement(screen.getByTestId("repeat-icon"));
    expect(button).toContainElement(screen.getByText("Repost"));
  });

  it("has the correct styling classes", () => {
    render(<RepostButton />);

    const button = screen.getByRole("button");

    // Check button styling
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("p-2");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("gap-1");
    expect(button).toHaveClass("group");
    expect(button).toHaveClass("hover:bg-buttonIconHover");

    // Check icon styling
    const icon = screen.getByTestId("repeat-icon");
    expect(icon).toHaveClass("text-textActivity");
    expect(icon).toHaveClass("group-hover:text-textActivityHover");

    // Check text styling
    const text = screen.getByText("Repost").closest("span");
    expect(text).toHaveClass("text-sm");
    expect(text).toHaveClass("font-semibold");
    expect(text).toHaveClass("text-textActivity");
    expect(text).toHaveClass("group-hover:text-textActivityHover");
  });

  it("renders with correct icon size", () => {
    render(<RepostButton />);

    const icon = screen.getByTestId("repeat-icon");
    // Check if the fontSize style was applied (from sx prop)
    expect(icon.style.fontSize).toBe("16px");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SendButton from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/SendButton";

// Mock dependencies
vi.mock("@mui/icons-material/Send", () => ({
  default: (props) => (
    <span data-testid="send-icon" className={props.className} style={props.sx}>
      SendIcon
    </span>
  ),
}));

describe("SendButton Component", () => {
  it("renders the button with icon and text", () => {
    render(<SendButton />);

    // Check that the icon is rendered
    const icon = screen.getByTestId("send-icon");
    expect(icon).toBeInTheDocument();

    // Check that the text is rendered
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("has the correct styling applied to the button", () => {
    render(<SendButton />);

    // Check that the button has the expected styling classes
    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-2");
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("gap-1");
    expect(button).toHaveClass("hover:bg-buttonIconHover");
    expect(button).toHaveClass("hover:transition-all");
    expect(button).toHaveClass("duration-200");
    expect(button).toHaveClass("group");
  });

  it("applies correct styling to the icon", () => {
    render(<SendButton />);

    const icon = screen.getByTestId("send-icon");

    // Check styling classes for the icon
    expect(icon).toHaveClass("text-textActivity");
    expect(icon).toHaveClass("group-hover:text-textActivityHover");

    // Check that fontSize is set correctly in the sx prop
    expect(icon).toHaveAttribute("style");
    expect(icon.style).toHaveProperty("fontSize", "16px");
  });

  it("applies correct styling to the text", () => {
    render(<SendButton />);

    const text = screen.getByText("Send");

    // Check styling classes for the text
    expect(text).toHaveClass("text-sm");
    expect(text).toHaveClass("font-semibold");
    expect(text).toHaveClass("text-textActivity");
    expect(text).toHaveClass("group-hover:text-textActivityHover");
  });
});

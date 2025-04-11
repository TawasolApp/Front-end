import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ExpandableText from "../../../pages/UserProfile/Components/ReusableModals/ExpandableText";

// Set up global mocks for layout values
beforeEach(() => {
  vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({
    lineHeight: "20px", // simulate 20px line-height
  }));

  // Mock scrollHeight so component thinks it needs to collapse
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
      return 120; // simulate tall content
    },
  });
});

describe("ExpandableText", () => {
  const longText = `Line 1\nLine 2\nLine 3\nLine 4\nLine 5`;

  it("does not render when text is empty", () => {
    const { container } = render(<ExpandableText text="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders text and 'See more' when lines exceed maxLines", () => {
    render(<ExpandableText text={longText} maxLines={3} />);
    const toggle = screen.queryByText(/see more/i);
    expect(toggle).toBeInTheDocument();
  });

  it("expands text when 'See more' is clicked", () => {
    render(<ExpandableText text={longText} maxLines={3} />);
    const button = screen.getByText(/see more/i);
    fireEvent.click(button);
    expect(screen.getByText(/see less/i)).toBeInTheDocument();
  });

  it("collapses text when 'See less' is clicked", () => {
    render(<ExpandableText text={longText} maxLines={3} />);
    const button = screen.getByText(/see more/i);
    fireEvent.click(button); // Expand
    fireEvent.click(screen.getByText(/see less/i)); // Collapse
    expect(screen.getByText(/see more/i)).toBeInTheDocument();
  });

  it("does not show 'See more' if text fits within maxLines", () => {
    // simulate short text: 2 lines, each 20px -> 40px height
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 40;
      },
    });

    render(<ExpandableText text={"Short\nLine"} maxLines={5} />);
    expect(screen.queryByText(/see more/i)).not.toBeInTheDocument();
  });
});

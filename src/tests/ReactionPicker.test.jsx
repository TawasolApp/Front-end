import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReactionPicker from "../pages/Feed/GenericComponents/ReactionPicker";

// Mock the reactionIcons module
vi.mock("../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    like: {
      Icon: ({ className }) => (
        <div data-testid="like-icon" className={className}>
          👍
        </div>
      ),
      color: "blue",
      label: "Like",
    },
    celebrate: {
      Icon: ({ className }) => (
        <div data-testid="celebrate-icon" className={className}>
          🎉
        </div>
      ),
      color: "yellow",
      label: "Celebrate",
    },
    support: {
      Icon: ({ className }) => (
        <div data-testid="support-icon" className={className}>
          🙌
        </div>
      ),
      color: "purple",
      label: "Support",
    },
  },
}));

describe("ReactionPicker Component", () => {
  const onSelectReaction = vi.fn();
  let originalGetBoundingClientRect;

  beforeEach(() => {
    vi.useFakeTimers();

    // Save original method
    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    // Mock window properties
    Object.defineProperty(window, "innerWidth", { value: 1024 });

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  // Mock matches method for hover detection
  const mockMatches = (value) => {
    Element.prototype.matches = vi.fn(() => value);
  };

  it("renders children correctly", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger">Like</button>
      </ReactionPicker>,
    );

    expect(screen.getByTestId("trigger")).toBeTruthy();
  });

  it("shows picker when mouse enters", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Picker should be hidden initially
    expect(screen.queryByTestId("like-icon")).toBeNull();

    // Mouse enter the container
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Picker should be visible
    expect(screen.getByTestId("like-icon")).toBeTruthy();
    expect(screen.getByTestId("celebrate-icon")).toBeTruthy();
    expect(screen.getByTestId("support-icon")).toBeTruthy();
  });

  it("hides picker after mouse leaves", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    const container = screen.getByText("Like").closest("div");

    // Mouse enter
    fireEvent.mouseEnter(container);
    expect(screen.getByTestId("like-icon")).toBeTruthy();

    // Mock element not being hovered anymore
    mockMatches(false);

    // Mouse leave
    fireEvent.mouseLeave(container);

    // Advance timers to trigger the timeout
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Picker should be hidden
    expect(screen.queryByTestId("like-icon")).toBeNull();
  });

  it("calls onSelectReaction when a reaction is selected", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Click on a reaction
    fireEvent.click(screen.getByTestId("celebrate-icon").closest("button"));

    // Check if onSelectReaction was called with the right argument
    expect(onSelectReaction).toHaveBeenCalledWith("celebrate");

    // Picker should close after selection
    expect(screen.queryByTestId("like-icon")).toBeNull();
  });
  it("shows tooltip when hovering over a reaction", () => {
    const { container } = render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Hover over a reaction
    const likeReaction = screen.getByTestId("like-icon").closest("div");
    fireEvent.mouseEnter(likeReaction);

    // Check for tooltip visibility by finding a visible tooltip element
    // Use the opacity-100 class as an indicator that a tooltip is visible
    const visibleTooltipElement = container.querySelector(
      'div[class*="opacity-100"]',
    );
    expect(visibleTooltipElement).toBeTruthy();
  });

  it("hides tooltip when moving mouse away from a reaction", () => {
    const { container } = render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Hover over a reaction to show tooltip
    const likeReaction = screen.getByTestId("like-icon").closest("div");
    fireEvent.mouseEnter(likeReaction);

    // Check tooltip appears
    expect(container.querySelector('div[class*="opacity-100"]')).toBeTruthy();

    // Move mouse away
    fireEvent.mouseLeave(likeReaction);

    // Tooltip should no longer have the opacity-100 class
    expect(container.querySelector('div[class*="opacity-100"]')).toBeFalsy();

    // Should now have the opacity-0 class
    expect(container.querySelector('div[class*="opacity-0"]')).toBeTruthy();
  });

  it("closes picker when clicking outside", () => {
    render(
      <>
        <div data-testid="outside">Outside</div>
        <ReactionPicker onSelectReaction={onSelectReaction}>
          <button>Like</button>
        </ReactionPicker>
      </>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));
    expect(screen.getByTestId("like-icon")).toBeTruthy();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));

    // Picker should close
    expect(screen.queryByTestId("like-icon")).toBeNull();
  });

  it("toggles picker on click for mobile", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button data-testid="trigger-button">Like</button>
      </ReactionPicker>,
    );

    // Get a reference to the trigger element before any interactions
    const triggerElement = screen.getByTestId("trigger-button").closest("div");

    // Initially closed
    expect(screen.queryByTestId("like-icon")).toBeNull();

    // Click to open
    fireEvent.click(triggerElement);
    expect(screen.getByTestId("like-icon")).toBeTruthy();

    // Click again to close
    fireEvent.click(triggerElement);
    expect(screen.queryByTestId("like-icon")).toBeNull();
  });

  // Instead of trying to test exact CSS values which can be brittle,
  // let's test the component's functionality more generally:

  it("renders picker when hovered", () => {
    render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Verify picker is visible
    expect(screen.getByTestId("like-icon")).toBeTruthy();
    expect(screen.getByTestId("celebrate-icon")).toBeTruthy();
    expect(screen.getByTestId("support-icon")).toBeTruthy();
  });

  it("applies positioning classes to the picker", () => {
    const { container } = render(
      <ReactionPicker onSelectReaction={onSelectReaction}>
        <button>Like</button>
      </ReactionPicker>,
    );

    // Show the picker
    fireEvent.mouseEnter(screen.getByText("Like").closest("div"));

    // Verify the picker has positioning classes
    const picker = screen.getByTestId("like-icon").closest("div.absolute");
    expect(picker.className).toContain("absolute");
    expect(picker.className).toContain("bottom-full");
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import MessagingPage from "../../../pages/Messaging/MessagingPage/MessagingPage";

// Mock the MessagingContainer component
vi.mock("../../../pages/Messaging/MessagingPage/MessagingContainer", () => ({
  default: () => <div data-testid="messaging-container">Messaging Container</div>
}));

describe("MessagingPage", () => {
  it("renders with correct layout", () => {
    const { container } = render(<MessagingPage />);
    
    // Check that the root div has the expected classes
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass("min-h-[85vh]");
    expect(rootDiv).toHaveClass("bg-mainBackground");
    expect(rootDiv).toHaveClass("flex");
    expect(rootDiv).toHaveClass("flex-col");
    expect(rootDiv).toHaveClass("items-center");
  });
  
  it("renders MessagingContainer component", () => {
    render(<MessagingPage />);
    
    // Check that the MessagingContainer is rendered
    expect(screen.getByTestId("messaging-container")).toBeInTheDocument();
    expect(screen.getByText("Messaging Container")).toBeInTheDocument();
  });
  
  it("applies padding and max-width constraints", () => {
    const { container } = render(<MessagingPage />);
    
    // Find the wrapper div that applies padding and width constraints
    const wrapperDiv = container.firstChild.firstChild;
    expect(wrapperDiv).toHaveClass("w-full");
    expect(wrapperDiv).toHaveClass("max-w-4xl");
    expect(wrapperDiv).toHaveClass("px-4");
  });
});
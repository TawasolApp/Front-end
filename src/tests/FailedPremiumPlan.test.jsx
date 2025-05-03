import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import SubscriptionFailedPage from "../pages/PremiumPlan/FailedPremiumPlan";

// Mock the react-router-dom hooks
const mockNavigate = vi.fn();
const mockLocation = { state: {} };

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe("SubscriptionFailedPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the subscription failed message", () => {
    render(<SubscriptionFailedPage />);
    
    // Check that the heading is present
    expect(screen.getByText("Subscription Failed")).toBeInTheDocument();
    
    // Check that the explanation message is present
    expect(
      screen.getByText(
        "We couldn't process your subscription. Please try again or contact support if the problem persists."
      )
    ).toBeInTheDocument();
    
    // Check that the button is present
    expect(screen.getByText("Go to Home Page")).toBeInTheDocument();
  });

  it("navigates to feed page when the 'Go to Home Page' button is clicked", () => {
    render(<SubscriptionFailedPage />);
    
    // Find and click the button
    const homeButton = screen.getByText("Go to Home Page");
    fireEvent.click(homeButton);
    
    // Verify navigation was called with correct route
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/feed");
  });

  it("renders the failure icon", () => {
    const { container } = render(<SubscriptionFailedPage />);
    
    // Check that the SVG icon is present
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("text-red-600");
    
    // Check for the X mark path in the SVG
    const pathElement = container.querySelector("svg path");
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute("d", "M6 18L18 6M6 6l12 12");
  });

  it("applies correct styling to the container", () => {
    const { container } = render(<SubscriptionFailedPage />);
    
    // Check main container styling
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("min-h-screen");
    expect(mainContainer).toHaveClass("bg-mainBackground");
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("justify-center");
    
    // Check card styling
    const card = mainContainer.firstChild;
    expect(card).toHaveClass("bg-cardBackground");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("shadow-md");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("border-cardBorder");
  });

  it("renders the button with correct styling", () => {
    render(<SubscriptionFailedPage />);
    
    const button = screen.getByText("Go to Home Page");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("rounded-full");
    expect(button).toHaveClass("text-buttonSubmitText");
    expect(button).toHaveClass("bg-buttonSubmitEnable");
  });
});
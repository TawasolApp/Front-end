import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import PremiumAdvice from "../pages/PremiumPlan/PremiumAdvice";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

describe("PremiumAdvice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main heading correctly", () => {
    render(<PremiumAdvice />);
    
    expect(screen.getByText("Recruiter Lite users receive 3.7x more replies from candidates")).toBeInTheDocument();
  });

  it("displays the premium usage statement", () => {
    render(<PremiumAdvice />);
    
    expect(screen.getByText("Millions of members use Premium")).toBeInTheDocument();
  });

  it("shows the free trial information", () => {
    render(<PremiumAdvice />);
    
    expect(
      screen.getByText("Claim your 1-month free trial today, Cancel anytime. We'll send you a reminder 7 days before your trial ends.")
    ).toBeInTheDocument();
  });

  it("displays the 'Choose plan' text with progress bar", () => {
    const { container } = render(<PremiumAdvice />);
    
    expect(screen.getByText("Choose plan")).toBeInTheDocument();
    
    // Find the progress bar
    const progressBar = container.querySelector("div.h-2.bg-listSelected");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '90%' });
  });

  it("displays the price information in a highlighted box", () => {
    const { container } = render(<PremiumAdvice />);
    
    // Find the blue box container
    const priceBox = container.querySelector(".bg-blue-100");
    expect(priceBox).toBeInTheDocument();
    
    // Check the price heading
    expect(screen.getByText(/Price: EGP5,499.99\* 1-month free trial/)).toBeInTheDocument();
    
    // Check the price details
    expect(
      screen.getByText(/After your free month, pay as little as EGP5,499.99 EGP \(\$59.00\* \/ month \(save 16%\) when billed annually/)
    ).toBeInTheDocument();
  });

  it("has a 'Start free trial' button that navigates to checkout", () => {
    render(<PremiumAdvice />);
    
    const startButton = screen.getByText("Start free trial");
    expect(startButton).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(startButton);
    
    // Check that navigate was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  it("displays the secure checkout text", () => {
    render(<PremiumAdvice />);
    
    expect(screen.getByText("Secure checkout")).toBeInTheDocument();
  });

  it("shows the disclaimer about taxes", () => {
    render(<PremiumAdvice />);
    
    expect(screen.getByText("* Price shown excluding applicable taxes. Offer terms apply.")).toBeInTheDocument();
  });

  it("applies the correct styling to the call-to-action button", () => {
    render(<PremiumAdvice />);
    
    const button = screen.getByText("Start free trial");
    expect(button).toHaveClass("bg-buttonSubmitEnable");
    expect(button).toHaveClass("rounded-full");
    expect(button).toHaveClass("py-3");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("font-medium");
  });
});
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import CurrentPlanPage from "../pages/PremiumPlan/CurrentPlanPage";

// Mock dependencies
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const mockSelector = vi.fn();

// Mock axios instance
const mockAxiosDelete = vi.fn();
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    delete: (...args) => mockAxiosDelete(...args)
  }
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

// Mock react-redux
vi.mock("react-redux", () => ({
  useSelector: (selector) => mockSelector(selector),
  useDispatch: () => mockDispatch
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => "fake-token"),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("CurrentPlanPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to premium user
    mockSelector.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("redirects to premium page if user is not premium", () => {
    // Mock non-premium user
    mockSelector.mockReturnValue(false);
    
    render(<CurrentPlanPage />);
    
    // Expect navigation to premium page
    expect(mockNavigate).toHaveBeenCalledWith("/premium");
    
    // Component should not render anything
    expect(screen.queryByText("Your Current Plan")).not.toBeInTheDocument();
  });

  it("renders the current plan details for premium users", () => {
    render(<CurrentPlanPage />);
    
    // Check main heading
    expect(screen.getByText("Your Current Plan")).toBeInTheDocument();
    
    // Check plan details
    expect(screen.getByText("Your premium plan is:")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn Premium Career")).toBeInTheDocument();
    expect(screen.getByText("Best for job seekers and career growth")).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText("Go to Home")).toBeInTheDocument();
    expect(screen.getByText("Cancel Plan")).toBeInTheDocument();
  });

  it("navigates to feed when Go to Home button is clicked", () => {
    render(<CurrentPlanPage />);
    
    const goHomeButton = screen.getByText("Go to Home");
    fireEvent.click(goHomeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("/feed");
  });

  it("shows loading state and calls API when Cancel Plan is clicked", async () => {
    // Setup fake timers
    vi.useFakeTimers();
    
    // Mock successful cancellation response
    mockAxiosDelete.mockResolvedValueOnce({ status: 204 });
    
    render(<CurrentPlanPage />);
    
    const cancelButton = screen.getByText("Cancel Plan");
    fireEvent.click(cancelButton);
    
    // Check loading state
    expect(screen.getByText("Cancelling...")).toBeInTheDocument();
    
    // Check API call
    expect(mockAxiosDelete).toHaveBeenCalledWith("/premium-plan", {
      headers: { 'Authorization': 'Bearer fake-token' }
    });
    
    // Need to flush promises
    await vi.runAllTimersAsync();
    
    // Now check for success message
    expect(screen.getByText("Your premium plan has been cancelled successfully")).toBeInTheDocument();
    
    // Advance timers to trigger navigation timeout
    vi.advanceTimersByTime(2000);
    
    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/feed");
    
    // Clean up timers
    vi.useRealTimers();
  }, 10000); // Increased timeout

  it("shows error message when API returns an error", async () => {
    // Mock error response
    mockAxiosDelete.mockRejectedValueOnce({ 
      response: { status: 409 }
    });
    
    render(<CurrentPlanPage />);
    
    const cancelButton = screen.getByText("Cancel Plan");
    fireEvent.click(cancelButton);
    
    // Need to wait for the async operation to complete
    await vi.waitFor(() => {
      expect(screen.getByText("You have already cancelled your premium plan")).toBeInTheDocument();
    });
    
    // Button should no longer be in loading state
    expect(screen.getByText("Cancel Plan")).toBeInTheDocument();
  }, 10000); // Increased timeout

  it("shows network error when request fails", async () => {
    // Mock network error
    mockAxiosDelete.mockRejectedValueOnce({ 
      request: {}, // Just need this property to exist
      message: "Network Error"
    });
    
    render(<CurrentPlanPage />);
    
    const cancelButton = screen.getByText("Cancel Plan");
    fireEvent.click(cancelButton);
    
    // Wait for error message
    await vi.waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  }, 10000); // Increased timeout

  it("shows generic error message for other errors", async () => {
    // Mock error with no response or request properties
    mockAxiosDelete.mockRejectedValueOnce({
      message: "Unknown error"
    });
    
    render(<CurrentPlanPage />);
    
    const cancelButton = screen.getByText("Cancel Plan");
    fireEvent.click(cancelButton);
    
    // Wait for error message using partial text matcher
    await vi.waitFor(() => {
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });
  }, 10000); // Increased timeout
});
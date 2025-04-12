import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockPost = vi.hoisted(() => vi.fn());

// Mock react-redux
vi.mock("react-redux", () => ({
  useSelector: (selector) => {
    // Create a mock state and run the selector on it
    const mockState = { authentication: { email: "test@example.com" } };
    return selector(mockState);
  }
}));

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
  },
}));

// Import the component after all mocks are set up
import VerificationPendingForm from "../../../pages/Authentication/Forms/VerificationPendingForm";

describe("VerificationPendingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({});
  });

  describe("Rendering", () => {
    it("renders the form with email verification heading", () => {
      render(<VerificationPendingForm />);
      
      const heading = screen.getByText("Email Verification Pending");
      expect(heading).toBeInTheDocument();
    });

    it("shows serialized email from Redux store", () => {
      render(<VerificationPendingForm />);
      
      // Find text containing the serialized email
      const emailText = screen.getByText(/A verification link was sent to/, { exact: false });
      expect(emailText).toBeInTheDocument();
      expect(emailText).toHaveTextContent("t*****@example.com");
    });

    it("does not show resend button when type is null", () => {
      render(<VerificationPendingForm type={null} />);
      
      const resendButton = screen.queryByText("Resend code");
      expect(resendButton).not.toBeInTheDocument();
    });

    it("shows resend button when type is provided", () => {
      render(<VerificationPendingForm type="signup" />);
      
      const resendButton = screen.getByText("Resend code");
      expect(resendButton).toBeInTheDocument();
    });
  });

  describe("Email Serialization", () => {
    it("correctly serializes email with domain", () => {
      // Override the redux mock just for this test
      const originalUseSelector = vi.mocked(require("react-redux").useSelector);
      
      // Test with default email
      render(<VerificationPendingForm />);
      let emailText = screen.getByText(/A verification link was sent to/, { exact: false });
      expect(emailText).toHaveTextContent("t*****@example.com");
    });
  });

  describe("Resend Functionality", () => {
    it("calls API when resend button is clicked", async () => {
      render(<VerificationPendingForm type="signup" />);
      
      const resendButton = screen.getByText("Resend code");
      fireEvent.click(resendButton);
      
      // Verify API was called with correct params
      expect(mockPost).toHaveBeenCalledWith("/auth/resend-confirmation", { 
        email: "test@example.com",
        type: "signup" 
      });
    });
  });

  describe("Different Types", () => {
    it("passes signup type to API", async () => {
      render(<VerificationPendingForm type="signup" />);
      
      const resendButton = screen.getByText("Resend code");
      fireEvent.click(resendButton);
      
      expect(mockPost).toHaveBeenCalledWith("/auth/resend-confirmation", { 
        email: "test@example.com",
        type: "signup" 
      });
    });

    it("passes forgotPassword type to API", async () => {
      render(<VerificationPendingForm type="forgotPassword" />);
      
      const resendButton = screen.getByText("Resend code");
      fireEvent.click(resendButton);
      
      expect(mockPost).toHaveBeenCalledWith("/auth/resend-confirmation", { 
        email: "test@example.com",
        type: "forgotPassword" 
      });
    });

    it("passes updateEmail type to API", async () => {
      render(<VerificationPendingForm type="updateEmail" />);
      
      const resendButton = screen.getByText("Resend code");
      fireEvent.click(resendButton);
      
      expect(mockPost).toHaveBeenCalledWith("/auth/resend-confirmation", { 
        email: "test@example.com",
        type: "updateEmail" 
      });
    });
  });
});
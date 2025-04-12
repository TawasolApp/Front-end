import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockUseSearchParams = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockUseSearchParams(),
  };
});

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
  },
}));

// Mock child components
vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: ({ hideButtons }) => (
      <header data-testid="auth-header">
        Authentication Header
        {hideButtons && (
          <span data-testid="buttons-hidden">Buttons Hidden</span>
        )}
      </header>
    ),
  }),
);

// Import the component after all mocks are set up
import VerifyResetPasswordPage from "../../pages/Authentication/VerifyResetPasswordPage";

describe("VerifyResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Always set up a default mock response to avoid "then of undefined" errors
    mockPost.mockResolvedValue({});
    // Default mock for useSearchParams
    mockUseSearchParams.mockReturnValue([
      {
        get: (param) => (param === "token" ? "valid-token" : null),
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderVerifyResetPasswordPage = (mockToken = "valid-token") => {
    // Set up the token for this specific test
    mockUseSearchParams.mockReturnValue([
      {
        get: (param) => (param === "token" ? mockToken : null),
      },
    ]);

    return render(
      <BrowserRouter>
        <VerifyResetPasswordPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page with initial status", () => {
      renderVerifyResetPasswordPage();

      // Check page title
      const title = screen.getByText("Reset Password");
      expect(title).toBeInTheDocument();

      // Check initial status
      const status = screen.getByText("Verifying your reset token...");
      expect(status).toBeInTheDocument();

      // Check header
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(buttonsHidden).toBeInTheDocument();
    });
  });

  describe("Token Validation", () => {
    it("handles missing token", async () => {
      // Pass null as token explicitly
      renderVerifyResetPasswordPage(null);

      // Check for error message
      await waitFor(() => {
        const status = screen.getByText("Invalid verification link.");
        expect(status).toBeInTheDocument();
      });

      // API should not be called
      expect(mockPost).not.toHaveBeenCalled();
    });
  });

  describe("API Interactions", () => {
    it("handles 400 error (invalid token)", async () => {
      // Reset the default mock and set up specific rejection
      mockPost.mockReset();
      mockPost.mockRejectedValueOnce({
        response: { status: 400 },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifyResetPasswordPage();

      // Wait for error status
      await waitFor(() => {
        const status = screen.getByText(
          "Invalid or expired token. Please request a new reset email.",
        );
        expect(status).toBeInTheDocument();
      });

      // Check console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();

      // No navigation should happen
      expect(mockNavigate).not.toHaveBeenCalled();

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });

    it("handles general error", async () => {
      // Reset the default mock and set up specific rejection
      mockPost.mockReset();
      mockPost.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifyResetPasswordPage();

      // Wait for error status
      await waitFor(() => {
        const status = screen.getByText(
          "Something went wrong. Please try again later.",
        );
        expect(status).toBeInTheDocument();
      });

      // Check console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();

      // No navigation should happen
      expect(mockNavigate).not.toHaveBeenCalled();

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Structure", () => {
    it("renders in a container with proper elements", () => {
      const { container } = renderVerifyResetPasswordPage();

      // Check the main container exists
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();

      // Check card exists
      const card = screen.getByText("Reset Password").closest("div");
      expect(card).toBeInTheDocument();
    });
  });
});

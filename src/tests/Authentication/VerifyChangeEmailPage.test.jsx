import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
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
    get: (...args) => mockGet(...args),
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
import VerifyChangeEmailPage from "../../pages/Authentication/VerifyChangeEmailPage";

describe("VerifyChangeEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Always set up a default mock response to avoid "then of undefined" errors
    mockGet.mockResolvedValue({});
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

  const renderVerifyChangeEmailPage = (mockToken = "valid-token") => {
    // Set up the token for this specific test
    mockUseSearchParams.mockReturnValue([
      {
        get: (param) => (param === "token" ? mockToken : null),
      },
    ]);

    return render(
      <BrowserRouter>
        <VerifyChangeEmailPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page with initial status", () => {
      renderVerifyChangeEmailPage();

      // Check page title
      const title = screen.getByText("Email Verification");
      expect(title).toBeInTheDocument();

      // Check initial status
      const status = screen.getByText("Verifying your email...");
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
      renderVerifyChangeEmailPage(null);

      // Check for error message
      await waitFor(() => {
        const status = screen.getByText("Invalid verification link.");
        expect(status).toBeInTheDocument();
      });

      // API should not be called
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe("API Interactions", () => {
    it("handles 400 error (invalid token)", async () => {
      // Reset the default mock and set up specific rejection
      mockGet.mockReset();
      mockGet.mockRejectedValueOnce({
        response: { status: 400 },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifyChangeEmailPage();

      // Wait for error status
      await waitFor(() => {
        const status = screen.getByText(
          "Invalid or expired token. Please request a new verification email.",
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

    it("handles 404 error (user not found)", async () => {
      // Reset the default mock and set up specific rejection
      mockGet.mockReset();
      mockGet.mockRejectedValueOnce({
        response: { status: 404 },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifyChangeEmailPage();

      // Wait for error status
      await waitFor(() => {
        const status = screen.getByText(
          "User not found. Please contact support.",
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
      mockGet.mockReset();
      mockGet.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifyChangeEmailPage();

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
      const { container } = renderVerifyChangeEmailPage();

      // Check the main container exists
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();

      // Check card exists
      const card = screen.getByText("Email Verification").closest("div");
      expect(card).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
const mockUseSearchParams = vi.hoisted(() =>
  vi
    .fn()
    .mockReturnValue([
      { get: (param) => (param === "token" ? "valid-token" : null) },
    ]),
);

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

// Mock setTimeout
vi.mock("global", () => ({
  setTimeout: (callback, delay) => {
    callback();
    return 123; // Mock timer id
  },
}));

// Import the component after all mocks are set up
import VerifySignUpPage from "../../pages/Authentication/VerifySignUpPage";

describe("VerifySignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderVerifySignUpPage = () => {
    return render(
      <BrowserRouter>
        <VerifySignUpPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page with initial status", () => {
      // Mock successful API response
      mockGet.mockResolvedValueOnce({});

      renderVerifySignUpPage();

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
      // Mock missing token
      mockUseSearchParams.mockReturnValueOnce([{ get: () => null }]);

      renderVerifySignUpPage();

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
      // Mock API error
      mockGet.mockRejectedValueOnce({
        response: { status: 400 },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifySignUpPage();

      // Wait for error status
      await waitFor(() => {
        const status = screen.getByText("Invalid or expired token.");
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
      // Mock general API error
      mockGet.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderVerifySignUpPage();

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
      mockGet.mockResolvedValueOnce({});
      const { container } = renderVerifySignUpPage();

      // Check the main container exists
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();

      // Check card exists
      const card = screen.getByText("Email Verification").closest("div");
      expect(card).toBeInTheDocument();
    });
  });
});

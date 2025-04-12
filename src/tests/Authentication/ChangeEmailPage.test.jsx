import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSetEmail = vi.hoisted(() => vi.fn());
const mockPatch = vi.hoisted(() => vi.fn());
const mockSetEmailError = vi.hoisted(() => vi.fn());
const mockSetCurrentPasswordError = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock authentication slice
vi.mock("../../store/authenticationSlice", () => ({
  setEmail: (email) => mockSetEmail(email),
}));

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    patch: (...args) => mockPatch(...args),
  },
}));

// Mock child components
vi.mock("../../pages/Authentication/Forms/ChangeEmailForm", () => ({
  default: ({ onSubmit }) => {
    // Create test functions that we can call to test the onSubmit function
    const testSubmit = (scenario) => {
      const newEmail = "new@example.com";
      const currentPassword = "password123";

      // Call the onSubmit function passed as a prop with our global mock functions
      onSubmit(
        newEmail,
        currentPassword,
        mockSetEmailError,
        mockSetCurrentPasswordError,
      );
    };

    return (
      <div data-testid="change-email-form">
        <button
          onClick={() => testSubmit("success")}
          data-testid="test-submit-success"
        >
          Test Submit Success
        </button>
        <button
          onClick={() => testSubmit("error-400")}
          data-testid="test-submit-error-400"
        >
          Test Submit Error 400
        </button>
        <button
          onClick={() => testSubmit("error-401")}
          data-testid="test-submit-error-401"
        >
          Test Submit Error 401
        </button>
        <button
          onClick={() => testSubmit("error-409")}
          data-testid="test-submit-error-409"
        >
          Test Submit Error 409
        </button>
        <button
          onClick={() => testSubmit("error-other")}
          data-testid="test-submit-error-other"
        >
          Test Submit Error Other
        </button>
      </div>
    );
  },
}));

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
import ChangeEmailPage from "../../pages/Authentication/ChangeEmailPage";

describe("ChangeEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderChangeEmailPage = () => {
    return render(
      <BrowserRouter>
        <ChangeEmailPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderChangeEmailPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the AuthenticationHeader with hideButtons prop", () => {
      renderChangeEmailPage();
      const header = screen.getByTestId("auth-header");
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(header).toBeInTheDocument();
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("renders the ChangeEmailForm component", () => {
      renderChangeEmailPage();
      const form = screen.getByTestId("change-email-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("handles successful email update", async () => {
      // Mock successful API response
      mockPatch.mockResolvedValueOnce({});

      // Spy on console.log
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      renderChangeEmailPage();

      // Trigger a successful submission
      screen.getByTestId("test-submit-success").click();

      // Wait for async operations
      await waitFor(() => {
        // Verify API call
        expect(mockPatch).toHaveBeenCalledWith("/users/request-email-update", {
          newEmail: "new@example.com",
          password: "password123",
        });

        // Verify Redux dispatch
        expect(mockDispatch).toHaveBeenCalledWith(
          mockSetEmail("new@example.com"),
        );

        // Verify console.log
        expect(consoleLogSpy).toHaveBeenCalledWith("requested update email");

        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith(
          "/auth/verification-pending",
          {
            state: { type: "updateEmail" },
          },
        );
      });

      // Clean up spy
      consoleLogSpy.mockRestore();
    });

    it("handles 400 error (incorrect password)", async () => {
      // Mock API error with 400 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 400 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 400 error
      screen.getByTestId("test-submit-error-400").click();

      // Wait for async operations
      await waitFor(() => {
        // Verify error was set
        expect(mockPatch).toHaveBeenCalled();
        expect(mockSetCurrentPasswordError).toHaveBeenCalledWith(
          "Incorrect password.",
        );
      });
    });

    it("handles 401 error (unauthorized)", async () => {
      // Mock API error with 401 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 401 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 401 error
      screen.getByTestId("test-submit-error-401").click();

      // Wait for async operations
      await waitFor(() => {
        // Verify error was set
        expect(mockPatch).toHaveBeenCalled();
        expect(mockSetCurrentPasswordError).toHaveBeenCalledWith(
          "Unauthorized.",
        );
      });
    });

    it("handles 409 error (email exists)", async () => {
      // Mock API error with 409 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 409 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 409 error
      screen.getByTestId("test-submit-error-409").click();

      // Wait for async operations
      await waitFor(() => {
        // Verify error was set
        expect(mockPatch).toHaveBeenCalled();
        expect(mockSetEmailError).toHaveBeenCalledWith("Email already exists.");
      });
    });

    it("handles other errors", async () => {
      // Mock other API error
      mockPatch.mockRejectedValueOnce(new Error("Network error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderChangeEmailPage();

      // Trigger the submission that will result in an unexpected error
      screen.getByTestId("test-submit-error-other").click();

      // Wait for async operations
      await waitFor(() => {
        // Verify error was logged
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(mockSetEmailError).toHaveBeenCalledWith(
          "An unexpected error occurred. Please try again.",
        );
      });

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });

  // Removed className checks as requested
  describe("UI Structure", () => {
    it("renders in a container with the change email form", () => {
      const { container } = renderChangeEmailPage();
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("has the form in a wrapper div", () => {
      renderChangeEmailPage();
      const form = screen.getByTestId("change-email-form");
      const formContainer = form.closest("div");
      expect(formContainer).toBeInTheDocument();
    });
  });
});

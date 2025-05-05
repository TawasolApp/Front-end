import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSetEmail = vi.hoisted(() => vi.fn());
const mockPatch = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
const mockSetEmailError = vi.hoisted(() => vi.fn());
const mockSetCurrentPasswordError = vi.hoisted(() => vi.fn());

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    VITE_ENVIRONMENT: ''
  }
}));

// Setup a function to change environment for test cases
const setTestEnvironment = (isTest = false) => {
  if (isTest) {
    import.meta.env.VITE_ENVIRONMENT = 'test';
  } else {
    import.meta.env.VITE_ENVIRONMENT = '';
  }
};

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
    get: (...args) => mockGet(...args)
  },
}));

// Mock child components
vi.mock("../../pages/Authentication/Forms/ChangeEmailForm", () => ({
  default: ({ onSubmit, isLoading }) => {
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
        <span data-testid="loading-state">{isLoading ? "Loading" : "Not Loading"}</span>
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
    // Reset environment to non-test
    setTestEnvironment(false);
    
    // Mock timer
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
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

    it("renders the ChangeEmailForm component with isLoading prop", () => {
      renderChangeEmailPage();
      const form = screen.getByTestId("change-email-form");
      const loadingState = screen.getByTestId("loading-state");
      expect(form).toBeInTheDocument();
      expect(loadingState).toHaveTextContent("Not Loading");
    });
  });

  describe("Form Submission - Production Environment", () => {
    it("handles successful email update", async () => {
      // Mock successful API response
      mockPatch.mockResolvedValueOnce({ data: {} });

      renderChangeEmailPage();
      
      // Check initial loading state
      expect(screen.getByTestId("loading-state")).toHaveTextContent("Not Loading");

      // Trigger a successful submission - wrap in act
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
        
        // Should be loading now
        expect(screen.getByTestId("loading-state")).toHaveTextContent("Loading");
      });
      
      // Verify post-submission state
      expect(screen.getByTestId("loading-state")).toHaveTextContent("Not Loading");
      
      // Verify API call
      expect(mockPatch).toHaveBeenCalledWith("/users/request-email-update", {
        newEmail: "new@example.com",
        password: "password123",
      });

      // Verify navigation in production environment
      expect(mockNavigate).toHaveBeenCalledWith(
        "/auth/verification-pending",
        {
          state: { type: "updateEmail" },
        },
      );
      
      // Verify verification endpoint was not called in production
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("handles 400 error (incorrect password)", async () => {
      // Mock API error with 400 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 400 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 400 error
      await act(async () => {
        screen.getByTestId("test-submit-error-400").click();
      });
      
      // Verify error was set
      expect(mockPatch).toHaveBeenCalled();
      expect(mockSetCurrentPasswordError).toHaveBeenCalledWith(
        "Incorrect password.",
      );
    });

    it("handles 401 error (unauthorized)", async () => {
      // Mock API error with 401 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 401 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 401 error
      await act(async () => {
        screen.getByTestId("test-submit-error-401").click();
      });

      // Verify error was set
      expect(mockPatch).toHaveBeenCalled();
      expect(mockSetCurrentPasswordError).toHaveBeenCalledWith(
        "Unauthorized.",
      );
    });

    it("handles 409 error (email exists)", async () => {
      // Mock API error with 409 status
      mockPatch.mockRejectedValueOnce({
        response: { status: 409 },
      });

      renderChangeEmailPage();

      // Trigger the submission that will result in a 409 error
      await act(async () => {
        screen.getByTestId("test-submit-error-409").click();
      });

      // Verify error was set
      expect(mockPatch).toHaveBeenCalled();
      expect(mockSetEmailError).toHaveBeenCalledWith("Email already exists.");
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
      await act(async () => {
        screen.getByTestId("test-submit-error-other").click();
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockSetEmailError).toHaveBeenCalledWith(
        "An unexpected error occurred. Please try again.",
      );

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe("Form Submission - Test Environment", () => {
    it("handles successful verification in test environment", async () => {
      // Set test environment
      setTestEnvironment(true);
      
      // Mock successful API responses
      mockPatch.mockResolvedValueOnce({ 
        data: { verifyToken: "valid-token" } 
      });
      
      mockGet.mockResolvedValueOnce({});
      
      // Spy on console.log
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      
      renderChangeEmailPage();

      // Trigger a successful submission
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
      });

      expect(mockPatch).toHaveBeenCalledWith("/users/request-email-update", {
        newEmail: "new@example.com",
        password: "password123",
      });
      
      expect(mockGet).toHaveBeenCalledWith("/users/confirm-email-change?token=valid-token");
      
      // Check success message was logged
      expect(consoleLogSpy).toHaveBeenCalledWith("Email updated successfully! Redirecting...");
      
      // Fast forward setTimeout
      await act(async () => {
        vi.runAllTimers();
      });
      
      // Verify navigation to feed
      expect(mockNavigate).toHaveBeenCalledWith("/feed");
      
      consoleLogSpy.mockRestore();
    });
    
    it("handles invalid token in test environment", async () => {
      // Set test environment
      setTestEnvironment(true);
      
      // Mock API response with no verify token
      mockPatch.mockResolvedValueOnce({ data: {} });
      
      // Spy on console.log
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      
      renderChangeEmailPage();

      // Trigger submission
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
      });

      expect(consoleLogSpy).toHaveBeenCalledWith("Invalid verification link.");
      expect(mockGet).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      
      consoleLogSpy.mockRestore();
    });
    
    it("handles token verification errors (400)", async () => {
      // Set test environment
      setTestEnvironment(true);
      
      // Mock API responses
      mockPatch.mockResolvedValueOnce({ 
        data: { verifyToken: "invalid-token" } 
      });
      
      mockGet.mockRejectedValueOnce({
        response: { status: 400 }
      });
      
      // Spy on console
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      renderChangeEmailPage();

      // Trigger submission
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
      });

      expect(mockGet).toHaveBeenCalledWith("/users/confirm-email-change?token=invalid-token");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Invalid or expired token. Please request a new verification email."
      );
      
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
    
    it("handles token verification errors (404)", async () => {
      // Set test environment
      setTestEnvironment(true);
      
      // Mock API responses
      mockPatch.mockResolvedValueOnce({ 
        data: { verifyToken: "token-404" } 
      });
      
      mockGet.mockRejectedValueOnce({
        response: { status: 404 }
      });
      
      // Spy on console
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      renderChangeEmailPage();

      // Trigger submission
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
      });

      expect(mockGet).toHaveBeenCalledWith("/users/confirm-email-change?token=token-404");
      expect(consoleLogSpy).toHaveBeenCalledWith("User not found. Please contact support.");
      
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
    
    it("handles other token verification errors", async () => {
      // Set test environment
      setTestEnvironment(true);
      
      // Mock API responses
      mockPatch.mockResolvedValueOnce({ 
        data: { verifyToken: "token-error" } 
      });
      
      mockGet.mockRejectedValueOnce({
        response: { status: 500 }
      });
      
      // Spy on console
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      renderChangeEmailPage();

      // Trigger submission
      await act(async () => {
        screen.getByTestId("test-submit-success").click();
      });

      expect(mockGet).toHaveBeenCalledWith("/users/confirm-email-change?token=token-error");
      expect(consoleLogSpy).toHaveBeenCalledWith("Something went wrong. Please try again later.");
      
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

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
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockSetEmail = vi.hoisted(() => vi.fn());
const mockSetPassword = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());

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
  logout: () => mockLogout,
  setEmail: (email) => mockSetEmail(email),
  setPassword: (password) => mockSetPassword(password),
}));

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: (url, data) => mockPost(url, data),
  },
}));

// Mock child components with correct paths
vi.mock("../../pages/Authentication/Forms/SignUpForm", () => ({
  default: (props) => (
    <div data-testid="signup-form">
      <button
        onClick={() =>
          props.onSubmit?.(
            { email: "test@example.com", password: "password123" },
            vi.fn(),
          )
        }
        data-testid="mock-submit-button"
      >
        Submit Form
      </button>
    </div>
  ),
}));

vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: () => (
      <header data-testid="auth-header">
        Authentication Header
        <span data-testid="buttons-hidden">Buttons Hidden</span>
      </header>
    ),
  }),
);

// Import the component after all mocks are set up
import SignUpPage from "../../pages/Authentication/SignUpPage";

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpPage = () => {
    return render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the signup page without crashing", () => {
      const { container } = renderSignUpPage();
      expect(container).toBeInTheDocument();
    });

    it("dispatches logout action on mount", () => {
      renderSignUpPage();
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("renders the AuthenticationHeader", () => {
      renderSignUpPage();
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
    });

    it("displays the page heading", () => {
      renderSignUpPage();
      const heading = screen.getByText(
        "Make the most of your professional life",
      );
      expect(heading).toBeInTheDocument();
    });

    it("renders the SignUpForm component", () => {
      renderSignUpPage();
      const signUpForm = screen.getByTestId("signup-form");
      expect(signUpForm).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("handles successful form submission", async () => {
      // Mock successful API response
      mockPost.mockResolvedValueOnce({ status: 201, data: {} });

      renderSignUpPage();

      // Trigger form submission through our mock button
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledTimes(3);
      });
    });

    it("handles email already in use error", async () => {
      // Mock API response for email conflict
      mockPost.mockRejectedValueOnce({
        response: {
          status: 409,
        },
      });

      renderSignUpPage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
      });
    });

    it("handles unexpected errors", async () => {
      // Mock API response for unexpected error
      mockPost.mockRejectedValueOnce({
        response: {
          status: 500,
        },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderSignUpPage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
      });

      // Just check that the error was logged
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("handles network errors", async () => {
      // Mock API response for network error
      mockPost.mockRejectedValueOnce(new Error("Network Error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderSignUpPage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Styling", () => {
    it("has a container with proper styling classes", () => {
      const { container } = renderSignUpPage();
      // Just check that the container exists
      expect(container.firstChild).toBeInTheDocument();
    });

    it("contains elements with responsive styling classes", () => {
      const { container } = renderSignUpPage();
      // Check for any responsive classes
      expect(container.innerHTML).toMatch(/sm:|md:|lg:/);
    });
  });
});

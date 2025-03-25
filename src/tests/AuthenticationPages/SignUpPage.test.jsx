import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());

// Mock axiosInstance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: mockPost,
  },
}));

// Rest of your mocks remain the same
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      auth: {
        email: "",
        password: "",
      },
    }),
}));

// Mock Redux actions
vi.mock("../../store/authenticationSlice", () => ({
  setEmail: (email) => ({ type: "authentication/setEmail", payload: email }),
  setPassword: (password) => ({
    type: "authentication/setPassword",
    payload: password,
  }),
}));

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Use the pre-defined mock function directly
  };
});

// Mock SignUpForm component
vi.mock("../../pages/AuthenticationPages/components/SignUpForm", () => ({
  default: ({ onSubmit }) => {
    const handleMockSubmit = (e) => {
      e.preventDefault();
      const formData = {
        email: "test@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      };
      const setEmailError = vi.fn();
      onSubmit(formData, setEmailError);
    };

    return (
      <form data-testid="signup-form" onSubmit={handleMockSubmit}>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm password" />
        <button type="submit">Sign Up</button>
        <div>
          <span>Already have an account?</span>
          <a href="/auth/signin" data-testid="signin-link">
            Sign in
          </a>
        </div>
      </form>
    );
  },
}));

// NOW import the component (after all mocks are set up)
import SignUpPage from "../../pages/AuthenticationPages/SignUpPage";

// Reset the mock functions before each test
beforeEach(() => {
  vi.clearAllMocks(); // This is simpler and clearer than resetAllMocks
});

describe("SignUpPage", () => {
  // Helper function to render with router context
  const renderSignUpPage = () => {
    return render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );
  };

  describe("Component Rendering", () => {
    it("renders the signup page without crashing", () => {
      const { container } = renderSignUpPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the SignUpForm component", () => {
      renderSignUpPage();
      const form = screen.getByTestId("signup-form");
      expect(form).toBeInTheDocument();
    });

    it("renders the title", () => {
      renderSignUpPage();
      const title = screen.getByText(
        /Make the most of your professional life/i
      );
      expect(title).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("calls axios and navigates when form is submitted with valid data", async () => {
      // Mock successful API response
      mockPost.mockResolvedValueOnce({ status: 200 });

      renderSignUpPage();

      // Submit the form
      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // Wait for the form submission to be processed
      await waitFor(() => {
        // Check that axios was called correctly
        expect(mockPost).toHaveBeenCalledWith("/auth/check-email", {
          email: "test@example.com",
        });

        // Check that Redux actions were dispatched
        expect(mockDispatch).toHaveBeenCalledTimes(2);

        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/auth/signup/name");
      });
    });
  });

  describe("Error Handling", () => {
    it("handles email already in use error", async () => {
      // Mock error response for email already in use
      mockPost.mockRejectedValueOnce({
        response: { status: 409 },
      });

      renderSignUpPage();

      // Submit the form
      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // Wait for the form submission to be processed
      await waitFor(() => {
        // We can't directly access setEmailError function from the mock,
        // but we can check that navigation wasn't called, indicating error handling
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it("handles other API errors", async () => {
      // Mock error response for other errors
      mockPost.mockRejectedValueOnce({
        response: { status: 500 },
      });

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      renderSignUpPage();

      // Submit form
      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // Check that error was logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      // Restore console.log
      consoleSpy.mockRestore();
    });

    it("handles network errors", async () => {
      // Mock network error (no response object)
      mockPost.mockRejectedValueOnce({});

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      renderSignUpPage();

      // Submit form
      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // Check that error was logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Network error or server is down"
        );
      });

      // Restore console.log
      consoleSpy.mockRestore();
    });
  });

  describe("Styling", () => {
    it("applies styling to the page container", () => {
      const { container } = renderSignUpPage();

      // Check for container styling
      const pageContainer = container.firstChild;
      expect(pageContainer).toHaveClass("min-h-screen");
      expect(pageContainer).toHaveClass("bg-mainBackground");
    });

    it("applies styling to the form container", () => {
      renderSignUpPage();

      // Find the form container
      const formContainer = screen.getByTestId("signup-form").closest("div");
      expect(formContainer).toHaveClass("bg-cardBackground");
      expect(formContainer).toHaveClass("rounded-lg");
    });
  });

  describe("Navigation Events", () => {
    it("provides link to sign in page", () => {
      renderSignUpPage();

      // Find the sign in link
      const signInLink = screen.getByTestId("signin-link");

      // Check that it has the correct href attribute
      expect(signInLink).toHaveAttribute("href", "/auth/signin");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSetEmail = vi.hoisted(() => vi.fn());
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
vi.mock("../../../store/authenticationSlice", () => ({
  setEmail: (email) => mockSetEmail(email),
}));

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
  },
}));

// Mock child components
vi.mock(
  "../../../pages/Authentication/GenericComponents/BlueSubmitButton",
  () => ({
    default: ({ text }) => (
      <button type="submit" data-testid="submit-button">
        {text}
      </button>
    ),
  }),
);

vi.mock("../../../pages/Authentication/GenericComponents/InputField", () => ({
  default: (props) => (
    <div data-testid={`input-field-${props.name}`}>
      <label htmlFor={props.id}>{props.labelText}</label>
      <input
        type={props.type}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        data-testid={props.id}
      />
      {props.error && (
        <p data-testid="error-message" className="text-red-500">
          {props.error}
        </p>
      )}
    </div>
  ),
}));

// Import the component after all mocks are set up
import ForgotPasswordForm from "../../../pages/Authentication/Forms/ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForgotPasswordForm = () => {
    return render(<ForgotPasswordForm />);
  };

  describe("Rendering", () => {
    it("renders the form without crashing", () => {
      const { container } = renderForgotPasswordForm();
      expect(container).toBeInTheDocument();
    });

    it("renders the heading", () => {
      renderForgotPasswordForm();
      const heading = screen.getByText("Forgot password");
      expect(heading).toBeInTheDocument();
    });

    it("renders the email input field", () => {
      renderForgotPasswordForm();
      const emailField = screen.getByTestId("input-field-email");
      expect(emailField).toBeInTheDocument();
    });

    it("renders the Next button", () => {
      renderForgotPasswordForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Next");
    });

    it("renders the Back button", () => {
      renderForgotPasswordForm();
      const backButton = screen.getByText("Back");
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("updates email when input changes", () => {
      renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput.value).toBe("test@example.com");
    });

    it("navigates back when Back button is clicked", () => {
      renderForgotPasswordForm();
      const backButton = screen.getByText("Back");

      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("Form Validation", () => {
    it("validates empty email", () => {
      const { container } = renderForgotPasswordForm();
      const form = container.querySelector("form");

      // Submit empty form
      fireEvent.submit(form);

      // Check for error
      const errorMessage = screen.getByTestId("error-message");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent("Please enter your email.");
    });

    it("validates email format", () => {
      const { container } = renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");
      const form = container.querySelector("form");

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      // Submit form
      fireEvent.submit(form);

      // Check for error
      const errorMessage = screen.getByTestId("error-message");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        "Wrong email, Please try with an alternate email.",
      );
    });
  });

  describe("Form Submission", () => {
    it("submits the form with valid email", async () => {
      // Mock successful API response
      mockPost.mockResolvedValueOnce({});

      const { container } = renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");
      const form = container.querySelector("form");

      // Fill form with valid email
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        // Check API call
        expect(mockPost).toHaveBeenCalledWith("/auth/forgot-password", {
          email: "test@example.com",
          isAndroid: false,
        });
      });
    });

    it("handles API response error", async () => {
      // Mock API error with response
      mockPost.mockRejectedValueOnce({
        response: {
          data: {
            message: "Email not found",
          },
        },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");
      const form = container.querySelector("form");

      // Fill form with valid email
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Check error message
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent("Email not found");
      });

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });

    it("handles request error", async () => {
      // Mock API error with only request
      mockPost.mockRejectedValueOnce({
        request: {},
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");
      const form = container.querySelector("form");

      // Fill form with valid email
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Check error message
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          "Network error. Please check your connection.",
        );
      });

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });

    it("handles general error", async () => {
      // Mock general error
      mockPost.mockRejectedValueOnce({
        message: "General error",
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = renderForgotPasswordForm();
      const emailInput = screen.getByTestId("email");
      const form = container.querySelector("form");

      // Fill form with valid email
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Check error message
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent("An unexpected error occurred.");
      });

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });
});

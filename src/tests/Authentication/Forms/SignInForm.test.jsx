import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockOnSubmit = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock child components
vi.mock("../../../pages/Authentication/GenericComponents/Divider", () => ({
  default: () => <div data-testid="divider">Divider Component</div>,
}));

vi.mock(
  "../../../pages/Authentication/GenericComponents/SignWithGoogle",
  () => ({
    default: () => (
      <div data-testid="google-sign-in">Sign with Google Component</div>
    ),
  }),
);

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

// Create a mock for InputField that captures its props
vi.mock("../../../pages/Authentication/GenericComponents/InputField", () => ({
  default: (props) => {
    // Render a simplified version that still behaves like an input
    return (
      <div data-testid={`input-field-${props.name}`}>
        <label htmlFor={props.id}>{props.labelText}</label>
        <input
          type={props.type}
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          required={props.required}
          data-testid={props.id}
        />
        {props.error && (
          <p data-testid={`${props.name}-error`} className="text-red-500">
            {props.error}
          </p>
        )}
        {props.showPasswordToggle && (
          <button
            type="button"
            onClick={props.onTogglePasswordVisibility}
            data-testid="toggle-password"
          >
            {props.showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    );
  },
}));

// Import the component after all mocks are set up
import SignInForm from "../../../pages/Authentication/Forms/SignInForm";

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <SignInForm onSubmit={mockOnSubmit} {...props} />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the form without crashing", () => {
      const { container } = renderSignInForm();
      expect(container).toBeInTheDocument();
    });

    it("renders the heading with 'Sign in' text", () => {
      renderSignInForm();
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Sign in");
    });

    it("renders the email input field", () => {
      renderSignInForm();
      const emailField = screen.getByTestId("input-field-email");
      expect(emailField).toBeInTheDocument();
    });

    it("renders the password input field", () => {
      renderSignInForm();
      const passwordField = screen.getByTestId("input-field-password");
      expect(passwordField).toBeInTheDocument();
    });

    it("renders the submit button with 'Sign in' text", () => {
      renderSignInForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Sign in");
    });

    it("renders the forgot password link", () => {
      renderSignInForm();
      const forgotPasswordLink = screen.getByText("Forgot password?");
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink).toHaveAttribute(
        "href",
        "/auth/forgot-password",
      );
    });

    it("renders the divider component", () => {
      renderSignInForm();
      const divider = screen.getByTestId("divider");
      expect(divider).toBeInTheDocument();
    });

    it("renders the sign with Google component", () => {
      renderSignInForm();
      const googleSignIn = screen.getByTestId("google-sign-in");
      expect(googleSignIn).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("updates email when input changes", () => {
      renderSignInForm();
      const emailInput = screen.getByTestId("email");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput.value).toBe("test@example.com");
    });

    it("updates password when input changes", () => {
      renderSignInForm();
      const passwordInput = screen.getByTestId("password");

      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput.value).toBe("password123");
    });

    it("toggles password visibility", () => {
      renderSignInForm();
      const toggleButton = screen.getByTestId("toggle-password");
      const passwordInput = screen.getByTestId("password");

      // Initial state should be password hidden
      expect(passwordInput.type).toBe("password");

      // Click toggle to show password
      fireEvent.click(toggleButton);

      // Now check if the input type has changed
      expect(passwordInput.type).toBe("text");
    });

    it("clears credentials error on input change", () => {
      // Only render once
      const { container } = renderSignInForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      const form = container.querySelector("form");

      // Setup mock to set credentials error on first call
      mockOnSubmit.mockImplementationOnce((_, setCredentialsError) => {
        setCredentialsError("Invalid credentials");
      });

      // Fill form and submit to trigger the error
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      // Verify error message appears
      const errorMessage = screen.getByText("Invalid credentials");
      expect(errorMessage).toBeInTheDocument();

      // Change input to clear error
      fireEvent.change(emailInput, {
        target: { value: "different@example.com" },
      });

      // Error should be gone now
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows error for empty email on blur", () => {
      renderSignInForm();
      const emailInput = screen.getByTestId("email");

      // Trigger blur on empty input
      fireEvent.blur(emailInput);

      // Check for error message
      const emailError = screen.getByTestId("email-error");
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveTextContent("Please enter your email.");
    });

    it("shows error for empty password on blur", () => {
      renderSignInForm();
      const passwordInput = screen.getByTestId("password");

      // Trigger blur on empty input
      fireEvent.blur(passwordInput);

      // Check for error message
      const passwordError = screen.getByTestId("password-error");
      expect(passwordError).toBeInTheDocument();
      expect(passwordError).toHaveTextContent("Please enter your password.");
    });

    it("clears errors when input values change", () => {
      renderSignInForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");

      // Generate errors
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);

      // Errors should be visible
      expect(screen.getByTestId("email-error")).toBeInTheDocument();
      expect(screen.getByTestId("password-error")).toBeInTheDocument();

      // Change inputs
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Errors should be gone
      expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
      expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("submits the form with valid data", () => {
      const { container } = renderSignInForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      // Get form by querying the DOM instead of by role to avoid test failures
      const form = container.querySelector("form");

      // Fill in form with valid data
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Submit the form
      fireEvent.submit(form);

      // Check if onSubmit was called with correct data
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "password123",
        },
        expect.any(Function), // the setCredentialsError function
      );
    });

    it("prevents submission with empty email", () => {
      const { container } = renderSignInForm();
      const passwordInput = screen.getByTestId("password");
      // Get form by container query
      const form = container.querySelector("form");

      // Fill in form with only password
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Submit the form
      fireEvent.submit(form);

      // Check that onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();

      // Check for error message
      const emailError = screen.getByTestId("email-error");
      expect(emailError).toBeInTheDocument();
    });

    it("prevents submission with empty password", () => {
      const { container } = renderSignInForm();
      const emailInput = screen.getByTestId("email");
      // Get form by container query
      const form = container.querySelector("form");

      // Fill in form with only email
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      // Submit the form
      fireEvent.submit(form);

      // Check that onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();

      // Check for error message
      const passwordError = screen.getByTestId("password-error");
      expect(passwordError).toBeInTheDocument();
    });

    it("displays credentials error from onSubmit callback", () => {
      const { container } = renderSignInForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      const form = container.querySelector("form");

      // Fill in form with valid data
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Mock onSubmit to set credentials error
      mockOnSubmit.mockImplementationOnce((_, setCredentialsError) => {
        setCredentialsError("Invalid email or password");
      });

      // Submit the form
      fireEvent.submit(form);

      // Check for credentials error message
      const errorMessage = screen.getByText("Invalid email or password");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});

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

vi.mock("../../../pages/Authentication/GenericComponents/SignWithGoogle", () => ({
  default: () => <div data-testid="google-sign-in">Sign with Google Component</div>,
}));

vi.mock("../../../pages/Authentication/GenericComponents/BlueSubmitButton", () => ({
  default: ({ text }) => (
    <button type="submit" data-testid="submit-button">
      {text}
    </button>
  ),
}));

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
import SignUpForm from "../../../pages/Authentication/Forms/SignUpForm";

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <SignUpForm onSubmit={mockOnSubmit} {...props} />
      </BrowserRouter>
    );
  };

  describe("Component Rendering", () => {
    it("renders the form without crashing", () => {
      const { container } = renderSignUpForm();
      expect(container).toBeInTheDocument();
    });

    it("renders the email input field", () => {
      renderSignUpForm();
      const emailField = screen.getByTestId("input-field-email");
      expect(emailField).toBeInTheDocument();
    });

    it("renders the password input field", () => {
      renderSignUpForm();
      const passwordField = screen.getByTestId("input-field-password");
      expect(passwordField).toBeInTheDocument();
    });

    it("renders the submit button with 'Join' text", () => {
      renderSignUpForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Join");
    });

    it("renders the divider component", () => {
      renderSignUpForm();
      const divider = screen.getByTestId("divider");
      expect(divider).toBeInTheDocument();
    });

    it("renders the sign with Google component", () => {
      renderSignUpForm();
      const googleSignIn = screen.getByTestId("google-sign-in");
      expect(googleSignIn).toBeInTheDocument();
    });

    it("renders the 'Sign in' link", () => {
      renderSignUpForm();
      const signInLink = screen.getByText("Sign in");
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/auth/signin");
    });
  });

  describe("Form Interaction", () => {
    it("updates email when input changes", () => {
      renderSignUpForm();
      const emailInput = screen.getByTestId("email");
      
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      expect(emailInput.value).toBe("test@example.com");
    });

    it("updates password when input changes", () => {
      renderSignUpForm();
      const passwordInput = screen.getByTestId("password");
      
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      expect(passwordInput.value).toBe("password123");
    });

    it("toggles password visibility", () => {
      renderSignUpForm();
      const toggleButton = screen.getByTestId("toggle-password");
      const passwordInput = screen.getByTestId("password");
      
      // Initial state should be password hidden
      expect(passwordInput.type).toBe("password");
      
      // Click toggle to show password
      fireEvent.click(toggleButton);
      
      // Now check if the input type has changed
      expect(passwordInput.type).toBe("text");
    });
  });

  describe("Form Validation", () => {
    it("validates email format", () => {
      renderSignUpForm();
      const emailInput = screen.getByTestId("email");
      
      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
      
      // Check for error message
      const emailError = screen.getByTestId("email-error");
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveTextContent("Please enter a valid email address.");
      
      // Enter valid email
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.blur(emailInput);
      
      // Error message should be gone
      expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
    });

    it("validates password length", () => {
      renderSignUpForm();
      const passwordInput = screen.getByTestId("password");
      
      // Enter short password
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.blur(passwordInput);
      
      // Check for error message
      const passwordError = screen.getByTestId("password-error");
      expect(passwordError).toBeInTheDocument();
      expect(passwordError).toHaveTextContent("Password must be at least 6 characters long.");
      
      // Enter valid password
      fireEvent.change(passwordInput, { target: { value: "123456" } });
      fireEvent.blur(passwordInput);
      
      // Error message should be gone
      expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("submits the form with valid data", () => {
      renderSignUpForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      const form = emailInput.closest("form");
      
      // Fill in form with valid data
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      // Submit the form
      fireEvent.submit(form);
      
      // Check if onSubmit was called with correct data
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "password123"
        },
        expect.any(Function) // the setEmailError function
      );
    });

    it("prevents submission with invalid password", () => {
      renderSignUpForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      const form = emailInput.closest("form");
      
      // Fill in form with invalid password
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      
      // Submit the form
      fireEvent.submit(form);
      
      // Check that onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
      
      // Check for error message
      const passwordError = screen.getByTestId("password-error");
      expect(passwordError).toBeInTheDocument();
    });

    it("clears errors on input change", () => {
      renderSignUpForm();
      const emailInput = screen.getByTestId("email");
      const passwordInput = screen.getByTestId("password");
      
      // Generate errors
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.blur(passwordInput);
      
      // Errors should be visible
      expect(screen.getByTestId("email-error")).toBeInTheDocument();
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
      
      // Change inputs again
      fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "newpassword" } });
      
      // Errors should be gone
      expect(screen.queryByTestId("email-error")).not.toBeInTheDocument();
      expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
    });
  });
});
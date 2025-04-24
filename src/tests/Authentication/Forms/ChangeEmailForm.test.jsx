import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockOnSubmit = vi.hoisted(() => vi.fn());
const mockUseSelector = vi.hoisted(() =>
  vi.fn().mockReturnValue({ email: "current@example.com" }),
);

// Mock react-redux
vi.mock("react-redux", () => ({
  useSelector: (selector) => mockUseSelector(selector),
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
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        required={props.required}
        data-testid={props.id}
      />
      {props.error && <p data-testid={`${props.name}-error`}>{props.error}</p>}
      {props.showPasswordToggle && (
        <button
          type="button"
          onClick={props.onTogglePasswordVisibility}
          data-testid={`toggle-${props.name}-visibility`}
        >
          {props.showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  ),
}));

// Import the component after all mocks are set up
import ChangeEmailForm from "../../../pages/Authentication/Forms/ChangeEmailForm";

describe("ChangeEmailForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderChangeEmailForm = () => {
    return render(<ChangeEmailForm onSubmit={mockOnSubmit} />);
  };

  describe("Rendering", () => {
    it("renders the form with all fields", () => {
      renderChangeEmailForm();

      // Check title and description texts
      expect(screen.getByText("Update Email")).toBeInTheDocument();
      expect(screen.getByText(/Enter the new email/)).toBeInTheDocument();
      expect(screen.getByText(/After submitting/)).toBeInTheDocument();

      // Check input fields
      expect(screen.getByTestId("input-field-newEmail")).toBeInTheDocument();
      expect(
        screen.getByTestId("input-field-currentPassword"),
      ).toBeInTheDocument();

      // Check submit button
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Submit");
    });

    it("pre-fills email field with current email from Redux", () => {
      renderChangeEmailForm();

      const newEmailInput = screen.getByTestId("newEmail");
      expect(newEmailInput.value).toBe("current@example.com");
    });
  });

  describe("Form Interaction", () => {
    it("updates email when input changes", () => {
      renderChangeEmailForm();
      const newEmailInput = screen.getByTestId("newEmail");

      fireEvent.change(newEmailInput, { target: { value: "new@example.com" } });

      expect(newEmailInput.value).toBe("new@example.com");
    });

    it("updates password when input changes", () => {
      renderChangeEmailForm();
      const passwordInput = screen.getByTestId("currentPassword");

      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(passwordInput.value).toBe("password123");
    });

    it("toggles password visibility", () => {
      renderChangeEmailForm();
      const passwordInput = screen.getByTestId("currentPassword");
      const toggleButton = screen.getByTestId(
        "toggle-currentPassword-visibility",
      );

      // Initial state should be password (hidden)
      expect(passwordInput.type).toBe("password");

      // Toggle visibility
      fireEvent.click(toggleButton);

      // Input type should now be text (visible)
      expect(passwordInput.type).toBe("text");

      // Toggle back
      fireEvent.click(toggleButton);

      // Should be hidden again
      expect(passwordInput.type).toBe("password");
    });
  });

  describe("Form Validation", () => {
    it("validates empty email on blur", () => {
      renderChangeEmailForm();
      const newEmailInput = screen.getByTestId("newEmail");

      // Clear the email first
      fireEvent.change(newEmailInput, { target: { value: "" } });
      fireEvent.blur(newEmailInput);

      const error = screen.getByTestId("newEmail-error");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent("Please enter your new email.");
    });

    it("validates invalid email format on blur", () => {
      renderChangeEmailForm();
      const newEmailInput = screen.getByTestId("newEmail");

      fireEvent.change(newEmailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(newEmailInput);

      const error = screen.getByTestId("newEmail-error");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent("Please enter a valid email.");
    });

    it("validates valid email on blur (no error)", () => {
      renderChangeEmailForm();
      const newEmailInput = screen.getByTestId("newEmail");

      fireEvent.change(newEmailInput, {
        target: { value: "valid@example.com" },
      });
      fireEvent.blur(newEmailInput);

      expect(screen.queryByTestId("newEmail-error")).not.toBeInTheDocument();
    });

    it("validates empty password on blur", () => {
      renderChangeEmailForm();
      const passwordInput = screen.getByTestId("currentPassword");

      fireEvent.blur(passwordInput);

      const error = screen.getByTestId("currentPassword-error");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent("Please enter your current password.");
    });

    it("clears email error when input changes", () => {
      renderChangeEmailForm();
      const newEmailInput = screen.getByTestId("newEmail");

      // Generate error
      fireEvent.change(newEmailInput, { target: { value: "" } });
      fireEvent.blur(newEmailInput);
      expect(screen.getByTestId("newEmail-error")).toBeInTheDocument();

      // Change input
      fireEvent.change(newEmailInput, { target: { value: "new@example.com" } });

      // Error should be gone
      expect(screen.queryByTestId("newEmail-error")).not.toBeInTheDocument();
    });

    it("clears password error when input changes", () => {
      renderChangeEmailForm();
      const passwordInput = screen.getByTestId("currentPassword");

      // Generate error
      fireEvent.blur(passwordInput);
      expect(screen.getByTestId("currentPassword-error")).toBeInTheDocument();

      // Change input
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Error should be gone
      expect(
        screen.queryByTestId("currentPassword-error"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("prevents submission with empty email", () => {
      const { container } = renderChangeEmailForm();
      const form = container.querySelector("form");
      const newEmailInput = screen.getByTestId("newEmail");

      // Clear email and submit
      fireEvent.change(newEmailInput, { target: { value: "" } });
      fireEvent.submit(form);

      // Check for error
      expect(screen.getByTestId("newEmail-error")).toBeInTheDocument();

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("prevents submission with invalid email format", () => {
      const { container } = renderChangeEmailForm();
      const form = container.querySelector("form");
      const newEmailInput = screen.getByTestId("newEmail");

      // Set invalid email and submit
      fireEvent.change(newEmailInput, { target: { value: "invalid-email" } });
      fireEvent.submit(form);

      // Check for error
      expect(screen.getByTestId("newEmail-error")).toBeInTheDocument();

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("submits form with valid data", () => {
      const { container } = renderChangeEmailForm();
      const form = container.querySelector("form");
      const newEmailInput = screen.getByTestId("newEmail");
      const passwordInput = screen.getByTestId("currentPassword");

      // Fill with valid data
      fireEvent.change(newEmailInput, { target: { value: "new@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Submit form
      fireEvent.submit(form);

      // onSubmit should be called with correct data
      expect(mockOnSubmit).toHaveBeenCalledWith(
        "new@example.com",
        "password123",
        expect.any(Function),
        expect.any(Function),
      );
    });
  });
});

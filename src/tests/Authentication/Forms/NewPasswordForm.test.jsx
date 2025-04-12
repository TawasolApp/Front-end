import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockPatch = vi.hoisted(() => vi.fn());
const mockUseSelector = vi.hoisted(() => vi.fn());

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
  useSelector: (selector) => mockUseSelector(selector),
}));

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    patch: (...args) => mockPatch(...args),
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
  })
);

// Create a mock for InputField that captures its props
vi.mock("../../../pages/Authentication/GenericComponents/InputField", () => ({
  default: (props) => {
    return (
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
import NewPasswordForm from "../../../pages/Authentication/Forms/NewPasswordForm";

describe("NewPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock email in Redux store
    mockUseSelector.mockReturnValue("test@example.com");
    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderNewPasswordForm = () => {
    return render(
      <BrowserRouter>
        <NewPasswordForm />
      </BrowserRouter>
    );
  };

  describe("Component Rendering", () => {
    it("renders the form without crashing", () => {
      const { container } = renderNewPasswordForm();
      expect(container).toBeInTheDocument();
    });

    it("renders the page title", () => {
      renderNewPasswordForm();
      const title = screen.getByText("Choose a new password");
      expect(title).toBeInTheDocument();
    });

    it("renders the description text", () => {
      renderNewPasswordForm();
      const description = screen.getByText(/To secure your account/i);
      expect(description).toBeInTheDocument();
    });

    it("renders both password input fields", () => {
      renderNewPasswordForm();
      const newPasswordField = screen.getByTestId("input-field-newPassword");
      const confirmPasswordField = screen.getByTestId(
        "input-field-confirmNewPassword"
      );

      expect(newPasswordField).toBeInTheDocument();
      expect(confirmPasswordField).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      renderNewPasswordForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Submit");
    });
  });

  describe("Form Interaction", () => {
    it("updates new password when input changes", () => {
      renderNewPasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");

      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });

      expect(newPasswordInput.value).toBe("newpassword123");
    });

    it("updates confirm password when input changes", () => {
      renderNewPasswordForm();
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });

      expect(confirmPasswordInput.value).toBe("newpassword123");
    });

    it("toggles password visibility", () => {
      renderNewPasswordForm();
      const toggleButton = screen.getByTestId("toggle-password");
      const passwordInput = screen.getByTestId("newPassword");

      // Initial state should be password hidden
      expect(passwordInput.type).toBe("password");

      // Click toggle to show password
      fireEvent.click(toggleButton);

      // Now check if the input type has changed
      expect(passwordInput.type).toBe("text");
    });
  });

  describe("Form Validation", () => {
    it("validates empty password", async () => {
      const { container } = renderNewPasswordForm();
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");
      const form = container.querySelector("form");

      // Only fill confirm password
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password123" },
      });

      // Submit the form
      fireEvent.submit(form);

      // Check for error message
      const passwordError = screen.getByTestId("newPassword-error");
      expect(passwordError).toBeInTheDocument();
      expect(passwordError).toHaveTextContent(
        "Please enter your new password."
      );
    });

    it("validates password length", async () => {
      const { container } = renderNewPasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");
      const form = container.querySelector("form");

      // Fill with short password
      fireEvent.change(newPasswordInput, { target: { value: "short" } });

      // Submit the form
      fireEvent.submit(form);

      // Check for error message
      const passwordError = screen.getByTestId("newPassword-error");
      expect(passwordError).toBeInTheDocument();
      expect(passwordError).toHaveTextContent("Password is too short.");
    });

    it("validates password match", async () => {
      const { container } = renderNewPasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");
      const form = container.querySelector("form");

      // Fill with different passwords
      fireEvent.change(newPasswordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "differentpassword" },
      });

      // Submit the form
      fireEvent.submit(form);

      // Check for error message
      const confirmError = screen.getByTestId("confirmNewPassword-error");
      expect(confirmError).toBeInTheDocument();
      expect(confirmError).toHaveTextContent("Passwords do not match.");
    });
  });

  describe("Form Submission", () => {
    it("handles API errors", async () => {
      // Switch to real timers for this test
      vi.useRealTimers();

      // Mock API error
      mockPatch.mockRejectedValueOnce(new Error("API Error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = renderNewPasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");
      const form = container.querySelector("form");

      // Fill with valid data
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });

      // Submit the form
      fireEvent.submit(form);

      // Wait for error handling
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Check error status message
      const statusMsg = screen.getByText(
        "Something went wrong. Please try again."
      );
      expect(statusMsg).toBeInTheDocument();

      // Verify no navigation happened
      expect(mockNavigate).not.toHaveBeenCalled();

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it("shows submitting status during API call", async () => {
      // Switch to real timers for this test
      vi.useRealTimers();

      // Mock API response with a resolved promise after a short delay
      mockPatch.mockImplementationOnce(() => {
        return Promise.resolve({ status: 200, data: {} });
      });

      const { container } = renderNewPasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");
      const form = container.querySelector("form");

      // Fill with valid data and submit
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.submit(form);

      // Check for submitting status
      const submittingMsg = screen.getByText("Submitting...");
      expect(submittingMsg).toBeInTheDocument();

      // Wait for completion - use a specific timeout to avoid waiting too long
      await waitFor(
        () => {
          expect(
            screen.getByText("Password reset successful! Redirecting...")
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });
});

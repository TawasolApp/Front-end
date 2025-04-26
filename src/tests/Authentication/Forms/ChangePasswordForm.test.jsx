import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockPatch = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    patch: (...args) => mockPatch(...args),
  },
}));

// Mock MUI icons
vi.mock("@mui/icons-material/ArrowBack", () => ({
  default: () => <span data-testid="arrow-back-icon">←</span>,
}));

// Mock child components
vi.mock(
  "../../../pages/Authentication/GenericComponents/BlueSubmitButton",
  () => ({
    default: ({ text, disabled }) => (
      <button type="submit" data-testid="submit-button" disabled={disabled}>
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
import ChangePasswordForm from "../../../pages/Authentication/Forms/ChangePasswordForm";

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderChangePasswordForm = () => {
    return render(<ChangePasswordForm />);
  };

  describe("Rendering", () => {
    it("renders the form with all fields", () => {
      renderChangePasswordForm();

      // Check title and description
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText(/Create a new password/)).toBeInTheDocument();

      // Check password fields
      expect(
        screen.getByTestId("input-field-currentPassword"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("input-field-newPassword")).toBeInTheDocument();
      expect(
        screen.getByTestId("input-field-confirmNewPassword"),
      ).toBeInTheDocument();

      // Check buttons
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByText("Forgot Password")).toBeInTheDocument();
      expect(screen.getByText("Back")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates back when back button is clicked", () => {
      renderChangePasswordForm();

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("navigates to forgot password when forgot password button is clicked", () => {
      renderChangePasswordForm();

      const forgotPasswordButton = screen.getByText("Forgot Password");
      fireEvent.click(forgotPasswordButton);

      expect(mockNavigate).toHaveBeenCalledWith("/auth/forgot-password");
    });
  });

  describe("Password Visibility", () => {
    it("toggles current password visibility", () => {
      renderChangePasswordForm();

      const currentPasswordInput = screen.getByTestId("currentPassword");
      const toggleButton = screen.getByTestId(
        "toggle-currentPassword-visibility",
      );

      // Initial state should be password (hidden)
      expect(currentPasswordInput.type).toBe("password");

      // Toggle visibility
      fireEvent.click(toggleButton);

      // Input type should now be text (visible)
      expect(currentPasswordInput.type).toBe("text");
    });

    it("toggles confirm new password visibility", () => {
      renderChangePasswordForm();

      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");
      const toggleButton = screen.getByTestId(
        "toggle-confirmNewPassword-visibility",
      );

      // Initial state should be password (hidden)
      expect(confirmPasswordInput.type).toBe("password");

      // Toggle visibility
      fireEvent.click(toggleButton);

      // Input type should now be text (visible)
      expect(confirmPasswordInput.type).toBe("text");
    });
  });

  describe("Form Validation", () => {
    it("validates empty current password on blur", () => {
      renderChangePasswordForm();
      const currentPasswordInput = screen.getByTestId("currentPassword");

      fireEvent.blur(currentPasswordInput);

      const error = screen.getByTestId("currentPassword-error");
      expect(error).toBeInTheDocument();
    });

    it("validates empty new password on blur", () => {
      renderChangePasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");

      fireEvent.blur(newPasswordInput);

      const error = screen.getByTestId("newPassword-error");
      expect(error).toBeInTheDocument();
    });

    it("validates new password length on blur", () => {
      renderChangePasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");

      fireEvent.change(newPasswordInput, { target: { value: "short" } });
      fireEvent.blur(newPasswordInput);

      const error = screen.getByTestId("newPassword-error");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(/at least 8 characters/);
    });

    it("validates passwords match on blur", () => {
      renderChangePasswordForm();
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      fireEvent.change(newPasswordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "differentpassword" },
      });
      fireEvent.blur(confirmPasswordInput);

      const error = screen.getByTestId("confirmNewPassword-error");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(/do not match/);
    });

    it("clears field-specific error when input changes", () => {
      renderChangePasswordForm();
      const currentPasswordInput = screen.getByTestId("currentPassword");

      // Generate error
      fireEvent.blur(currentPasswordInput);
      expect(screen.getByTestId("currentPassword-error")).toBeInTheDocument();

      // Change input to clear error
      fireEvent.change(currentPasswordInput, {
        target: { value: "password123" },
      });

      // Error should be gone
      expect(
        screen.queryByTestId("currentPassword-error"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("prevents submission with empty current password", async () => {
      const { container } = renderChangePasswordForm();
      const form = container.querySelector("form");
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      // Fill in only new passwords
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });

      // Submit form
      fireEvent.submit(form);

      // Check for error message
      const errorMessage = screen.getByText(
        "Please enter your current password.",
      );
      expect(errorMessage).toBeInTheDocument();

      // API should not be called
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it("prevents submission with short new password", async () => {
      const { container } = renderChangePasswordForm();
      const form = container.querySelector("form");
      const currentPasswordInput = screen.getByTestId("currentPassword");
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      // Fill with short new password
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldpassword" },
      });
      fireEvent.change(newPasswordInput, { target: { value: "short" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "short" } });

      // Submit form
      fireEvent.submit(form);

      // Check for error message
      const errorMessage = screen.getByText(
        "New password must be at least 8 characters.",
      );
      expect(errorMessage).toBeInTheDocument();

      // API should not be called
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it("prevents submission with mismatched passwords", async () => {
      const { container } = renderChangePasswordForm();
      const form = container.querySelector("form");
      const currentPasswordInput = screen.getByTestId("currentPassword");
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      // Fill with mismatched passwords
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldpassword" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "differentpassword" },
      });

      // Submit form
      fireEvent.submit(form);

      // Check for error message
      const errorMessage = screen.getByText("Passwords do not match.");
      expect(errorMessage).toBeInTheDocument();

      // API should not be called
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it("submits valid form data", async () => {
      // Mock successful API response
      mockPatch.mockResolvedValueOnce({ status: 200 });

      const { container } = renderChangePasswordForm();
      const form = container.querySelector("form");
      const currentPasswordInput = screen.getByTestId("currentPassword");
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      // Fill with valid data
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldpassword" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        // Check API call
        expect(mockPatch).toHaveBeenCalledWith("/users/update-password", {
          currentPassword: "oldpassword",
          newPassword: "newpassword123",
        });
      });

      // Check that fields are reset
      expect(currentPasswordInput.value).toBe("");
      expect(newPasswordInput.value).toBe("");
      expect(confirmPasswordInput.value).toBe("");
    });

    it("handles 400 error (incorrect password)", async () => {
      // Mock API error
      mockPatch.mockRejectedValueOnce({
        response: { status: 400 },
      });

      const { container } = renderChangePasswordForm();
      const form = container.querySelector("form");
      const currentPasswordInput = screen.getByTestId("currentPassword");
      const newPasswordInput = screen.getByTestId("newPassword");
      const confirmPasswordInput = screen.getByTestId("confirmNewPassword");

      // Fill with valid data
      fireEvent.change(currentPasswordInput, {
        target: { value: "oldpassword" },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: "newpassword123" },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "newpassword123" },
      });

      // Submit form
      fireEvent.submit(form);

      // Wait for async operations
      await waitFor(() => {
        // Check error message
        const errorMessage = screen.getByText("Incorrect current password.");
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});

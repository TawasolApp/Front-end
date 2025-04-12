import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Mock ReCAPTCHA component
vi.mock("react-google-recaptcha", () => ({
  default: vi.fn(({ ref }) => {
    // When ref is set, simulate the ref.current functionality
    if (ref) {
      ref.current = {
        getValue: vi.fn().mockReturnValue("mock-captcha-token"),
        execute: vi.fn(),
      };
    }
    return <div data-testid="recaptcha">reCAPTCHA</div>;
  }),
}));

// Mock child components
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
        data-testid={props.id}
      />
      {props.error && (
        <p data-testid={`${props.name}-error`} className="text-red-500">
          {props.error}
        </p>
      )}
    </div>
  ),
}));

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

// Import the component after all mocks are set up
import NameForm from "../../../pages/Authentication/Forms/NameForm";

describe("NameForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNameForm = () => {
    return render(<NameForm onSubmit={mockOnSubmit} />);
  };

  describe("Rendering", () => {
    it("renders the form with all fields and reCAPTCHA", () => {
      renderNameForm();

      expect(screen.getByTestId("input-field-firstName")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-lastName")).toBeInTheDocument();
      expect(screen.getByTestId("recaptcha")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("displays the Continue button", () => {
      renderNameForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toHaveTextContent("Continue");
    });
  });

  describe("Form Interaction", () => {
    it("updates firstName when input changes", () => {
      renderNameForm();
      const firstNameInput = screen.getByTestId("firstName");

      fireEvent.change(firstNameInput, { target: { value: "John" } });

      expect(firstNameInput.value).toBe("John");
    });

    it("updates lastName when input changes", () => {
      renderNameForm();
      const lastNameInput = screen.getByTestId("lastName");

      fireEvent.change(lastNameInput, { target: { value: "Doe" } });

      expect(lastNameInput.value).toBe("Doe");
    });
  });

  describe("Form Validation", () => {
    it("shows error for empty firstName on blur", () => {
      renderNameForm();
      const firstNameInput = screen.getByTestId("firstName");

      fireEvent.blur(firstNameInput);

      const firstNameError = screen.getByTestId("firstName-error");
      expect(firstNameError).toBeInTheDocument();
      expect(firstNameError).toHaveTextContent("Please enter your first name.");
    });

    it("shows error for empty lastName on blur", () => {
      renderNameForm();
      const lastNameInput = screen.getByTestId("lastName");

      fireEvent.blur(lastNameInput);

      const lastNameError = screen.getByTestId("lastName-error");
      expect(lastNameError).toBeInTheDocument();
      expect(lastNameError).toHaveTextContent("Please enter your last name.");
    });

    it("clears firstName error when input changes", () => {
      renderNameForm();
      const firstNameInput = screen.getByTestId("firstName");

      // Generate error
      fireEvent.blur(firstNameInput);
      expect(screen.getByTestId("firstName-error")).toBeInTheDocument();

      // Change input
      fireEvent.change(firstNameInput, { target: { value: "John" } });

      // Error should be gone
      expect(screen.queryByTestId("firstName-error")).not.toBeInTheDocument();
    });

    it("clears lastName error when input changes", () => {
      renderNameForm();
      const lastNameInput = screen.getByTestId("lastName");

      // Generate error
      fireEvent.blur(lastNameInput);
      expect(screen.getByTestId("lastName-error")).toBeInTheDocument();

      // Change input
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });

      // Error should be gone
      expect(screen.queryByTestId("lastName-error")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("submits the form with valid data and captcha token", async () => {
      const { container } = renderNameForm();
      const firstNameInput = screen.getByTestId("firstName");
      const lastNameInput = screen.getByTestId("lastName");
      const form = container.querySelector("form");

      // Fill form
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });

      // Submit form
      fireEvent.submit(form);

      // Check onSubmit was called with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          { firstName: "John", lastName: "Doe" },
          "mock-captcha-token",
        );
      });
    });

    it("prevents submission with empty firstName", async () => {
      const { container } = renderNameForm();
      const lastNameInput = screen.getByTestId("lastName");
      const form = container.querySelector("form");

      // Fill only lastName
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });

      // Submit form
      fireEvent.submit(form);

      // Check for error message
      expect(screen.getByTestId("firstName-error")).toBeInTheDocument();

      // Check onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("prevents submission with empty lastName", async () => {
      const { container } = renderNameForm();
      const firstNameInput = screen.getByTestId("firstName");
      const form = container.querySelector("form");

      // Fill only firstName
      fireEvent.change(firstNameInput, { target: { value: "John" } });

      // Submit form
      fireEvent.submit(form);

      // Check for error message
      expect(screen.getByTestId("lastName-error")).toBeInTheDocument();

      // Check onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});

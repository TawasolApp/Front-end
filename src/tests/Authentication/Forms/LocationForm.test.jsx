import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockOnSubmit = vi.hoisted(() => vi.fn());
const mockUseSelector = vi.hoisted(() => vi.fn());

// Mock react-redux
vi.mock("react-redux", () => ({
  useSelector: (selector) => mockUseSelector(selector),
}));

// Mock child components
vi.mock("../../../pages/Authentication/GenericComponents/BlueSubmitButton", () => ({
  default: ({ text }) => (
    <button type="submit" data-testid="submit-button">
      {text}
    </button>
  ),
}));

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
      {props.error && (
        <p data-testid={`${props.name}-error`} className="text-red-500">
          {props.error}
        </p>
      )}
    </div>
  ),
}));

// Import the component after all mocks are set up
import LocationForm from "../../../pages/Authentication/Forms/LocationForm";

describe("LocationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSelector.mockReturnValue({ firstName: "" });
  });

  const renderLocationForm = (firstName = "") => {
    mockUseSelector.mockReturnValue({ firstName });
    return render(<LocationForm onSubmit={mockOnSubmit} />);
  };

  describe("Rendering", () => {
    it("renders the form without crashing", () => {
      const { container } = renderLocationForm();
      expect(container).toBeInTheDocument();
    });

    it("displays generic welcome message when firstName is empty", () => {
      renderLocationForm();
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Welcome! What's your location?");
    });

    it("displays personalized welcome message when firstName is provided", () => {
      renderLocationForm("John");
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Welcome, John! What's your location?");
    });

    it("renders the location input field", () => {
      renderLocationForm();
      const locationField = screen.getByTestId("input-field-location");
      expect(locationField).toBeInTheDocument();
    });

    it("renders the Next button", () => {
      renderLocationForm();
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Next");
    });
  });

  describe("Form Interaction", () => {
    it("updates location when input changes", () => {
      renderLocationForm();
      const locationInput = screen.getByTestId("location");
      
      fireEvent.change(locationInput, { target: { value: "New York, NY" } });
      
      expect(locationInput.value).toBe("New York, NY");
    });

    it("shows error for empty location on blur", () => {
      renderLocationForm();
      const locationInput = screen.getByTestId("location");
      
      fireEvent.blur(locationInput);
      
      const locationError = screen.getByTestId("location-error");
      expect(locationError).toBeInTheDocument();
      expect(locationError).toHaveTextContent("Please enter your location.");
    });

    it("clears error when location input changes", () => {
      renderLocationForm();
      const locationInput = screen.getByTestId("location");
      
      // Generate error
      fireEvent.blur(locationInput);
      expect(screen.getByTestId("location-error")).toBeInTheDocument();
      
      // Change input
      fireEvent.change(locationInput, { target: { value: "New York, NY" } });
      
      // Error should be gone
      expect(screen.queryByTestId("location-error")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid location", () => {
      const { container } = renderLocationForm();
      const locationInput = screen.getByTestId("location");
      const form = container.querySelector("form");
      
      // Fill form
      fireEvent.change(locationInput, { target: { value: "New York, NY" } });
      
      // Submit form
      fireEvent.submit(form);
      
      // Check onSubmit was called with correct location
      expect(mockOnSubmit).toHaveBeenCalledWith("New York, NY");
    });

    it("prevents submission with empty location", () => {
      const { container } = renderLocationForm();
      const form = container.querySelector("form");
      
      // Submit empty form
      fireEvent.submit(form);
      
      // Check for error message
      const locationError = screen.getByTestId("location-error");
      expect(locationError).toBeInTheDocument();
      
      // Check onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
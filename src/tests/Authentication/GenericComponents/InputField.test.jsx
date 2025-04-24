import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import InputField from "../../../pages/Authentication/GenericComponents/InputField";

describe("InputField", () => {
  describe("Rendering", () => {
    it("renders with minimal props", () => {
      render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
        />,
      );

      const label = screen.getByText("Test Input");
      expect(label).toBeInTheDocument();

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "test-input");
      expect(input).toHaveAttribute("name", "test");
    });

    it("renders with correct input type", () => {
      render(
        <InputField
          type="email"
          id="email"
          name="email"
          labelText="Email"
          value=""
          onChange={() => {}}
        />,
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("type", "email");
    });

    it("displays placeholder text when provided", () => {
      render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          placeholder="Enter value here"
        />,
      );

      const input = screen.getByPlaceholderText("Enter value here");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Password Toggle", () => {
    it("renders password toggle button when showPasswordToggle is true", () => {
      render(
        <InputField
          type="password"
          id="password"
          name="password"
          labelText="Password"
          value=""
          onChange={() => {}}
          showPasswordToggle={true}
          onTogglePasswordVisibility={() => {}}
          showPassword={false}
        />,
      );

      const toggleButton = screen.getByText("Show");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton.tagName).toBe("BUTTON");
    });

    it("shows 'Hide' text when password is visible", () => {
      render(
        <InputField
          type="text" // Type would be text when password is visible
          id="password"
          name="password"
          labelText="Password"
          value=""
          onChange={() => {}}
          showPasswordToggle={true}
          onTogglePasswordVisibility={() => {}}
          showPassword={true}
        />,
      );

      const toggleButton = screen.getByText("Hide");
      expect(toggleButton).toBeInTheDocument();
    });

    it("calls onTogglePasswordVisibility when toggle button is clicked", () => {
      const mockToggle = vi.fn();

      render(
        <InputField
          type="password"
          id="password"
          name="password"
          labelText="Password"
          value=""
          onChange={() => {}}
          showPasswordToggle={true}
          onTogglePasswordVisibility={mockToggle}
          showPassword={false}
        />,
      );

      const toggleButton = screen.getByText("Show");
      fireEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("displays error message when error prop is provided", () => {
      render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          error="This field is required"
        />,
      );

      const errorMessage = screen.getByText("This field is required");
      expect(errorMessage).toBeInTheDocument();
    });

    it("adds error styling to input when error prop is provided", () => {
      const { container } = render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          error="This field is required"
        />,
      );

      const input = container.querySelector("input");
      expect(input.className).toContain("!border-red-500");
    });
  });

  describe("Event Handling", () => {
    it("calls onChange when input value changes", () => {
      const mockOnChange = vi.fn();

      render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when input loses focus", () => {
      const mockOnBlur = vi.fn();

      render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          onBlur={mockOnBlur}
        />,
      );

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Custom Styling", () => {
    it("applies custom container class name", () => {
      const { container } = render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          containerClassName="custom-container"
        />,
      );

      const wrapperDiv = container.firstChild;
      expect(wrapperDiv.className).toContain("custom-container");
    });

    it("applies custom label class name", () => {
      const { container } = render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          labelClassName="custom-label"
        />,
      );

      const label = container.querySelector("label");
      expect(label.className).toContain("custom-label");
    });

    it("applies custom input class name", () => {
      const { container } = render(
        <InputField
          id="test-input"
          name="test"
          labelText="Test Input"
          value=""
          onChange={() => {}}
          inputClassName="custom-input"
        />,
      );

      const input = container.querySelector("input");
      expect(input.className).toContain("custom-input");
    });
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import BlueSubmitButton from "../../../pages/Authentication/GenericComponents/BlueSubmitButton";

describe("BlueSubmitButton", () => {
  describe("Rendering", () => {
    it("renders with the provided text", () => {
      render(<BlueSubmitButton text="Submit Form" />);

      const button = screen.getByText("Submit Form");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders with type submit", () => {
      render(<BlueSubmitButton text="Submit" />);

      const button = screen.getByText("Submit");
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Disabled State", () => {
    it("is not disabled by default", () => {
      render(<BlueSubmitButton text="Submit" />);

      const button = screen.getByText("Submit");
      expect(button).not.toBeDisabled();
    });

    it("is disabled when disabled prop is true", () => {
      render(<BlueSubmitButton text="Submit" disabled={true} />);

      const button = screen.getByText("Submit");
      expect(button).toBeDisabled();
    });
  });

  describe("Styling", () => {
    it("has enabled styling when not disabled", () => {
      const { container } = render(<BlueSubmitButton text="Submit" />);

      const button = container.firstChild;
      expect(button.className).toContain("bg-buttonSubmitEnable");
      expect(button.className).toContain("text-buttonSubmitText");
      expect(button.className).not.toContain("cursor-not-allowed");
    });

    it("has disabled styling when disabled", () => {
      const { container } = render(
        <BlueSubmitButton text="Submit" disabled={true} />,
      );

      const button = container.firstChild;
      expect(button.className).toContain("bg-buttonSubmitDisable");
      expect(button.className).toContain("cursor-not-allowed");
    });

    it("has common styling regardless of disabled state", () => {
      const { container } = render(<BlueSubmitButton text="Submit" />);

      const button = container.firstChild;
      expect(button.className).toContain("w-full");
      expect(button.className).toContain("rounded-full");
      expect(button.className).toContain("font-medium");
      expect(button.className).toContain("transition-all");
    });
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Divider from "../../../pages/Authentication/GenericComponents/Divider";

describe("Divider", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<Divider />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with 'or' text", () => {
      render(<Divider />);
      const orText = screen.getByText("or");
      expect(orText).toBeInTheDocument();
    });

    it("has the correct element structure", () => {
      const { container } = render(<Divider />);

      // Check the main container
      const mainDiv = container.firstChild;
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv.tagName).toBe("DIV");

      // Check it has 3 children - left line, text, right line
      expect(mainDiv.childNodes.length).toBe(3);

      // First child should be a div (left line)
      const leftLine = mainDiv.childNodes[0];
      expect(leftLine.tagName).toBe("DIV");

      // Second child should be a span with "or" text
      const textSpan = mainDiv.childNodes[1];
      expect(textSpan.tagName).toBe("SPAN");
      expect(textSpan.textContent).toBe("or");

      // Third child should be a div (right line)
      const rightLine = mainDiv.childNodes[2];
      expect(rightLine.tagName).toBe("DIV");
    });
  });

  describe("Styling", () => {
    it("has appropriate styling classes", () => {
      const { container } = render(<Divider />);

      // Main container should have flex classes
      const mainDiv = container.firstChild;
      expect(mainDiv.className).toContain("flex");
      expect(mainDiv.className).toContain("items-center");

      // Span should have margin classes
      const textSpan = mainDiv.childNodes[1];
      expect(textSpan.className).toContain("mx-4");
      expect(textSpan.className).toContain("text-xl");

      // Both divider lines should have flex-grow and border
      const leftLine = mainDiv.childNodes[0];
      const rightLine = mainDiv.childNodes[2];
      expect(leftLine.className).toContain("flex-grow");
      expect(leftLine.className).toContain("border-t");
      expect(rightLine.className).toContain("flex-grow");
      expect(rightLine.className).toContain("border-t");
    });
  });
});

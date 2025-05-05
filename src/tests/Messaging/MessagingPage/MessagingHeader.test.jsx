import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import MessagingHeader from "../../../pages/Messaging/MessagingPage/MessagingHeader";

describe("MessagingHeader", () => {
  describe("Rendering", () => {
    it("renders without errors", () => {
      expect(() => render(<MessagingHeader />)).not.toThrow();
    });

    it("displays the 'Messaging' title", () => {
      render(<MessagingHeader />);
      
      const titleElement = screen.getByText("Messaging");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe("H1");
    });
  });

  describe("Styling", () => {
    it("has proper border styling", () => {
      const { container } = render(<MessagingHeader />);
      
      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass("border-b", "border-cardBorder");
    });

    it("has shadow styling", () => {
      const { container } = render(<MessagingHeader />);
      
      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass("shadow-sm");
    });

    it("has proper padding", () => {
      const { container } = render(<MessagingHeader />);
      
      const headerContainer = container.firstChild;
      expect(headerContainer).toHaveClass("py-4");
    });

    it("has responsive layout with max width", () => {
      const { container } = render(<MessagingHeader />);
      
      const innerContainer = container.firstChild.firstChild;
      expect(innerContainer).toHaveClass("max-w-7xl", "mx-auto", "px-4");
    });

    it("has flex layout for content positioning", () => {
      const { container } = render(<MessagingHeader />);
      
      const innerContainer = container.firstChild.firstChild;
      expect(innerContainer).toHaveClass("flex", "items-center", "justify-between");
    });

    it("applies correct text styling to title", () => {
      render(<MessagingHeader />);
      
      const titleElement = screen.getByText("Messaging");
      expect(titleElement).toHaveClass(
        "text-lg", 
        "font-semibold", 
        "text-text", 
        "whitespace-nowrap"
      );
    });
  });

  describe("Accessibility", () => {
    it("uses semantic heading tag for the title", () => {
      render(<MessagingHeader />);
      
      const titleElement = screen.getByText("Messaging");
      expect(titleElement.tagName).toBe("H1");
    });
  });
});
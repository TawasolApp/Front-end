import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import WelcomePage from "../../pages/AuthenticationPages/WelcomePage";

// Mock the child components and assets
vi.mock("../../pages/AuthenticationPages/components/WelcomeForm", () => ({
  default: () => <div data-testid="welcome-form">Welcome Form Mock</div>,
}));

// Fix the image mock to return an object with a default property
vi.mock("../../assets/images/WelcomeImage.jpeg", () => ({
  default: "mock-image-path",
}));

describe("WelcomePage", () => {
  describe("Component Rendering", () => {
    it("renders the component correctly", () => {
      render(<WelcomePage />);
      const headings = screen.getAllByRole("heading");
      expect(headings.some((h) => h.textContent.includes("Welcome"))).toBe(
        true
      );
    });

    it("renders the WelcomeForm component", () => {
      render(<WelcomePage />);
      expect(screen.getAllByTestId("welcome-form").length).toBeGreaterThan(0);
    });

    it("renders the welcome image", () => {
      render(<WelcomePage />);
      const images = screen.getAllByAltText("Welcome to Tawasol");
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute("src", "mock-image-path");
    });
  });

  describe("Mobile & Tablet Layout", () => {
    it("contains the mobile/tablet layout container", () => {
      render(<WelcomePage />);
      const mobileContainer = document.querySelector(".block.lg\\:hidden");
      expect(mobileContainer).toBeInTheDocument();
    });

    it("has the correct heading in mobile/tablet layout", () => {
      render(<WelcomePage />);
      const mobileContainer = document.querySelector(".block.lg\\:hidden");
      const heading = mobileContainer.querySelector("h1");
      expect(heading).toHaveTextContent(
        "Welcome to your professional community"
      );
      expect(heading).toHaveClass("text-3xl");
    });
  });

  describe("Desktop Layout", () => {
    it("contains the desktop layout container", () => {
      render(<WelcomePage />);
      const desktopContainer = document.querySelector(".hidden.lg\\:flex");
      expect(desktopContainer).toBeInTheDocument();
    });

    it("has the correct heading in desktop layout", () => {
      render(<WelcomePage />);
      const desktopContainer = document.querySelector(".hidden.lg\\:flex");
      const heading = desktopContainer.querySelector("h1");
      expect(heading).toHaveTextContent(
        "Welcome to your professional community"
      );
      expect(heading).toHaveClass("text-5xl");
    });

    it("renders welcome form in the left column", () => {
      render(<WelcomePage />);
      const leftColumn = document.querySelector(".flex-1.max-w-2xl.mr-12");
      expect(
        leftColumn.querySelector('[data-testid="welcome-form"]')
      ).toBeInTheDocument();
    });

    it("renders image in the right column", () => {
      render(<WelcomePage />);
      const rightColumn = document.querySelector(
        ".flex-1.max-w-2xl:not(.mr-12)"
      );
      expect(rightColumn.querySelector("img")).toHaveAttribute(
        "src",
        "mock-image-path"
      );
    });
  });

  describe("Background and Text Colors", () => {
    it("applies background color class to main container", () => {
      render(<WelcomePage />);
      const container = document.querySelector(".min-h-screen");
      expect(container).toHaveClass("bg-mainBackground");
    });

    it("applies text color class to headings", () => {
      render(<WelcomePage />);
      const headings = screen.getAllByText(
        "Welcome to your professional community"
      );
      headings.forEach((heading) => {
        expect(heading).toHaveClass("text-textHomeTitle");
      });
    });
  });
});

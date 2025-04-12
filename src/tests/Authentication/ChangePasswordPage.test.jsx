import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Mock child component
vi.mock("../../pages/Authentication/Forms/ChangePasswordForm", () => ({
  default: () => <div data-testid="change-password-form">Change Password Form</div>,
}));

// Import the component after all mocks are set up
import ChangePasswordPage from "../../pages/Authentication/ChangePasswordPage";

describe("ChangePasswordPage", () => {
  const renderChangePasswordPage = () => {
    return render(<ChangePasswordPage />);
  };

  describe("Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderChangePasswordPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the ChangePasswordForm component", () => {
      renderChangePasswordPage();
      const form = screen.getByTestId("change-password-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("UI Styling", () => {
    it("has proper container styling", () => {
      const { container } = renderChangePasswordPage();
      const mainContainer = container.firstChild;
      
      expect(mainContainer).toHaveClass(
        "min-h-screen", 
        "bg-mainBackground", 
        "flex", 
        "items-center", 
        "justify-center"
      );
    });

    it("applies responsive padding", () => {
      const { container } = renderChangePasswordPage();
      const mainContainer = container.firstChild;
      
      expect(mainContainer).toHaveClass("p-4", "sm:p-6", "lg:p-8");
    });
  });
});
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Mock child components
vi.mock("../../pages/Authentication/Forms/NewPasswordForm", () => ({
  default: () => <div data-testid="new-password-form">New Password Form</div>,
}));

vi.mock("../../pages/Authentication/GenericComponents/AuthenticationHeader", () => ({
  default: ({ hideButtons }) => (
    <header data-testid="auth-header">
      Authentication Header
      {hideButtons && <span data-testid="buttons-hidden">Buttons Hidden</span>}
    </header>
  ),
}));

// Import the component after all mocks are set up
import NewPasswordPage from "../../pages/Authentication/NewPasswordPage";

describe("NewPasswordPage", () => {
  const renderNewPasswordPage = () => {
    return render(
      <BrowserRouter>
        <NewPasswordPage />
      </BrowserRouter>
    );
  };

  describe("Component Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderNewPasswordPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the AuthenticationHeader with hideButtons prop", () => {
      renderNewPasswordPage();
      const header = screen.getByTestId("auth-header");
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(header).toBeInTheDocument();
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("renders the NewPasswordForm component", () => {
      renderNewPasswordPage();
      const form = screen.getByTestId("new-password-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("UI Styling", () => {
    it("has a full-screen container with proper styling", () => {
      const { container } = renderNewPasswordPage();
      const mainContainer = container.firstChild;
      
      expect(mainContainer).toHaveClass(
        "min-h-screen", 
        "flex", 
        "items-center", 
        "justify-center", 
        "bg-mainBackground",
        "overflow-x-hidden"
      );
    });

    it("applies responsive padding", () => {
      const { container } = renderNewPasswordPage();
      const mainContainer = container.firstChild;
      
      expect(mainContainer).toHaveClass("px-4", "sm:px-6", "lg:px-8");
    });
  });
});
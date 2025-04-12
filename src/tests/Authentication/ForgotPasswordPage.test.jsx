import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Mock child components
vi.mock("../../pages/Authentication/Forms/ForgotPasswordForm", () => ({
  default: () => (
    <div data-testid="forgot-password-form">Forgot Password Form</div>
  ),
}));

vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: () => (
      <header data-testid="auth-header">Authentication Header</header>
    ),
  }),
);

// Import the component after all mocks are set up
import ForgotPasswordPage from "../../pages/Authentication/ForgotPasswordPage";

describe("ForgotPasswordPage", () => {
  const renderForgotPasswordPage = () => {
    return render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderForgotPasswordPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the AuthenticationHeader component", () => {
      renderForgotPasswordPage();
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
    });

    it("renders the ForgotPasswordForm component", () => {
      renderForgotPasswordPage();
      const form = screen.getByTestId("forgot-password-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("UI Styling", () => {
    it("has proper container styling", () => {
      const { container } = renderForgotPasswordPage();
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveClass(
        "min-h-screen",
        "bg-mainBackground",
        "overflow-x-hidden",
      );
    });

    it("has responsive padding", () => {
      const { container } = renderForgotPasswordPage();

      // Find the div with responsive padding classes
      const responsiveContainer = container.querySelector(
        ".px-4.sm\\:px-6.lg\\:px-8",
      );

      expect(responsiveContainer).toBeInTheDocument();
    });
  });
});

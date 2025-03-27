import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import WelcomeForm from "../../../pages/AuthenticationPages/components/WelcomeForm";
import { BrowserRouter } from "react-router-dom";

// Mock the SignWithGoogle component
vi.mock("../../../pages/AuthenticationPages/components/SignWithGoogle", () => ({
  default: () => <div data-testid="google-signin">Sign with Google Mock</div>,
}));

// Mock the useNavigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("WelcomeForm", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockNavigate.mockClear();
  });

  // Helper function to render with router context
  const renderForm = () => {
    return render(
      <BrowserRouter>
        <WelcomeForm />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the component without crashing", () => {
      const { container } = renderForm();
      expect(container).toBeInTheDocument();
    });

    it("renders the SignWithGoogle component", () => {
      renderForm();
      expect(screen.getByTestId("google-signin")).toBeInTheDocument();
    });

    it('renders the "Sign in with Email" button', () => {
      renderForm();
      expect(screen.getByText("Sign in with Email")).toBeInTheDocument();
    });

    it('renders the "Join now" link', () => {
      renderForm();
      const joinNowLink = screen.getByText("Join now");
      expect(joinNowLink).toBeInTheDocument();
      expect(joinNowLink.tagName.toLowerCase()).toBe("a");
      expect(joinNowLink).toHaveAttribute("href", "/auth/signup");
    });
  });

  describe("User Interactions", () => {
    it('navigates to sign in page when "Sign in with Email" button is clicked', () => {
      renderForm();
      const signInButton = screen.getByText("Sign in with Email");

      fireEvent.click(signInButton);

      // Check that navigate was called with the correct path
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin");
    });
  });

  describe("Styling", () => {
    it("applies styling classes to the email button", () => {
      renderForm();
      const signInButton = screen.getByText("Sign in with Email");

      // Check for some of the classes that should be applied
      expect(signInButton).toHaveClass("w-full");
      expect(signInButton).toHaveClass("rounded-full");
      expect(signInButton).toHaveClass("border-2");
    });

    it('styles the "Join now" text appropriately', () => {
      renderForm();
      const newToTawasolText = screen.getByText(/New to Tawasol\?/);
      const joinNowLink = screen.getByText("Join now");

      expect(newToTawasolText).toHaveClass("text-textPlaceholder");
      expect(joinNowLink).toHaveClass("text-buttonSubmitEnable");
    });
  });
});

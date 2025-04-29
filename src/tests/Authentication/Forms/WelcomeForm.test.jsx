import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock SignWithGoogle component
vi.mock(
  "../../../pages/Authentication/GenericComponents/SignWithGoogle",
  () => ({
    default: () => (
      <div data-testid="google-sign-in">Sign with Google Component</div>
    ),
  }),
);

// Import the component after all mocks are set up
import WelcomeForm from "../../../pages/Authentication/Forms/WelcomeForm";

describe("WelcomeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWelcomeForm = () => {
    return render(
      <BrowserRouter>
        <WelcomeForm />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the welcome form without crashing", () => {
      const { container } = renderWelcomeForm();
      expect(container).toBeInTheDocument();
    });

    it("renders SignWithGoogle component", () => {
      renderWelcomeForm();
      const googleSignIn = screen.getByTestId("google-sign-in");
      expect(googleSignIn).toBeInTheDocument();
    });

    it("renders sign-in with email button", () => {
      renderWelcomeForm();
      const signInButton = screen.getByRole("button", {
        name: /sign in with email/i,
      });
      expect(signInButton).toBeInTheDocument();
    });

    it("displays 'New to Tawasol?' text", () => {
      renderWelcomeForm();
      const newUserText = screen.getByText(/new to tawasol\?/i);
      expect(newUserText).toBeInTheDocument();
    });

    it("renders 'Join now' link", () => {
      renderWelcomeForm();
      const joinLink = screen.getByRole("link", { name: /join now/i });
      expect(joinLink).toBeInTheDocument();
      expect(joinLink).toHaveAttribute("href", "/auth/signup");
    });
  });

  describe("Navigation", () => {
    it("navigates to sign in page when 'Sign in with Email' button is clicked", () => {
      renderWelcomeForm();
      const signInButton = screen.getByRole("button", {
        name: /sign in with email/i,
      });

      fireEvent.click(signInButton);

      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin");
    });
  });

  describe("UI Styling", () => {
    it("applies appropriate styling to sign in button", () => {
      renderWelcomeForm();
      const signInButton = screen.getByRole("button", {
        name: /sign in with email/i,
      });

      // Check for important styling classes
      expect(signInButton.className).toMatch(/w-full/);
      expect(signInButton.className).toMatch(/rounded-full/);
      expect(signInButton.className).toMatch(/border-/);
      expect(signInButton.className).toMatch(/transition/);
    });

    it("has responsive styling", () => {
      const { container } = renderWelcomeForm();

      // Look for responsive class patterns
      const responsiveClasses = container.innerHTML.match(/sm:|md:|lg:/g);
      expect(responsiveClasses).not.toBeNull();
    });

    it("applies text styling for Join now link", () => {
      renderWelcomeForm();
      const joinLink = screen.getByRole("link", { name: /join now/i });

      expect(joinLink.className).toMatch(/text-buttonSubmitEnable/);
      expect(joinLink.className).toMatch(/hover:underline/);
    });
  });

  describe("Component Structure", () => {
    it("has the correct container structure", () => {
      const { container } = renderWelcomeForm();
      const mainContainer = container.firstChild;


      // Check for correct content hierarchy
      const children = Array.from(mainContainer.children);
      expect(children.length).toBe(3); // SignWithGoogle + button + paragraph
    });
  });
});

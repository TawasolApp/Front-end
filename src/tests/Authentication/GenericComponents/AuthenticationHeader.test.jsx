import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockGetIconComponent = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock utils
vi.mock("../../../utils", () => ({
  getIconComponent: (name) => mockGetIconComponent(name),
}));

// Set up the mock Logo component
beforeEach(() => {
  // Mock the logo component that getIconComponent returns
  mockGetIconComponent.mockReturnValue(({ className }) => (
    <div data-testid="mock-logo" className={className}>
      Mock Logo
    </div>
  ));
});

// Import the component after all mocks are set up
import AuthenticationHeader from "../../../pages/Authentication/GenericComponents/AuthenticationHeader";

describe("AuthenticationHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with logo and title", () => {
      render(<AuthenticationHeader />);

      // Check logo is rendered
      const logo = screen.getByTestId("mock-logo");
      expect(logo).toBeInTheDocument();

      // Check title is rendered
      const title = screen.getByText("Tawasol");
      expect(title).toBeInTheDocument();
    });

    it("renders buttons when hideButtons is false", () => {
      render(<AuthenticationHeader hideButtons={false} />);

      // Check both buttons are rendered
      const joinButton = screen.getByText("Join now");
      const signInButton = screen.getByText("Sign in");

      expect(joinButton).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
    });

    it("does not render buttons when hideButtons is true", () => {
      render(<AuthenticationHeader hideButtons={true} />);

      // Check both buttons are not rendered
      const joinButton = screen.queryByText("Join now");
      const signInButton = screen.queryByText("Sign in");

      expect(joinButton).not.toBeInTheDocument();
      expect(signInButton).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to signup page when Join now is clicked", () => {
      render(<AuthenticationHeader />);

      const joinButton = screen.getByText("Join now");
      fireEvent.click(joinButton);

      expect(mockNavigate).toHaveBeenCalledWith("/auth/signup");
    });

    it("navigates to signin page when Sign in is clicked", () => {
      render(<AuthenticationHeader />);

      const signInButton = screen.getByText("Sign in");
      fireEvent.click(signInButton);

      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin");
    });
  });

  describe("Styling changes", () => {
    it("has different styling when hideButtons is true", () => {
      const { container: hiddenContainer } = render(
        <AuthenticationHeader hideButtons={true} />,
      );
      const navHidden = hiddenContainer.querySelector("nav");

      // Check the nav has the absolute positioning class when hideButtons=true
      expect(navHidden.className).toContain("absolute");

      // Check the inner div has justify-start class
      const divHidden = navHidden.querySelector("div");
      expect(divHidden.className).toContain("justify-start");
    });

    it("has standard styling when hideButtons is false", () => {
      const { container: standardContainer } = render(
        <AuthenticationHeader hideButtons={false} />,
      );
      const navStandard = standardContainer.querySelector("nav");

      // Check the nav doesn't have the absolute positioning class when hideButtons=false
      expect(navStandard.className).not.toContain("absolute");

      // Check the inner div has justify-between class
      const divStandard = navStandard.querySelector("div");
      expect(divStandard.className).toContain("justify-between");
    });
  });

  describe("Icon loading", () => {
    it("calls getIconComponent with correct icon name", () => {
      render(<AuthenticationHeader />);

      expect(mockGetIconComponent).toHaveBeenCalledWith("tawasol-icon");
    });
  });
});

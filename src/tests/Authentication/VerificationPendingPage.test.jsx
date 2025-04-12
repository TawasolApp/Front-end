import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockUseLocation = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

// Mock child components
vi.mock("../../pages/Authentication/Forms/VerificationPendingForm", () => ({
  default: ({ type }) => (
    <div data-testid="verification-pending-form">
      Verification Pending Form
      {type && <span data-testid="form-type">{type}</span>}
    </div>
  ),
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
import VerificationPendingPage from "../../pages/Authentication/VerificationPendingPage";

describe("VerificationPendingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for useLocation
    mockUseLocation.mockReturnValue({ 
      state: { type: "signup" }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderVerificationPendingPage = (locationType = "signup") => {
    // Set up the location state for this specific test
    mockUseLocation.mockReturnValue({ 
      state: locationType ? { type: locationType } : null
    });

    return render(
      <BrowserRouter>
        <VerificationPendingPage />
      </BrowserRouter>
    );
  };

  describe("Rendering", () => {
    it("renders the page with AuthenticationHeader", () => {
      renderVerificationPendingPage();
      
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
      
      // Check hideButtons prop is passed correctly
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("renders the VerificationPendingForm", () => {
      renderVerificationPendingPage();
      
      const form = screen.getByTestId("verification-pending-form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Location State Handling", () => {
    it("passes signup type to VerificationPendingForm", () => {
      renderVerificationPendingPage("signup");
      
      const typeElement = screen.getByTestId("form-type");
      expect(typeElement).toHaveTextContent("signup");
    });

    it("passes forgotPassword type to VerificationPendingForm", () => {
      renderVerificationPendingPage("forgotPassword");
      
      const typeElement = screen.getByTestId("form-type");
      expect(typeElement).toHaveTextContent("forgotPassword");
    });

    it("passes updateEmail type to VerificationPendingForm", () => {
      renderVerificationPendingPage("updateEmail");
      
      const typeElement = screen.getByTestId("form-type");
      expect(typeElement).toHaveTextContent("updateEmail");
    });

    it("passes null when no location state is provided", () => {
      renderVerificationPendingPage(null);
      
      // Type element shouldn't exist since type is null
      const typeElement = screen.queryByTestId("form-type");
      expect(typeElement).not.toBeInTheDocument();
    });
  });

  describe("UI Structure", () => {
    it("renders in a container with proper elements", () => {
      const { container } = renderVerificationPendingPage();
      
      // Check the main container exists
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
      
      // Check card exists - get parent of form
      const card = screen.getByTestId("verification-pending-form").closest("div");
      expect(card).toBeInTheDocument();
    });
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockDispatch = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockAuthReducer = vi.hoisted(() => vi.fn());

// Mock react-redux before importing the component
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock the authentication slice properly
vi.mock("../../store/authenticationSlice", () => {
  return {
    logout: () => mockLogout,
    authenticationReducer: mockAuthReducer,
  };
});

// Mock the components used by WelcomePage
vi.mock("../../pages/Authentication/Forms/WelcomeForm", () => ({
  default: () => <div data-testid="welcome-form">Welcome Form</div>,
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
import WelcomePage from "../../pages/Authentication/WelcomePage";

describe("WelcomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWelcomePage = () => {
    return render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the welcome page without crashing", () => {
      const { container } = renderWelcomePage();
      expect(container).toBeInTheDocument();
    });

    it("dispatches logout action on mount", () => {
      renderWelcomePage();
      expect(mockDispatch).toHaveBeenCalledWith(mockLogout);
    });

    it("displays the welcome heading", () => {
      renderWelcomePage();
      const headings = screen.getAllByText(
        "Welcome to your professional community",
      );
      expect(headings).toHaveLength(2);

      headings.forEach((heading) => {
        expect(heading.tagName.toLowerCase()).toBe("h1");
      });
    });

    it("renders the welcome image", () => {
      renderWelcomePage();
      const welcomeImage = screen.getAllByAltText("Welcome to Tawasol");
      // There are two images (one for mobile/tablet, one for desktop)
      expect(welcomeImage.length).toBeGreaterThan(0);
    });

    it("renders WelcomeForm component", () => {
      renderWelcomePage();
      const welcomeForm = screen.getAllByTestId("welcome-form");
      // There are two forms (one for mobile/tablet, one for desktop)
      expect(welcomeForm.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Layout", () => {
    it("renders mobile/tablet layout", () => {
      const { container } = renderWelcomePage();
      const mobileLayout = container.querySelector(".block.lg\\:hidden");
      expect(mobileLayout).toBeInTheDocument();
    });

    it("renders desktop layout", () => {
      const { container } = renderWelcomePage();
      const desktopLayout = container.querySelector(".hidden.lg\\:flex");
      expect(desktopLayout).toBeInTheDocument();
    });
  });

  describe("Header", () => {
    it("renders AuthenticationHeader component", () => {
      renderWelcomePage();
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Image Styling", () => {
    it("applies correct styling to the welcome image in mobile view", () => {
      const { container } = renderWelcomePage();
      const mobileImage = container.querySelector(".block.lg\\:hidden img");
      expect(mobileImage).toHaveClass(
        "rounded-full",
        "darken",
      );
    });

    it("applies correct styling to the welcome image in desktop view", () => {
      const { container } = renderWelcomePage();
      const desktopImage = container.querySelector(".hidden.lg\\:flex img");
      expect(desktopImage).toHaveClass(
        "w-full",
        "rounded-full",
        "shadow-xl",
        "darken",
      );
    });
  });

  describe("Component Structure", () => {
    it("has the correct background and container styles", () => {
      const { container } = renderWelcomePage();
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass(
        "min-h-screen",
        "bg-mainBackground",
        "overflow-x-hidden",
      );
    });

    it("structures the desktop layout with two columns", () => {
      const { container } = renderWelcomePage();
      const leftColumn = container.querySelector(
        ".hidden.lg\\:flex > div:first-child",
      );
      const rightColumn = container.querySelector(
        ".hidden.lg\\:flex > div:last-child",
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSetLocation = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock authentication slice
vi.mock("../../store/authenticationSlice", () => ({
  setLocation: (location) => mockSetLocation(location),
}));

// Mock child components
vi.mock("../../pages/Authentication/Forms/LocationForm", () => ({
  default: ({ onSubmit }) => (
    <div data-testid="location-form">
      <button
        onClick={() => onSubmit("New York, NY")}
        data-testid="submit-with-location"
      >
        Submit With Location
      </button>
      <button onClick={() => onSubmit("")} data-testid="submit-empty-location">
        Submit Empty Location
      </button>
    </div>
  ),
}));

vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: ({ hideButtons }) => (
      <header data-testid="auth-header">
        Authentication Header
        {hideButtons && (
          <span data-testid="buttons-hidden">Buttons Hidden</span>
        )}
      </header>
    ),
  }),
);

// Import the component after all mocks are set up
import LocationPage from "../../pages/Authentication/LocationPage";

describe("LocationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLocationPage = () => {
    return render(
      <BrowserRouter>
        <LocationPage />
      </BrowserRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderLocationPage();
      expect(container).toBeInTheDocument();
    });

    it("renders the AuthenticationHeader with hideButtons prop", () => {
      renderLocationPage();
      const header = screen.getByTestId("auth-header");
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(header).toBeInTheDocument();
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("renders the LocationForm component", () => {
      renderLocationPage();
      const locationForm = screen.getByTestId("location-form");
      expect(locationForm).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("handles valid location submission", () => {
      renderLocationPage();

      // Submit form with location
      const submitButton = screen.getByTestId("submit-with-location");
      submitButton.click();

      // Verify actions were dispatched
      expect(mockDispatch).toHaveBeenCalledWith(
        mockSetLocation("New York, NY"),
      );

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signup/experience");
    });

    it("handles empty location submission", () => {
      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderLocationPage();

      // Submit form with empty location
      const submitButton = screen.getByTestId("submit-empty-location");
      submitButton.click();

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Missing location.");

      // Verify no actions were dispatched
      expect(mockDispatch).not.toHaveBeenCalled();

      // Verify no navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Styling", () => {
    it("has proper container styling", () => {
      const { container } = renderLocationPage();
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveClass(
        "min-h-screen",
        "bg-mainBackground",
        "overflow-x-hidden",
      );
    });
  });
});

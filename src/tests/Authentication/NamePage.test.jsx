import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSetFirstName = vi.hoisted(() => vi.fn());
const mockSetLastName = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockUseSelector = vi.hoisted(() =>
  vi.fn().mockImplementation(() => ({
    email: "test@example.com",
    password: "password123",
    isNewGoogleUser: false,
  })),
);

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
  useSelector: (selector) => mockUseSelector(selector),
}));

// Mock authentication slice
vi.mock("../../store/authenticationSlice", () => ({
  setFirstName: (firstName) => mockSetFirstName(firstName),
  setLastName: (lastName) => mockSetLastName(lastName),
}));

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
  },
}));

// Mock child components
vi.mock("../../pages/Authentication/Forms/NameForm", () => ({
  default: ({ onSubmit }) => (
    <div data-testid="name-form">
      <button
        onClick={() => onSubmit({ firstName: "John", lastName: "Doe" })}
        data-testid="mock-submit-button"
      >
        Submit Form
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
import NamePage from "../../pages/Authentication/NamePage";

describe("NamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNamePage = () => {
    return render(
      <BrowserRouter>
        <NamePage />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the page without crashing", () => {
      const { container } = renderNamePage();
      expect(container).toBeInTheDocument();
    });

    it("renders the AuthenticationHeader with hideButtons prop", () => {
      renderNamePage();
      const header = screen.getByTestId("auth-header");
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(header).toBeInTheDocument();
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("displays the heading text", () => {
      renderNamePage();
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(
        "Make the most of your professional life",
      );
    });

    it("renders the NameForm component", () => {
      renderNamePage();
      const nameForm = screen.getByTestId("name-form");
      expect(nameForm).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    // it("handles normal user registration", async () => {
    //   // Mock successful API response
    //   mockPost.mockResolvedValueOnce({});

    //   renderNamePage();

    //   // Trigger form submission
    //   const submitButton = screen.getByTestId("mock-submit-button");
    //   submitButton.click();

    //   // Verify actions were dispatched
    //   expect(mockDispatch).toHaveBeenCalledWith(mockSetFirstName("John"));
    //   expect(mockDispatch).toHaveBeenCalledWith(mockSetLastName("Doe"));

    //   // Verify API call was made
    //   expect(mockPost).toHaveBeenCalledWith("/auth/register", {
    //     email: "test@example.com",
    //     password: "password123",
    //     firstName: "John",
    //     lastName: "Doe",
    //     captchaToken: "test-token",
    //   });

    //   // Wait for the async operation to complete before checking navigation
    //   await waitFor(() => {
    //     expect(mockNavigate).toHaveBeenCalledWith(
    //       "/auth/verification-pending",
    //       {
    //         state: { type: "verifyEmail" },
    //       },
    //     );
    //   });
    // });

    it("handles Google user registration differently", async () => {
      // Change mock to return Google user
      mockUseSelector.mockReturnValueOnce({
        email: "google@example.com",
        password: "",
        isNewGoogleUser: true,
      });

      renderNamePage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Verify no API call was made
      expect(mockPost).not.toHaveBeenCalled();

      // Verify navigation to location page
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signup/location");
    });

    it("handles missing credentials error", async () => {
      // Mock missing credentials
      mockUseSelector.mockReturnValueOnce({
        email: "",
        password: "",
        isNewGoogleUser: false,
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderNamePage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error: Missing email or password. Please sign up again.",
      );

      // Verify no navigation happened
      expect(mockNavigate).not.toHaveBeenCalled();

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });

    it("handles API errors", async () => {
      // Mock API error
      mockPost.mockRejectedValueOnce({
        response: { data: { message: "Registration failed" } },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderNamePage();

      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();

      // Need to wait for the async error handling
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Styling", () => {
    it("has proper container styling", () => {
      const { container } = renderNamePage();
      const mainContainer = container.firstChild;

      expect(mainContainer).toHaveClass(
        "min-h-screen",
        "bg-mainBackground",
        "overflow-x-hidden",
      );
    });

    it("has responsive styling", () => {
      const { container } = renderNamePage();

      // Check for responsive classes
      expect(container.innerHTML).toMatch(/sm:|md:|lg:/);
    });

    it("applies card styling to form container", () => {
      const { container } = renderNamePage();

      // Find the container with the bg-cardBackground class
      // This is more reliable than using closest("div")
      const formContainer = container.querySelector(".bg-cardBackground");

      // Verify it exists
      expect(formContainer).toBeInTheDocument();

      // Check each class separately (more reliable than checking all at once)
      expect(formContainer).toHaveClass("bg-cardBackground");
      expect(formContainer).toHaveClass("rounded-lg");
      expect(formContainer).toHaveClass("shadow-lg");
    });
  });
});

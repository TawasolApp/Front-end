import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Create mock functions with vi.hoisted()
const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockSetEmail = vi.hoisted(() => vi.fn());
const mockSetToken = vi.hoisted(() => vi.fn());
const mockSetRefreshToken = vi.hoisted(() => vi.fn());
const mockSetIsSocialLogin = vi.hoisted(() => vi.fn());
const mockSetType = vi.hoisted(() => vi.fn());
const mockSetUserId = vi.hoisted(() => vi.fn());
const mockSetFirstName = vi.hoisted(() => vi.fn());
const mockSetLastName = vi.hoisted(() => vi.fn());
const mockSetLocation = vi.hoisted(() => vi.fn());
const mockSetBio = vi.hoisted(() => vi.fn());
const mockSetProfilePicture = vi.hoisted(() => vi.fn());
const mockSetCoverPhoto = vi.hoisted(() => vi.fn());
const mockSetRole = vi.hoisted(() => vi.fn());
const mockSetIsPremium = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
const mockToast = vi.hoisted(() => ({ error: vi.fn() }));

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

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: mockToast
}));

// Mock authentication slice
vi.mock("../../store/authenticationSlice", () => ({
  logout: () => mockLogout,
  setEmail: (email) => mockSetEmail(email),
  setToken: (token) => mockSetToken(token),
  setRefreshToken: (token) => mockSetRefreshToken(token),
  setIsSocialLogin: (value) => mockSetIsSocialLogin(value),
  setType: (type) => mockSetType(type),
  setUserId: (id) => mockSetUserId(id),
  setFirstName: (name) => mockSetFirstName(name),
  setLastName: (name) => mockSetLastName(name),
  setLocation: (location) => mockSetLocation(location),
  setBio: (bio) => mockSetBio(bio),
  setProfilePicture: (url) => mockSetProfilePicture(url),
  setCoverPhoto: (url) => mockSetCoverPhoto(url),
  setRole: (role) => mockSetRole(role),
  setIsPremium: (isPremium) => mockSetIsPremium(isPremium),
}));

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: (url, data) => mockPost(url, data),
    get: (url) => mockGet(url),
  },
}));

// Mock child components with correct paths
vi.mock("../../pages/Authentication/Forms/SignInForm", () => ({
  default: ({ onSubmit, isLoading }) => (
    <div data-testid="signin-form">
      <span data-testid="loading-state">{isLoading ? "Loading" : "Not Loading"}</span>
      <button
        onClick={() =>
          onSubmit(
            { email: "test@example.com", password: "password123" },
            vi.fn(),
          )
        }
        data-testid="mock-submit-button"
      >
        Sign In
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
import SignInPage from "../../pages/Authentication/SignInPage";

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInPage = () => {
    return render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>,
    );
  };

  describe("Component Rendering", () => {
    it("renders the signin page without crashing", () => {
      const { container } = renderSignInPage();
      expect(container).toBeInTheDocument();
    });

    it("dispatches logout action on mount", () => {
      renderSignInPage();
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("renders the AuthenticationHeader with hidden buttons", () => {
      renderSignInPage();
      const header = screen.getByTestId("auth-header");
      expect(header).toBeInTheDocument();
      expect(screen.getByTestId("buttons-hidden")).toBeInTheDocument();
    });

    it("renders the SignInForm component with loading state", () => {
      renderSignInPage();
      const signInForm = screen.getByTestId("signin-form");
      const loadingState = screen.getByTestId("loading-state");
      expect(signInForm).toBeInTheDocument();
      expect(loadingState).toHaveTextContent("Not Loading");
    });

    it("displays the 'New to Tawasol?' text", () => {
      renderSignInPage();
      expect(screen.getByText("New to Tawasol?")).toBeInTheDocument();
    });

    it("displays the 'Join now' link", () => {
      renderSignInPage();
      expect(screen.getByText("Join now")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("handles successful sign in and profile fetch for regular user", async () => {
      // Mock successful login response
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "test-token",
          refreshToken: "test-refresh-token",
          is_social_login: false,
          role: "user"
        },
      });

      // Mock successful profile response
      mockGet.mockResolvedValueOnce({
        status: 200,
        data: {
          _id: "user123",
          firstName: "John",
          lastName: "Doe",
          location: "New York",
          headline: "Software Developer",
          profilePicture: "profile-url",
          coverPhoto: "cover-url",
          isPremium: true
        },
      });

      renderSignInPage();

      // Check initial loading state
      expect(screen.getByTestId("loading-state")).toHaveTextContent("Not Loading");

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
        
        // Should be loading now
        expect(screen.getByTestId("loading-state")).toHaveTextContent("Loading");
      });

      // Should no longer be loading
      expect(screen.getByTestId("loading-state")).toHaveTextContent("Not Loading");

      // Verify API calls
      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });

      expect(mockGet).toHaveBeenCalledWith("/profile");

      // Check authentication related dispatches
      expect(mockSetEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockSetToken).toHaveBeenCalledWith("test-token");
      expect(mockSetRefreshToken).toHaveBeenCalledWith("test-refresh-token");
      expect(mockSetIsSocialLogin).toHaveBeenCalledWith(false);
      expect(mockSetRole).toHaveBeenCalledWith("user");

      // Check profile related dispatches
      expect(mockSetType).toHaveBeenCalledWith("User");
      expect(mockSetUserId).toHaveBeenCalledWith("user123");
      expect(mockSetFirstName).toHaveBeenCalledWith("John");
      expect(mockSetLastName).toHaveBeenCalledWith("Doe");
      expect(mockSetLocation).toHaveBeenCalledWith("New York");
      expect(mockSetBio).toHaveBeenCalledWith("Software Developer");
      expect(mockSetProfilePicture).toHaveBeenCalledWith("profile-url");
      expect(mockSetCoverPhoto).toHaveBeenCalledWith("cover-url");
      expect(mockSetIsPremium).toHaveBeenCalledWith(true);

      // Check navigation
      expect(mockNavigate).toHaveBeenCalledWith("/feed");
    });

    it("routes admin users to admin panel", async () => {
      // Mock successful login response for admin
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "admin-token",
          refreshToken: "admin-refresh-token",
          is_social_login: false,
          role: "admin"
        },
      });

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Verify admin-specific behavior
      expect(mockSetRole).toHaveBeenCalledWith("admin");
      expect(mockNavigate).toHaveBeenCalledWith("/AdminPanel");
      
      // Profile fetch should not have happened
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("handles missing profile and redirects to location setup", async () => {
      // Mock successful login response
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "test-token",
          refreshToken: "test-refresh-token",
          is_social_login: false,
          role: "user"
        },
      });

      // Mock profile not found
      mockGet.mockRejectedValueOnce({
        response: { status: 404 }
      });

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Verify navigation to profile setup
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signup/location");
    });

    it("handles missing profile fields gracefully", async () => {
      // Mock successful login response
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "test-token",
          refreshToken: "test-refresh-token",
          is_social_login: false,
          role: "user"
        },
      });

      // Mock profile response with minimal data
      mockGet.mockResolvedValueOnce({
        status: 200,
        data: {
          _id: "user123",
          // No other fields
        },
      });

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Only the provided fields should be set
      expect(mockSetUserId).toHaveBeenCalledWith("user123");
      expect(mockSetFirstName).not.toHaveBeenCalled();
      expect(mockSetLastName).not.toHaveBeenCalled();

      // Navigation should still happen
      expect(mockNavigate).toHaveBeenCalledWith("/feed");
    });

    it("handles invalid credentials error", async () => {
      // Mock API response for invalid credentials
      mockPost.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Invalid email or password." },
        },
      });

      const mockSetCredentialsError = vi.fn();

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Navigation should not have happened
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("handles suspended account error", async () => {
      // Mock API response for suspended account
      mockPost.mockRejectedValueOnce({
        response: {
          status: 403,
        },
        message: "Your account is suspended. Please try again later."
      });

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Navigation should not have happened
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("handles email not verified error", async () => {
      // Mock API response for unverified email
      mockPost.mockRejectedValueOnce({
        response: {
          status: 403,
        },
        message: "Something else"
      });

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Navigation should not have happened
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("handles unexpected errors", async () => {
      // Mock API response for unexpected error
      mockPost.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: "Server error" },
        },
      });

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Verify error was logged and toast was shown
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith(
        "Login failed, please try again.",
        expect.objectContaining({ 
          position: "top-right",
          autoClose: 3000 
        })
      );

      consoleErrorSpy.mockRestore();
    });

    it("handles network errors", async () => {
      // Mock API response for network error
      mockPost.mockRejectedValueOnce(new Error("Network Error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderSignInPage();

      // Trigger form submission
      await act(async () => {
        screen.getByTestId("mock-submit-button").click();
      });

      // Verify error was logged and toast was shown
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Structure", () => {
    it("has a container with proper styling classes", () => {
      const { container } = renderSignInPage();
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("min-h-screen");
    });

    it("contains elements with responsive styling classes", () => {
      const { container } = renderSignInPage();
      // Check for responsive classes
      expect(container.innerHTML).toMatch(/sm:|md:|lg:/);
    });
  });
});
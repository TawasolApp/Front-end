import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
const mockPost = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());

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
  default: (props) => (
    <div data-testid="signin-form">
      <button 
        onClick={() => props.onSubmit?.({ email: "test@example.com", password: "password123" }, vi.fn())}
        data-testid="mock-submit-button"
      >
        Sign In
      </button>
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
import SignInPage from "../../pages/Authentication/SignInPage";

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInPage = () => {
    return render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
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

    it("renders the SignInForm component", () => {
      renderSignInPage();
      const signInForm = screen.getByTestId("signin-form");
      expect(signInForm).toBeInTheDocument();
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
    it("handles successful sign in and profile fetch", async () => {
      // Mock successful login response
      mockPost.mockResolvedValueOnce({ 
        status: 201,
        data: {
          token: "test-token",
          refreshToken: "test-refresh-token",
          isSocialLogin: false
        }
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
          coverPhoto: "cover-url"
        }
      });
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith("/auth/login", {
          email: "test@example.com",
          password: "password123"
        });
        expect(mockGet).toHaveBeenCalledWith("/profile");
        
        // Check authentication related dispatches
        expect(mockSetEmail).toHaveBeenCalledWith("test@example.com");
        expect(mockSetToken).toHaveBeenCalledWith("test-token");
        expect(mockSetRefreshToken).toHaveBeenCalledWith("test-refresh-token");
        expect(mockSetIsSocialLogin).toHaveBeenCalledWith(false);
        
        // Check profile related dispatches
        expect(mockSetType).toHaveBeenCalledWith("User");
        expect(mockSetUserId).toHaveBeenCalledWith("user123");
        expect(mockSetFirstName).toHaveBeenCalledWith("John");
        expect(mockSetLastName).toHaveBeenCalledWith("Doe");
        expect(mockSetLocation).toHaveBeenCalledWith("New York");
        expect(mockSetBio).toHaveBeenCalledWith("Software Developer");
        expect(mockSetProfilePicture).toHaveBeenCalledWith("profile-url");
        expect(mockSetCoverPhoto).toHaveBeenCalledWith("cover-url");
        
        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/feed");
      });
    });

    it("handles missing profile fields gracefully", async () => {
      // Mock successful login response
      mockPost.mockResolvedValueOnce({ 
        status: 201,
        data: {
          token: "test-token",
          refreshToken: "test-refresh-token",
          isSocialLogin: false
        }
      });

      // Mock profile response with minimal data
      mockGet.mockResolvedValueOnce({
        status: 200,
        data: {
          _id: "user123"
          // No other fields
        }
      });
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        // Only these should be called since other fields are missing
        expect(mockSetType).toHaveBeenCalledWith("User");
        expect(mockSetUserId).toHaveBeenCalledWith("user123");
        expect(mockNavigate).toHaveBeenCalledWith("/feed");
        
        // These should not be called
        expect(mockSetFirstName).not.toHaveBeenCalled();
        expect(mockSetLastName).not.toHaveBeenCalled();
        expect(mockSetLocation).not.toHaveBeenCalled();
        expect(mockSetBio).not.toHaveBeenCalled();
      });
    });

    it("handles invalid credentials error", async () => {
      // Mock API response for invalid credentials
      mockPost.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Invalid email or password." }
        }
      });
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
        // Navigation should not have happened
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
    
    it("handles email not verified error", async () => {
      // Mock API response for unverified email
      mockPost.mockRejectedValueOnce({
        response: {
          status: 403,
          data: { message: "Email not verified." }
        }
      });
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
        // Navigation should not have happened
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
    
    it("handles unexpected errors", async () => {
      // Mock API response for unexpected error
      mockPost.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: "Server error" }
        }
      });
      
      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    it("handles network errors", async () => {
      // Mock API response for network error
      mockPost.mockRejectedValueOnce(new Error("Network Error"));
      
      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      renderSignInPage();
      
      // Trigger form submission
      const submitButton = screen.getByTestId("mock-submit-button");
      submitButton.click();
      
      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Styling", () => {
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
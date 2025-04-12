import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockDispatch = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockGetIconComponent = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());

// Hoist mock actions - this is the key fix
const mockSetToken = vi.hoisted(() => vi.fn(() => "SET_TOKEN_ACTION"));
const mockSetRefreshToken = vi.hoisted(() =>
  vi.fn(() => "SET_REFRESH_TOKEN_ACTION"),
);
const mockSetFirstName = vi.hoisted(() => vi.fn(() => "SET_FIRST_NAME_ACTION"));
const mockSetLastName = vi.hoisted(() => vi.fn(() => "SET_LAST_NAME_ACTION"));
const mockSetLocation = vi.hoisted(() => vi.fn(() => "SET_LOCATION_ACTION"));
const mockSetBio = vi.hoisted(() => vi.fn(() => "SET_BIO_ACTION"));
const mockSetType = vi.hoisted(() => vi.fn(() => "SET_TYPE_ACTION"));
const mockSetProfilePicture = vi.hoisted(() =>
  vi.fn(() => "SET_PROFILE_PICTURE_ACTION"),
);
const mockSetIsNewGoogleUser = vi.hoisted(() =>
  vi.fn(() => "SET_IS_NEW_GOOGLE_USER_ACTION"),
);
const mockSetUserId = vi.hoisted(() => vi.fn(() => "SET_USER_ID_ACTION"));
const mockSetCoverPhoto = vi.hoisted(() =>
  vi.fn(() => "SET_COVER_PHOTO_ACTION"),
);
const mockSetEmail = vi.hoisted(() => vi.fn(() => "SET_EMAIL_ACTION"));
const mockSetIsSocialLogin = vi.hoisted(() =>
  vi.fn(() => "SET_IS_SOCIAL_LOGIN_ACTION"),
);

// Mock env variable
vi.mock("import.meta", () => ({
  env: {
    VITE_GOOGLE_CLIENT_ID: "mock-client-id",
  },
}));

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock utils
vi.mock("../../../utils", () => ({
  getIconComponent: (name) => mockGetIconComponent(name),
}));

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
  },
}));

// Mock redux actions
vi.mock("../../../store/authenticationSlice", () => ({
  setToken: mockSetToken,
  setRefreshToken: mockSetRefreshToken,
  setFirstName: mockSetFirstName,
  setLastName: mockSetLastName,
  setLocation: mockSetLocation,
  setBio: mockSetBio,
  setType: mockSetType,
  setProfilePicture: mockSetProfilePicture,
  setIsNewGoogleUser: mockSetIsNewGoogleUser,
  setUserId: mockSetUserId,
  setCoverPhoto: mockSetCoverPhoto,
  setEmail: mockSetEmail,
  setIsSocialLogin: mockSetIsSocialLogin,
}));

// Import the component after all mocks are set up
import SignWithGoogle from "../../../pages/Authentication/GenericComponents/SignWithGoogle";

describe("SignWithGoogle", () => {
  const mockRequestAccessToken = vi.fn();
  const mockInitTokenClient = vi.fn().mockReturnValue({
    requestAccessToken: mockRequestAccessToken,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock GoogleGIcon component
    mockGetIconComponent.mockReturnValue(({ className }) => (
      <div data-testid="google-icon" className={className}>
        Google Icon
      </div>
    ));

    // Mock window.google
    global.window = {
      ...global.window,
      google: {
        accounts: {
          oauth2: {
            initTokenClient: mockInitTokenClient,
          },
        },
      },
    };
  });

  describe("Rendering", () => {
    it("renders sign in with Google button", () => {
      render(<SignWithGoogle />);

      const button = screen.getByRole("button", {
        name: /Sign in with Google/i,
      });
      expect(button).toBeInTheDocument();

      const googleIcon = screen.getByTestId("google-icon");
      expect(googleIcon).toBeInTheDocument();
    });
  });

  describe("Button Interaction", () => {
    it("calls requestAccessToken when button is clicked", () => {
      render(<SignWithGoogle />);

      const button = screen.getByRole("button", {
        name: /Sign in with Google/i,
      });
      fireEvent.click(button);

      expect(mockRequestAccessToken).toHaveBeenCalledTimes(1);
    });
  });

  describe("OAuth Flow", () => {
    it("handles Google login callback for new user", async () => {
      // Setup mocks for new user flow
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "mock-token",
          refreshToken: "mock-refresh-token",
          email: "test@example.com",
          isNewUser: true,
          isSocialLogin: true,
        },
      });

      render(<SignWithGoogle />);

      // Extract the callback function passed to initTokenClient
      const callbackFn = mockInitTokenClient.mock.calls[0][0].callback;

      // Call the callback with a mock token response
      await callbackFn({ access_token: "mock-access-token" });

      // Verify API call
      expect(mockPost).toHaveBeenCalledWith("/auth/social-login/google", {
        idToken: "mock-access-token",
        isAndroid: false,
      });

      // Verify Redux actions
      expect(mockDispatch).toHaveBeenCalledWith(mockSetToken("mock-token"));
      expect(mockDispatch).toHaveBeenCalledWith(
        mockSetRefreshToken("mock-refresh-token"),
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        mockSetEmail("test@example.com"),
      );
      expect(mockDispatch).toHaveBeenCalledWith(mockSetIsNewGoogleUser(true));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetIsSocialLogin(true));

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signup/location");

      // Profile API should not be called for new users
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("handles Google login callback for existing user", async () => {
      // Setup mocks for existing user flow
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          token: "mock-token",
          refreshToken: "mock-refresh-token",
          email: "test@example.com",
          isNewUser: false,
          isSocialLogin: true,
        },
      });

      mockGet.mockResolvedValueOnce({
        status: 200,
        data: {
          _id: "user123",
          firstName: "John",
          lastName: "Doe",
          location: "New York",
          headline: "Software Developer",
          profilePicture: "profile.jpg",
          coverPhoto: "cover.jpg",
        },
      });

      render(<SignWithGoogle />);

      // Extract the callback function passed to initTokenClient
      const callbackFn = mockInitTokenClient.mock.calls[0][0].callback;

      // Call the callback with a mock token response
      await callbackFn({ access_token: "mock-access-token" });

      // Verify profile API call
      expect(mockGet).toHaveBeenCalledWith("/profile");

      // Verify Redux actions for user profile
      expect(mockDispatch).toHaveBeenCalledWith(mockSetType("User"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetUserId("user123"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetFirstName("John"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetLastName("Doe"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetLocation("New York"));
      expect(mockDispatch).toHaveBeenCalledWith(
        mockSetBio("Software Developer"),
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        mockSetProfilePicture("profile.jpg"),
      );
      expect(mockDispatch).toHaveBeenCalledWith(mockSetCoverPhoto("cover.jpg"));

      // Verify navigation to feed
      expect(mockNavigate).toHaveBeenCalledWith("/feed");
    });

    it("handles API error gracefully", async () => {
      // Setup mock for API error
      mockPost.mockRejectedValueOnce(new Error("API Error"));

      // Spy on console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<SignWithGoogle />);

      // Extract the callback function passed to initTokenClient
      const callbackFn = mockInitTokenClient.mock.calls[0][0].callback;

      // Call the callback with a mock token response
      await callbackFn({ access_token: "mock-access-token" });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Google login failed:",
        expect.any(Error),
      );

      // Clean up spy
      consoleErrorSpy.mockRestore();
    });
  });
});

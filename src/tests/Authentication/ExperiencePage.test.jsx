import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockDispatch = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());

// Hoist mock actions
const mockSetType = vi.hoisted(() => vi.fn());
const mockSetToken = vi.hoisted(() => vi.fn());
const mockSetRefreshToken = vi.hoisted(() => vi.fn());
const mockSetIsSocialLogin = vi.hoisted(() => vi.fn());
const mockSetUserId = vi.hoisted(() => vi.fn());
const mockSetFirstName = vi.hoisted(() => vi.fn());
const mockSetLastName = vi.hoisted(() => vi.fn());
const mockSetBio = vi.hoisted(() => vi.fn());
const mockSetProfilePicture = vi.hoisted(() => vi.fn());
const mockSetCoverPhoto = vi.hoisted(() => vi.fn());

// Store the onSubmit prop directly
let capturedOnSubmit;

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({
    email: "test@example.com",
    password: "password123",
    location: "New York",
    isNewGoogleUser: false,
  }),
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock axios instance
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
  },
}));

// Mock redux actions
vi.mock("../../store/authenticationSlice", () => ({
  setType: mockSetType,
  setToken: mockSetToken,
  setRefreshToken: mockSetRefreshToken,
  setIsSocialLogin: mockSetIsSocialLogin,
  setUserId: mockSetUserId,
  setFirstName: mockSetFirstName,
  setLastName: mockSetLastName,
  setBio: mockSetBio,
  setProfilePicture: mockSetProfilePicture,
  setCoverPhoto: mockSetCoverPhoto,
}));

// Mock child components - directly capture the props
vi.mock("../../pages/Authentication/Forms/ExperienceForm", () => ({
  default: ({ onSubmit }) => {
    // Store the onSubmit prop for later use in tests
    capturedOnSubmit = onSubmit;
    return <div>Experience Form Mock</div>;
  },
}));

vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: () => <div>Authentication Header Mock</div>,
  }),
);

// Import the component after all mocks are set up
import ExperienceAuthPage from "../../pages/Authentication/ExperiencePage";

describe("ExperienceAuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnSubmit = null;

    // Default mock responses
    mockPost.mockResolvedValue({
      status: 201,
      data: {
        token: "mock-token",
        refreshToken: "mock-refresh-token",
        isSocialLogin: false,
      },
    });

    mockGet.mockResolvedValue({
      status: 200,
      data: {
        _id: "user123",
        firstName: "John",
        lastName: "Doe",
        headline: "Software Developer",
        profilePicture: "profile.jpg",
        coverPhoto: "cover.jpg",
      },
    });
  });

  describe("Rendering", () => {
    it("renders the page with title", () => {
      render(<ExperienceAuthPage />);

      const title = screen.getByText(
        "Your profile helps you discover new people and opportunities",
      );
      expect(title).toBeInTheDocument();
    });

    it("renders the header component", () => {
      render(<ExperienceAuthPage />);

      const header = screen.getByText("Authentication Header Mock");
      expect(header).toBeInTheDocument();
    });

    it("renders the form component", () => {
      render(<ExperienceAuthPage />);

      const form = screen.getByText("Experience Form Mock");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Form Submission Logic", () => {
    it("handles student submission correctly", async () => {
      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with student data
      await capturedOnSubmit({
        isStudent: true,
        school: "Test University",
        startDate: "2020-01",
        endDate: "2024-01",
      });

      // Check type is set
      expect(mockDispatch).toHaveBeenCalledWith(mockSetType("User"));

      // Check login API call
      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });

      // Check profile API call with education data
      expect(mockPost).toHaveBeenCalledWith("/profile", {
        location: "New York",
        education: [
          {
            school: "Test University",
            startDate: "2020-01",
            endDate: "2024-01",
          },
        ],
      });

      // Check profile retrieval
      expect(mockGet).toHaveBeenCalledWith("/profile");

      // Check navigation to feed
      expect(mockNavigate).toHaveBeenCalledWith("/feed");
    });

    it("handles professional submission correctly", async () => {
      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with professional data
      await capturedOnSubmit({
        isStudent: false,
        title: "Software Engineer",
        employmentType: "Full-time",
        company: "Tech Corp",
        startDate: "2020-01",
      });

      // Check profile API call with work experience data
      expect(mockPost).toHaveBeenCalledWith("/profile", {
        location: "New York",
        workExperience: [
          {
            title: "Software Engineer",
            employmentType: "Full-time",
            company: "Tech Corp",
            startDate: "2020-01",
          },
        ],
      });
    });
  });

  describe("Error Handling", () => {
    it("handles login errors properly", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock login error
      mockPost.mockRejectedValueOnce({
        response: { status: 401 },
      });

      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with data
      await capturedOnSubmit({
        isStudent: true,
        school: "Test University",
        startDate: "2020-01",
        endDate: "2024-01",
      });

      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Invalid email or password.",
      );

      // Restore spy
      consoleErrorSpy.mockRestore();
    });

    it("handles profile creation errors", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock profile creation error
      mockPost.mockImplementationOnce(() =>
        Promise.resolve({
          status: 201,
          data: {
            token: "mock-token",
            refreshToken: "mock-refresh-token",
            isSocialLogin: false,
          },
        }),
      );

      mockPost.mockRejectedValueOnce(new Error("Profile creation failed"));

      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with data
      await capturedOnSubmit({
        isStudent: true,
        school: "Test University",
        startDate: "2020-01",
        endDate: "2024-01",
      });

      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting data:",
        expect.any(Error),
      );

      // Should not proceed to get profile
      expect(mockGet).not.toHaveBeenCalled();

      // Restore spy
      consoleErrorSpy.mockRestore();
    });
  });
});

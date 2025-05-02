import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions with vi.hoisted()
const mockDispatch = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
const mockToast = vi.hoisted(() => ({
  error: vi.fn()
}));

// Hoist mock actions
const mockSetType = vi.hoisted(() => vi.fn());
const mockSetUserId = vi.hoisted(() => vi.fn());
const mockSetFirstName = vi.hoisted(() => vi.fn());
const mockSetLastName = vi.hoisted(() => vi.fn());
const mockSetBio = vi.hoisted(() => vi.fn());
const mockSetProfilePicture = vi.hoisted(() => vi.fn());
const mockSetCoverPhoto = vi.hoisted(() => vi.fn());

// Store the onSubmit prop and isLoading prop
let capturedOnSubmit;
let capturedIsLoading;

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => ({
    location: "New York",
  }),
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: mockToast
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
  setUserId: mockSetUserId,
  setFirstName: mockSetFirstName,
  setLastName: mockSetLastName,
  setBio: mockSetBio,
  setProfilePicture: mockSetProfilePicture,
  setCoverPhoto: mockSetCoverPhoto,
}));

// Mock child components - capture both onSubmit and isLoading props
vi.mock("../../pages/Authentication/Forms/ExperienceForm", () => ({
  default: ({ onSubmit, isLoading }) => {
    // Store the props for later use in tests
    capturedOnSubmit = onSubmit;
    capturedIsLoading = isLoading;
    return (
      <div>
        Experience Form Mock
        <span data-testid="loading-state">{isLoading ? "Loading" : "Not Loading"}</span>
      </div>
    );
  },
}));

vi.mock(
  "../../pages/Authentication/GenericComponents/AuthenticationHeader",
  () => ({
    default: ({ hideButtons }) => (
      <div>
        Authentication Header Mock
        {hideButtons && <span data-testid="buttons-hidden">Buttons Hidden</span>}
      </div>
    ),
  }),
);

// Import the component after all mocks are set up
import ExperienceAuthPage from "../../pages/Authentication/ExperiencePage";

describe("ExperienceAuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnSubmit = null;
    capturedIsLoading = null;

    // Default mock responses
    mockPost.mockResolvedValue({
      status: 201,
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

    it("renders the header component with hideButtons prop", () => {
      render(<ExperienceAuthPage />);

      const header = screen.getByText("Authentication Header Mock");
      const buttonsHidden = screen.getByTestId("buttons-hidden");
      expect(header).toBeInTheDocument();
      expect(buttonsHidden).toBeInTheDocument();
    });

    it("renders the form component with isLoading prop", () => {
      render(<ExperienceAuthPage />);

      const form = screen.getByText("Experience Form Mock");
      const loadingState = screen.getByTestId("loading-state");
      expect(form).toBeInTheDocument();
      expect(loadingState).toHaveTextContent("Not Loading");
      expect(capturedIsLoading).toBe(false);
    });
  });

  describe("Form Submission Logic", () => {
    it("handles student submission correctly", async () => {
      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with student data wrapped in act
      await act(async () => {
        await capturedOnSubmit({
          isStudent: true,
          school: "Test University",
          startDate: "2020-01",
          endDate: "2024-01",
        });
      });

      // Check type is set
      expect(mockDispatch).toHaveBeenCalledWith(mockSetType("User"));

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

      // Check user data is set from profile
      expect(mockDispatch).toHaveBeenCalledWith(mockSetUserId("user123"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetFirstName("John"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetLastName("Doe"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetBio("Software Developer"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetProfilePicture("profile.jpg"));
      expect(mockDispatch).toHaveBeenCalledWith(mockSetCoverPhoto("cover.jpg"));

      // Check navigation to feed
      expect(mockNavigate).toHaveBeenCalledWith("/feed");

      // Check loading state was reset
      expect(capturedIsLoading).toBe(false);
    });

    it("handles professional submission correctly", async () => {
      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with professional data wrapped in act
      await act(async () => {
        await capturedOnSubmit({
          isStudent: false,
          title: "Software Engineer",
          employmentType: "Full-time",
          company: "Tech Corp",
          startDate: "2020-01",
        });
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

    it("handles loading state during submission", async () => {
      render(<ExperienceAuthPage />);
      
      // Initial state should be not loading
      expect(capturedIsLoading).toBe(false);
      
      // Start submission but don't await it yet
      const submissionPromise = capturedOnSubmit({
        isStudent: true,
        school: "Test University",
        startDate: "2020-01",
        endDate: "2024-01",
      });
      
      // Complete the submission
      await act(async () => {
        await submissionPromise;
      });
      
      // Should no longer be loading
      expect(capturedIsLoading).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("handles profile creation errors with toast", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock profile creation error
      mockPost.mockRejectedValueOnce(new Error("Profile creation failed"));

      render(<ExperienceAuthPage />);

      // Make sure onSubmit was captured
      expect(capturedOnSubmit).toBeTruthy();

      // Call it with data wrapped in act
      await act(async () => {
        await capturedOnSubmit({
          isStudent: true,
          school: "Test University",
          startDate: "2020-01",
          endDate: "2024-01",
        });
      });

      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error submitting data:",
        expect.any(Error),
      );

      // Should show toast error
      expect(mockToast.error).toHaveBeenCalledWith(
        "An unexpected error occured while submitting data.", 
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000,
        })
      );

      // Should not proceed to get profile
      expect(mockGet).not.toHaveBeenCalled();
      
      // Loading state should be reset
      expect(capturedIsLoading).toBe(false);

      // Restore spy
      consoleErrorSpy.mockRestore();
    });

    it("handles profile retrieval errors with toast", async () => {
      // Mock console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock profile creation success but retrieval error
      mockPost.mockResolvedValueOnce({ status: 201 });
      mockGet.mockRejectedValueOnce(new Error("Profile retrieval failed"));

      render(<ExperienceAuthPage />);

      // Call onSubmit with data wrapped in act
      await act(async () => {
        await capturedOnSubmit({
          isStudent: true,
          school: "Test University",
          startDate: "2020-01",
          endDate: "2024-01",
        });
      });

      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error retreiving profile:",
        expect.any(Error),
      );

      // Should show toast error
      expect(mockToast.error).toHaveBeenCalledWith(
        "An unexpected error occured, please try again.", 
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000,
        })
      );

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();
      
      // Loading state should be reset
      expect(capturedIsLoading).toBe(false);

      // Restore spy
      consoleErrorSpy.mockRestore();
    });
  });

  describe("UI Structure", () => {
    it("renders with correct container classes", () => {
      const { container } = render(<ExperienceAuthPage />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("min-h-screen", "flex", "flex-col");
    });

    it("renders a title with responsive text classes", () => {
      render(<ExperienceAuthPage />);
      const title = screen.getByText(
        "Your profile helps you discover new people and opportunities"
      );
      expect(title).toHaveClass("text-2xl", "sm:text-3xl", "md:text-4xl");
    });

    it("renders the form in a card-like container", () => {
      const { container } = render(<ExperienceAuthPage />);
      const formContainer = container.querySelector(".bg-cardBackground");
      expect(formContainer).toBeInTheDocument();
      expect(formContainer).toHaveClass("rounded-lg");
    });
  });
});
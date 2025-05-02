import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, beforeAll } from "vitest";
import UsersAnalytics from "../../../pages/AdminPanel/AdminAnalytics/UserAnalytics";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axiosInstance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Setup for ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("UsersAnalytics", () => {
  const mockAnalytics = {
    totalUsers: 2000,
    mostActiveUsers: [
      { userId: "1", activityScore: 50 },
      { userId: "2", activityScore: 30 },
    ],
    mostReportedUser: "3",
    userReportedCount: 7,
  };

  const mockProfiles = {
    1: {
      firstName: "Alice",
      lastName: "Doe",
      profilePicture: "/alice.jpg",
    },
    2: {
      firstName: "Bob",
      lastName: "Smith",
      profilePicture: "/bob.jpg",
    },
    3: {
      firstName: "Charlie",
      lastName: "Brown",
      profilePicture: "/charlie.jpg",
      bio: "I break the rules.",
    },
  };

  test("renders all profiles and user counts correctly", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockResolvedValueOnce({ data: mockProfiles["3"] });

    render(<UsersAnalytics userAnalytics={mockAnalytics} />);

    await waitFor(() => {
      expect(screen.getByText("2,000 Users")).toBeInTheDocument();
      expect(screen.getByText("Alice Doe")).toBeInTheDocument();
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
      expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
      expect(screen.getByText("I break the rules.")).toBeInTheDocument();
      expect(screen.getByText("Reports Received:")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });

  test("shows loading fallback if reported user fails", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockRejectedValueOnce(new Error("Profile not found"));

    render(<UsersAnalytics userAnalytics={mockAnalytics} />);

    await waitFor(() => {
      expect(
        screen.getByText("Loading reported user data")
      ).toBeInTheDocument();
    });
  });

  test("shows default text when reported user has no bio", async () => {
    const profileWithoutBio = { ...mockProfiles["3"], bio: undefined };

    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockResolvedValueOnce({ data: profileWithoutBio });

    render(<UsersAnalytics userAnalytics={mockAnalytics} />);

    await waitFor(() => {
      expect(screen.getByText("No bio available")).toBeInTheDocument();
    });
  });

  test("shows 'N/A' when totalUsers is undefined", async () => {
    const analytics = {
      ...mockAnalytics,
      totalUsers: undefined,
    };

    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockResolvedValueOnce({ data: mockProfiles["3"] });

    render(<UsersAnalytics userAnalytics={analytics} />);

    await waitFor(() => {
      expect(screen.getByText("N/A Users")).toBeInTheDocument();
    });
  });

  test("shows 0 when userReportedCount is null", async () => {
    const analytics = {
      ...mockAnalytics,
      userReportedCount: null,
    };

    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockResolvedValueOnce({ data: mockProfiles["3"] });

    render(<UsersAnalytics userAnalytics={analytics} />);

    await waitFor(() => {
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  test("renders empty chart and list when mostActiveUsers is empty", async () => {
    const analytics = {
      ...mockAnalytics,
      mostActiveUsers: [],
    };

    render(<UsersAnalytics userAnalytics={analytics} />);

    await waitFor(() => {
      expect(
        screen.getByText("Most Active Users & Their Scores")
      ).toBeInTheDocument();
      expect(screen.queryByText(/Activity Score:/)).not.toBeInTheDocument();
    });
  });

  test("renders user images", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProfiles["1"] })
      .mockResolvedValueOnce({ data: mockProfiles["2"] })
      .mockResolvedValueOnce({ data: mockProfiles["3"] });

    render(<UsersAnalytics userAnalytics={mockAnalytics} />);

    await waitFor(() => {
      expect(screen.getByAltText("Alice Doe")).toHaveAttribute(
        "src",
        "/alice.jpg"
      );
      expect(screen.getByAltText("Bob Smith")).toHaveAttribute(
        "src",
        "/bob.jpg"
      );
      expect(screen.getByAltText("profile")).toHaveAttribute(
        "src",
        "/charlie.jpg"
      );
    });
  });
});

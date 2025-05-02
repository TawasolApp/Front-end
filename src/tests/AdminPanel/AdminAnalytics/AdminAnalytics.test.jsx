import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AdminAnalytics from "../../../pages/AdminPanel/AdminAnalytics/AdminAnalytics";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock subcomponents
vi.mock("../../../pages/AdminPanel/AdminAnalytics/UserAnalytics", () => ({
  __esModule: true,
  default: () => <div>Mocked UserAnalytics</div>,
}));

vi.mock("../../../pages/AdminPanel/AdminAnalytics/PostAnalytics", () => ({
  __esModule: true,
  default: () => <div>Mocked PostAnalytics</div>,
}));

vi.mock("../../../pages/AdminPanel/AdminAnalytics/JobAnalytics", () => ({
  __esModule: true,
  default: () => <div>Mocked JobAnalytics</div>,
}));

describe("AdminAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays loading screen initially", () => {
    render(<AdminAnalytics />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("fetches and displays analytics data", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { totalUsers: 1000 } })
      .mockResolvedValueOnce({ data: { totalPosts: 500 } })
      .mockResolvedValueOnce({ data: { totalJobs: 250 } });

    render(<AdminAnalytics />);

    // Wait for all analytics data to load and render
    await waitFor(() => {
      expect(
        screen.getByText(/Admin Analytics Dashboard/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
      expect(screen.getByText(/1,000/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Posts/i)).toBeInTheDocument();
      expect(screen.getByText(/500/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Jobs/i)).toBeInTheDocument();
      expect(screen.getByText(/250/i)).toBeInTheDocument();
      expect(screen.getByText(/Mocked UserAnalytics/)).toBeInTheDocument();
      expect(screen.getByText(/Mocked PostAnalytics/)).toBeInTheDocument();
      expect(screen.getByText(/Mocked JobAnalytics/)).toBeInTheDocument();
    });
  });

  test("handles API failure gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("User API failed"));
    axios.get.mockRejectedValueOnce(new Error("Post API failed"));
    axios.get.mockRejectedValueOnce(new Error("Job API failed"));

    render(<AdminAnalytics />);

    // It should still remove loading but not crash
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});

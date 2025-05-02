import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, beforeAll } from "vitest";
import PostAnalytics from "../../../pages/AdminPanel/AdminAnalytics/PostAnalytics";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Silence ResizeObserver and console errors
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

// Mocked post data
const mockPostAnalytics = {
  totalPosts: 45,
  totalShares: 10,
  totalComments: 20,
  totalReacts: 15,
  postWithMostInteractions: "post1",
  mostReportedPost: "post2",
  postReportedCount: 5,
};

const mockPost1 = {
  _id: "post1",
  content: "This is the most interacted post",
};

const mockPost2 = {
  _id: "post2",
  content: "This is the most reported post",
};

describe("PostAnalytics", () => {
  test("renders chart and summary counts", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockPost1 }) // Most interacted post
      .mockResolvedValueOnce({ data: mockPost2 }); // Most reported post

    render(<PostAnalytics postAnalytics={mockPostAnalytics} />);

    await waitFor(() => {
      expect(screen.getByText("45 Posts")).toBeInTheDocument();
      expect(screen.getByText("Posts Activity Overview")).toBeInTheDocument();
    });
  });

  test("renders most interacted and most reported posts", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockPost1 })
      .mockResolvedValueOnce({ data: mockPost2 });

    render(<PostAnalytics postAnalytics={mockPostAnalytics} />);

    await waitFor(() => {
      expect(
        screen.getByText("Post With Most Interactions")
      ).toBeInTheDocument();
      expect(screen.getByText("Most Reported Post")).toBeInTheDocument();
      expect(screen.getByText(mockPost1.content)).toBeInTheDocument();
      expect(screen.getByText(mockPost2.content)).toBeInTheDocument();
    });
  });

  test("shows loading fallback if posts aren't fetched yet", async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<PostAnalytics postAnalytics={mockPostAnalytics} />);

    expect(screen.getAllByText(/Loading Post/i)).toHaveLength(2);
  });

  test("gracefully handles fetch error", async () => {
    axios.get.mockRejectedValueOnce(new Error("fail"));
    axios.get.mockRejectedValueOnce(new Error("fail"));

    render(<PostAnalytics postAnalytics={mockPostAnalytics} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Loading Post/i)).toHaveLength(2);
    });
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostsSlider from "../../../pages/UserProfile/Components/UserPostsSlider/UserPostsSlider";
import { axiosInstance as axios } from "../../../apis/axios";
import { vi } from "vitest";
import { MemoryRouter, useNavigate, useOutletContext } from "react-router-dom";

// Global mocks
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useOutletContext: vi.fn(() => ({ user: { _id: "user123" } })),
  };
});

vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

vi.mock("../../../pages/Feed/MainFeed/FeedPosts/PostContainer", () => ({
  __esModule: true,
  default: ({ post }) => (
    <div data-testid="mock-post">Post: {post.title || post.id}</div>
  ),
}));

describe("PostsSlider", () => {
  const mockPosts = Array.from({ length: 5 }, (_, i) => ({
    id: `post${i}`,
    title: `Title ${i}`,
  }));

  beforeEach(() => {
    vi.clearAllMocks();

    // ✅ Fix scrollBy not available in JSDOM
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("renders nothing if userId is missing", async () => {
    useOutletContext.mockReturnValueOnce({ user: null });

    render(<PostsSlider />, { wrapper: MemoryRouter });

    expect(screen.queryByTestId("posts-slider")).not.toBeInTheDocument();
  });

  it("renders posts slider and handles scroll + indicators", async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    render(<PostsSlider />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("mock-post")).toHaveLength(4);
    expect(screen.getByText("Show all →")).toBeInTheDocument();

    const dots = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("h-2"));
    expect(dots).toHaveLength(4);

    fireEvent.click(screen.getByLabelText("scroll-left"));
    fireEvent.click(screen.getByLabelText("scroll-right"));
  });

  it("navigates to post when clicked", async () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValue({ data: mockPosts });

    render(<PostsSlider />, { wrapper: MemoryRouter });

    fireEvent.click((await screen.findAllByTestId("mock-post"))[0]);
    expect(navigate).toHaveBeenCalledWith("/feed/post0");
  });

  it("navigates when 'Show all' buttons are clicked", async () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    axios.get.mockResolvedValue({ data: mockPosts });

    render(<PostsSlider />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText("Show all →")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Show all →"));
    fireEvent.click(screen.getByText("Show all posts →"));

    expect(navigate).toHaveBeenCalledWith("/users/user123/posts");
    expect(navigate).toHaveBeenCalledTimes(2);
  });

  it("gracefully handles fetch error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Fail"));

    render(<PostsSlider />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Confirm it doesn't crash (no posts rendered)
    expect(screen.queryByTestId("mock-post")).toBeNull();
  });

  it("renders null when no posts returned", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<PostsSlider />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.queryByTestId("posts-slider")).not.toBeInTheDocument();
    });
  });
});

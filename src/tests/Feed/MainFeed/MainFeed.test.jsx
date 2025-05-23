import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MainFeed from "../../../pages/Feed/MainFeed/MainFeed";

// Mock dependencies
vi.mock("react-redux", () => ({
  useSelector: (selector) => {
    // Mocked redux state
    const state = {
      authentication: {
        userId: "user123",
        firstName: "John",
        lastName: "Doe",
        profilePicture: "profile-pic.jpg",
      },
    };
    return selector(state);
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../pages/Feed/MainFeed/SharePost/SharePost", () => ({
  default: ({ handleSharePost, currentAuthorName, currentAuthorPicture }) => (
    <div
      data-testid="share-post"
      onClick={() => handleSharePost("Test post", [], "public", [])}
    >
      Share Post Component
      <span data-testid="author-name">{currentAuthorName}</span>
      <img
        data-testid="author-picture"
        src={currentAuthorPicture}
        alt="Profile"
      />
    </div>
  ),
}));

vi.mock("../../../pages/Feed/MainFeed/FeedPosts/FeedPosts", () => ({
  default: ({ posts, handleDeletePost }) => (
    <div data-testid="feed-posts">
      {posts.map((post) => (
        <div key={post.id} data-testid="post-item" data-post-id={post.id}>
          <span data-testid="post-content">{post.content || "No content"}</span>
          <button
            data-testid={`delete-post-${post.id}`}
            onClick={() => handleDeletePost(post.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe("MainFeed", () => {
  const mockPosts = [
    { id: "1", content: "Post 1", authorId: "user123" },
    { id: "2", content: "Post 2", authorId: "otherUser" },
  ];

  const mockRepost = {
    id: "3",
    content: "Reposted content",
    authorId: "user123",
    isSilentRepost: true,
    parentPost: {
      id: "4",
      content: "Original post",
      authorId: "otherUser",
      authorName: "Original Author",
      authorPicture: "original-author.jpg",
    },
  };

  const mockQuotedRepost = {
    id: "5",
    content: "Quote with comment",
    authorId: "user123",
    parentPost: {
      id: "6",
      content: "Original quoted content",
      authorId: "thirdUser",
      authorName: "Quoted Author",
      authorPicture: "quoted-author.jpg",
      authorBio: "Quoted Bio",
      authorType: "user",
      timestamp: "2023-04-10T14:30:00Z",
      visibility: "public",
      media: [],
      taggedUsers: [],
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Default mock for GET request - make it resolve immediately
    const { axiosInstance } = await import("../../../apis/axios");
    axiosInstance.get.mockResolvedValue({ data: mockPosts });
  });

  it("renders the component with default props", async () => {
    render(<MainFeed />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
    });

    // SharePost should be visible after loading completes
    expect(screen.getByTestId("share-post")).toBeInTheDocument();
    
    // Feed posts should be rendered
    expect(screen.getByTestId("feed-posts")).toBeInTheDocument();
  });

  it("fetches posts on initial render", async () => {
    const { axiosInstance } = await import("../../../apis/axios");

    render(<MainFeed />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/posts/user123", {
        params: { page: 1 },
      });
    });
  });

  it("hides SharePost component when showShare is false", async () => {
    render(<MainFeed showShare={false} />);

    // SharePost should not be visible
    expect(screen.queryByTestId("share-post")).not.toBeInTheDocument();
  });

  it("transforms posts data correctly", async () => {
    const { axiosInstance } = await import("../../../apis/axios");

    // Mock response with different post types
    axiosInstance.get.mockResolvedValueOnce({
      data: [mockPosts[0], mockRepost, mockQuotedRepost],
    });

    render(<MainFeed />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-item")).toHaveLength(3);
    });
  });

  it("handles sharing a new post", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    const { toast } = await import("react-toastify");

    // Mock successful post creation
    axiosInstance.post.mockResolvedValue({ data: { id: "new-post-id" } });

    render(<MainFeed />);

    await waitFor(() => {
      expect(screen.getByTestId("share-post")).toBeInTheDocument();
    });

    // Click on the share post component to trigger the handleSharePost method
    fireEvent.click(screen.getByTestId("share-post"));

    await waitFor(() => {
      // Check post request was made
      expect(axiosInstance.post).toHaveBeenCalledWith("posts/user123", {
        content: "Test post",
        media: [],
        taggedUsers: [],
        visibility: "public",
        parentPostId: null,
        isSilentRepost: false,
      });

      // Check posts were refreshed
      expect(axiosInstance.get).toHaveBeenCalledTimes(2);

      // Check toast was shown
      expect(toast.success).toHaveBeenCalledWith(
        "Post shared successfully.",
        expect.any(Object),
      );
    });
  });

  it("handles deleting a post", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    const { toast } = await import("react-toastify");

    // Mock successful delete
    axiosInstance.delete.mockResolvedValue({});

    render(<MainFeed />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-item")).toHaveLength(2);
    });

    // Click delete on the first post
    fireEvent.click(screen.getByTestId("delete-post-1"));

    await waitFor(() => {
      // Check delete request was made
      expect(axiosInstance.delete).toHaveBeenCalledWith("/posts/user123/1");

      // Check toast was shown
      expect(toast.success).toHaveBeenCalledWith(
        "Post deleted successfully.",
        expect.any(Object),
      );
    });
  });

  it("uses custom API_ROUTE when provided", async () => {
    const { axiosInstance } = await import("../../../apis/axios");

    render(<MainFeed API_ROUTE="/custom/feed" />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/custom/feed",
        expect.any(Object),
      );
    });
  });

  it("handles search query parameter when provided", async () => {
    const { axiosInstance } = await import("../../../apis/axios");

    render(<MainFeed q="searchTerm" />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/posts/user123", {
        params: {
          page: 1,
          q: "searchTerm",
          timeframe: null,
          network: null,
        },
      });
    });
  });

  it("handles API errors gracefully when fetching posts", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Force API to throw error
    axiosInstance.get.mockRejectedValueOnce(new Error("API error"));

    render(<MainFeed />);

    await waitFor(() => {
      // Error should be logged
      expect(consoleSpy).toHaveBeenCalledWith("API error");
    });

    consoleSpy.mockRestore();
  });
});

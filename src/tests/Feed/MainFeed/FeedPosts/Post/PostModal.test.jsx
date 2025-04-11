import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostModal from "../../../../../pages/Feed/MainFeed/FeedPosts/Post/PostModal";
import { usePost } from "../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Mock dependencies
vi.mock("../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: vi.fn(),
}));

// Mock child components
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/PostCardHeader",
  () => ({
    default: ({ modal, handleClosePostModal, noRightItems }) => (
      <div data-testid="post-card-header">
        {modal && (
          <button
            data-testid="close-modal-button"
            onClick={handleClosePostModal}
          >
            Close Modal
          </button>
        )}
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/PostContent",
  () => ({
    default: ({ modal, reposted }) => (
      <div data-testid={`post-content${reposted ? "-reposted" : ""}`}>
        {modal ? "Modal Content" : "Regular Content"}
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Metrics/EngagementMetrics",
  () => ({
    default: ({ setShowLikes, setShowComments }) => (
      <div data-testid="engagement-metrics">
        <button data-testid="show-likes-button" onClick={setShowLikes}>
          Show Likes
        </button>
        <button data-testid="show-comments-button" onClick={setShowComments}>
          Show Comments
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/ActivitiesHolder",
  () => ({
    default: ({ setShowComments }) => (
      <div data-testid="activities-holder">
        <button data-testid="show-comments-activity" onClick={setShowComments}>
          Comment
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentsContainer",
  () => ({
    default: () => <div data-testid="comments-container">Comments</div>,
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal",
  () => ({
    default: ({ setShowLikes, API_URL }) => (
      <div data-testid="reactions-modal">
        <span data-testid="api-url">{API_URL}</span>
        <button data-testid="close-likes" onClick={setShowLikes}>
          Close
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/MediaCarousel/MediaCarousel",
  () => ({
    default: ({ media, mediaIndex, onClick }) => (
      <div data-testid="media-carousel" onClick={onClick}>
        <span>Media index: {mediaIndex}</span>
        <span>Media count: {media.length}</span>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/SilentRepostHeader",
  () => ({
    default: ({ authorId, authorPicture, authorName }) => (
      <div data-testid="silent-repost-header">
        <span>{authorName}'s repost</span>
      </div>
    ),
  }),
);

describe("PostModal Component", () => {
  const mockHandleClosePostModal = vi.fn();
  const initialMediaIndex = 1;

  const defaultPost = {
    id: "post123",
    media: [{ url: "image1.jpg" }, { url: "image2.jpg" }],
    reactCounts: { like: 5, celebrate: 2 },
  };

  beforeEach(() => {
    usePost.mockReturnValue({ post: defaultPost });
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Reset body overflow style which might be changed during tests
    document.body.style.overflow = "";
  });

  it("renders the modal with correct structure", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    expect(screen.getByTestId("post-card-header")).toBeInTheDocument();
    expect(screen.getByTestId("post-content")).toBeInTheDocument();
    expect(screen.getByTestId("engagement-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("activities-holder")).toBeInTheDocument();
    expect(screen.getByTestId("media-carousel")).toBeInTheDocument();
  });

  it("passes correct mediaIndex to MediaCarousel", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    const mediaCarousel = screen.getByTestId("media-carousel");
    expect(mediaCarousel).toHaveTextContent(
      `Media index: ${initialMediaIndex}`,
    );
  });

  it("calls handleClosePostModal when clicking the backdrop", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    // Click the backdrop (the main modal container)
    fireEvent.click(screen.getByText(/Media index:/));

    // handleClosePostModal should not be called because we clicked inside the modal
    expect(mockHandleClosePostModal).not.toHaveBeenCalled();

    // Now click the actual backdrop
    const backdrop =
      screen.getByTestId("media-carousel").parentElement.parentElement
        .parentElement;
    fireEvent.click(backdrop);

    // Now handleClosePostModal should be called
    expect(mockHandleClosePostModal).toHaveBeenCalledTimes(1);
  });

  it("calls handleClosePostModal when close button is clicked", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    const closeButton = screen.getByTestId("close-modal-button");
    fireEvent.click(closeButton);

    expect(mockHandleClosePostModal).toHaveBeenCalledTimes(1);
  });

  it("shows the comments container when showComments is true", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    // Comments shouldn't be visible initially
    expect(screen.queryByTestId("comments-container")).not.toBeInTheDocument();

    // Click to show comments
    fireEvent.click(screen.getByTestId("show-comments-button"));

    // Now comments should be visible
    expect(screen.getByTestId("comments-container")).toBeInTheDocument();
  });

  it("shows the reactions modal when showLikes is true", () => {
    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    // Reactions modal shouldn't be visible initially
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();

    // Click to show likes
    fireEvent.click(screen.getByTestId("show-likes-button"));

    // Now reactions modal should be visible
    expect(screen.getByTestId("reactions-modal")).toBeInTheDocument();
    expect(screen.getByTestId("api-url")).toHaveTextContent(
      `/posts/reactions/${defaultPost.id}`,
    );

    // Close modal
    fireEvent.click(screen.getByTestId("close-likes"));

    // Modal should be hidden again
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();
  });

  it("renders SilentRepostHeader when headerData is present", () => {
    const postWithHeaderData = {
      ...defaultPost,
      headerData: {
        authorId: "repost123",
        authorPicture: "repost.jpg",
        authorName: "Reposter",
      },
    };

    usePost.mockReturnValue({ post: postWithHeaderData });

    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    expect(screen.getByTestId("silent-repost-header")).toBeInTheDocument();
    expect(screen.getByText("Reposter's repost")).toBeInTheDocument();
  });

  it("renders reposted content when repostedComponents is present", () => {
    const postWithRepost = {
      ...defaultPost,
      repostedComponents: {
        id: "repost123",
        media: [{ url: "reposted-image.jpg" }],
      },
    };

    usePost.mockReturnValue({ post: postWithRepost });

    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    expect(screen.getByTestId("post-content-reposted")).toBeInTheDocument();
  });

  it("uses reposted media when repostedComponents is present", () => {
    const postWithRepost = {
      ...defaultPost,
      repostedComponents: {
        id: "repost123",
        media: [{ url: "reposted-image.jpg" }],
      },
    };

    usePost.mockReturnValue({ post: postWithRepost });

    render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    const mediaCarousel = screen.getByTestId("media-carousel");
    expect(mediaCarousel).toHaveTextContent("Media count: 1");
  });

  it("disables body scrolling when mounted and restores it when unmounted", () => {
    // Initially, body should have normal overflow
    expect(document.body.style.overflow).toBe("");

    const { unmount } = render(
      <PostModal
        mediaIndex={initialMediaIndex}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    // Body overflow should be hidden when modal is mounted
    expect(document.body.style.overflow).toBe("hidden");

    // Unmount the component
    unmount();

    // Body overflow should be restored
    expect(document.body.style.overflow).toBe("");
  });
});

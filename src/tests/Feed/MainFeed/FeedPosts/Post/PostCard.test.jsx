// Mock react-router-dom first - place this at the top
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="router-link">
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/feed" }),
}));

// Mock react-pdf - place this near the top
vi.mock("react-pdf", () => ({
  Document: () => <div>Document Mock</div>,
  Page: () => <div>Page Mock</div>,
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: "" },
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "../../../../../pages/Feed/MainFeed/FeedPosts/Post/PostCard";
import { usePost } from "../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Mock PostContext hook
vi.mock("../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: vi.fn(),
}));

// Mock PdfViewer component
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/PdfViewer",
  () => ({
    default: () => <div data-testid="pdf-viewer">PDF Viewer Mock</div>,
  }),
);

// Add a mock for ActorHeader to solve the authorBio issue
vi.mock("../../../../../pages/Feed/GenericComponents/ActorHeader", () => ({
  default: ({ authorName, authorPicture, authorBio }) => (
    <div data-testid="actor-header">
      <span>{authorName}</span>
      <img src={authorPicture} alt="profile" />
      <span>{authorBio || ""}</span>
    </div>
  ),
}));

// Mock for PostCardHeader
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/PostCardHeader",
  () => ({
    default: ({ menuItems, modal, noRightItems }) => (
      <div data-testid="post-card-header">
        {!noRightItems &&
          menuItems &&
          menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              data-testid={`menu-item-${item.text.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {item.text}
            </button>
          ))}
        {modal ? <span>Modal Header</span> : null}
      </div>
    ),
  }),
);

// Fix PostContent mock path
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/PostContent",
  () => ({
    default: ({ modal, handleOpenPostModal, reposted }) => (
      <div data-testid={`post-content${reposted ? "-reposted" : ""}`}>
        <button
          data-testid="open-modal-button"
          onClick={() => handleOpenPostModal(0)}
        >
          Open Modal
        </button>
        {modal ? <span>Modal Content</span> : null}
      </div>
    ),
  }),
);

// Fix the path for EngagementMetrics
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

// Fix the path for ActivitiesHolder
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

// Fix the path for CommentsContainer
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/CommentsContainer",
  () => ({
    default: () => <div data-testid="comments-container">Comments</div>,
  }),
);

// Fix the path for ReactionsModal
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal",
  () => ({
    default: ({ setShowLikes }) => (
      <div data-testid="reactions-modal">
        <button data-testid="close-likes" onClick={setShowLikes}>
          Close
        </button>
      </div>
    ),
  }),
);

// Fix the path for TextModal
vi.mock("../../../../../pages/Feed/MainFeed/SharePost/TextModal", () => ({
  default: ({ setIsModalOpen }) => (
    <div data-testid="text-modal">
      <button data-testid="close-edit-modal" onClick={setIsModalOpen}>
        Close
      </button>
    </div>
  ),
}));

// Fix path for DeletePostModal
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/DeleteModal/DeletePostModal",
  () => ({
    default: ({ closeModal, deleteFunc, commentOrPost }) => (
      <div data-testid="delete-modal">
        <span>{commentOrPost}</span>
        <button data-testid="close-delete-modal" onClick={closeModal}>
          Cancel
        </button>
        <button data-testid="confirm-delete" onClick={deleteFunc}>
          Delete
        </button>
      </div>
    ),
  }),
);

// Fix path for SilentRepostHeader
vi.mock(
  "../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/SilentRepostHeader",
  () => ({
    default: ({ authorId, authorPicture, authorName }) => (
      <div data-testid="silent-repost-header">{authorName}'s repost</div>
    ),
  }),
);

describe("PostCard Component", () => {
  const mockSetShowPostModal = vi.fn();
  const mockSetMediaIndex = vi.fn();
  const mockHandleSavePost = vi.fn();
  const mockHandleCopyPost = vi.fn();
  const mockHandleEditPost = vi.fn();
  const mockHandleDeletePost = vi.fn();

  const defaultPostContextValue = {
    currentAuthorId: "user123",
    currentAuthorName: "Test User",
    currentAuthorPicture: "profile.jpg",
    isAdmin: false,
    post: {
      id: "post123",
      authorId: "user123",
      authorName: "Test User",
      authorType: "Individual",
      content: "Test post content",
      taggedUsers: [],
      visibility: "public",
      media: [],
      isSaved: false,
      reactCounts: { like: 5, celebrate: 2 },
      // Add authorBio to avoid the length check error
      authorBio: "Test user bio",
    },
    handleSavePost: mockHandleSavePost,
    handleCopyPost: mockHandleCopyPost,
    handleEditPost: mockHandleEditPost,
    handleDeletePost: mockHandleDeletePost,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    usePost.mockReturnValue(defaultPostContextValue);
  });

  it("renders the basic post components", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    expect(screen.getByTestId("post-card-header")).toBeInTheDocument();
    expect(screen.getByTestId("post-content")).toBeInTheDocument();
    expect(screen.getByTestId("engagement-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("activities-holder")).toBeInTheDocument();
  });

  it("renders the silent repost header when headerData is present", () => {
    const postWithHeaderData = {
      ...defaultPostContextValue.post,
      headerData: {
        authorId: "repost123",
        authorPicture: "repost.jpg",
        authorName: "Reposter",
      },
    };

    usePost.mockReturnValue({
      ...defaultPostContextValue,
      post: postWithHeaderData,
    });

    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    expect(screen.getByTestId("silent-repost-header")).toBeInTheDocument();
    expect(screen.getByText("Reposter's repost")).toBeInTheDocument();
  });

  it("renders the reposted components when repostedComponents is present", () => {
    const postWithRepost = {
      ...defaultPostContextValue.post,
      repostedComponents: { id: "repost123" },
    };

    usePost.mockReturnValue({
      ...defaultPostContextValue,
      post: postWithRepost,
    });

    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    expect(screen.getByTestId("post-content-reposted")).toBeInTheDocument();
  });

  it("shows the comments container when showComments is true", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
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
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Reactions modal shouldn't be visible initially
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();

    // Click to show likes
    fireEvent.click(screen.getByTestId("show-likes-button"));

    // Now reactions modal should be visible
    expect(screen.getByTestId("reactions-modal")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId("close-likes"));

    // Modal should be hidden again
    expect(screen.queryByTestId("reactions-modal")).not.toBeInTheDocument();
  });

  it("shows edit options for the post owner", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Since currentAuthorId matches post.authorId, edit and delete options should be available
    expect(screen.getByTestId("menu-item-edit-post")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-delete-post")).toBeInTheDocument();
  });

  it("shows edit options for admins of company posts", () => {
    const companyPost = {
      ...defaultPostContextValue.post,
      authorId: "company123",
      authorType: "Company",
    };

    usePost.mockReturnValue({
      ...defaultPostContextValue,
      isAdmin: true,
      post: companyPost,
    });

    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Admin should be able to edit/delete company posts
    expect(screen.getByTestId("menu-item-edit-post")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-delete-post")).toBeInTheDocument();
  });

  it("does not show edit options for non-owners/non-admins", () => {
    const otherUserPost = {
      ...defaultPostContextValue.post,
      authorId: "otherUser",
    };

    usePost.mockReturnValue({
      ...defaultPostContextValue,
      post: otherUserPost,
    });

    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Should not have edit/delete options
    expect(screen.queryByTestId("menu-item-edit-post")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("menu-item-delete-post"),
    ).not.toBeInTheDocument();
  });

  it("shows the edit modal when edit option is clicked", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Click edit post
    fireEvent.click(screen.getByTestId("menu-item-edit-post"));

    // Edit modal should be shown
    expect(screen.getByTestId("text-modal")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId("close-edit-modal"));

    // Modal should be hidden
    expect(screen.queryByTestId("text-modal")).not.toBeInTheDocument();
  });

  it("shows the delete modal when delete option is clicked", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Click delete post
    fireEvent.click(screen.getByTestId("menu-item-delete-post"));

    // Delete modal should be shown
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByTestId("close-delete-modal"));

    // Modal should be hidden
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  it("calls handleSavePost when save post option is clicked", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Click save post
    fireEvent.click(screen.getByTestId("menu-item-save-post"));

    // Should call the save post function
    expect(mockHandleSavePost).toHaveBeenCalledTimes(1);
  });

  it("calls handleCopyPost when copy link option is clicked", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Click copy link
    fireEvent.click(screen.getByTestId("menu-item-copy-link-to-post"));

    // Should call the copy post function
    expect(mockHandleCopyPost).toHaveBeenCalledTimes(1);
  });

  it("calls handleDeletePost when delete is confirmed", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Open delete modal
    fireEvent.click(screen.getByTestId("menu-item-delete-post"));

    // Confirm deletion
    fireEvent.click(screen.getByTestId("confirm-delete"));

    // Should call the delete function
    expect(mockHandleDeletePost).toHaveBeenCalledTimes(1);
    expect(mockHandleDeletePost).toHaveBeenCalledWith("post123");
  });

  it("opens post modal with correct index when clicking on media", () => {
    render(
      <PostCard
        setShowPostModal={mockSetShowPostModal}
        setMediaIndex={mockSetMediaIndex}
      />,
    );

    // Click to open modal
    fireEvent.click(screen.getByTestId("open-modal-button"));

    // Should call the setMediaIndex and setShowPostModal functions
    expect(mockSetMediaIndex).toHaveBeenCalledTimes(1);
    expect(mockSetMediaIndex).toHaveBeenCalledWith(0);
    expect(mockSetShowPostModal).toHaveBeenCalledTimes(1);
    expect(mockSetShowPostModal).toHaveBeenCalledWith(true);
  });
});

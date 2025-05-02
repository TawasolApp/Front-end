import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostContainer from "../../../../pages/Feed/MainFeed/FeedPosts/PostContainer";

// Track props passed to PostProvider
const postProviderProps = [];

// Mock dependencies
vi.mock("../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  PostProvider: (props) => {
    // Capture props for testing
    postProviderProps.push(props);
    return <div data-testid="post-provider">{props.children}</div>;
  },
}));

vi.mock("../../../../pages/Feed/MainFeed/FeedPosts/Post/PostCard", () => ({
  default: ({ setShowPostModal, setMediaIndex }) => (
    <div data-testid="post-card">
      <button
        data-testid="open-modal-button"
        onClick={() => setShowPostModal()}
      >
        Open Modal
      </button>
      <button
        data-testid="set-media-index-button"
        onClick={() => setMediaIndex(1)}
      >
        Set Media Index
      </button>
    </div>
  ),
}));

vi.mock("../../../../pages/Feed/MainFeed/FeedPosts/Post/PostModal", () => ({
  default: ({ handleClosePostModal, mediaIndex }) => (
    <div data-testid="post-modal">
      <span data-testid="media-index">{mediaIndex}</span>
      <button data-testid="close-modal-button" onClick={handleClosePostModal}>
        Close Modal
      </button>
    </div>
  ),
}));

describe("PostContainer Component", () => {
  // Clear captured props before each test
  beforeEach(() => {
    postProviderProps.length = 0;
  });

  const defaultProps = {
    post: {
      id: "123",
      content: "Test post content",
      authorName: "John Doe",
      media: [{ url: "test.jpg" }],
    },
    handleSharePost: vi.fn(),
    handleDeletePost: vi.fn(),
    currentAuthorId: "user123",
    currentAuthorName: "Current User",
    currentAuthorPicture: "profile.jpg",
    isAdmin: false,
  };

  it("renders PostCard component initially", () => {
    render(<PostContainer {...defaultProps} />);

    expect(screen.getByTestId("post-provider")).toBeInTheDocument();
    expect(screen.getByTestId("post-card")).toBeInTheDocument();
    expect(screen.queryByTestId("post-modal")).not.toBeInTheDocument();
  });

  it("shows modal when PostCard triggers setShowPostModal", () => {
    render(<PostContainer {...defaultProps} />);

    const openModalButton = screen.getByTestId("open-modal-button");
    fireEvent.click(openModalButton);

    expect(screen.getByTestId("post-modal")).toBeInTheDocument();
  });

  it("closes modal when handleClosePostModal is called", () => {
    render(<PostContainer {...defaultProps} />);

    // Open the modal first
    const openModalButton = screen.getByTestId("open-modal-button");
    fireEvent.click(openModalButton);
    expect(screen.getByTestId("post-modal")).toBeInTheDocument();

    // Then close it
    const closeModalButton = screen.getByTestId("close-modal-button");
    fireEvent.click(closeModalButton);
    expect(screen.queryByTestId("post-modal")).not.toBeInTheDocument();
  });

  it("updates media index when setMediaIndex is called", () => {
    render(<PostContainer {...defaultProps} />);

    // Set media index
    const setIndexButton = screen.getByTestId("set-media-index-button");
    fireEvent.click(setIndexButton);

    // Open modal to see the effect
    const openModalButton = screen.getByTestId("open-modal-button");
    fireEvent.click(openModalButton);

    // Check if media index was updated
    const mediaIndexElement = screen.getByTestId("media-index");
    expect(mediaIndexElement.textContent).toBe("1");
  });

  it("passes correct props to PostProvider", () => {
    render(<PostContainer {...defaultProps} />);
  
    // Check that props were captured
    expect(postProviderProps.length).toBe(1);
  
    // Verify the props are correct
    expect(postProviderProps[0]).toEqual(
      expect.objectContaining({
        initialPost: defaultProps.post,
        handleSharePost: defaultProps.handleSharePost,
        handleDeletePostExternal: defaultProps.handleDeletePost, // Changed property name
        currentAuthorId: defaultProps.currentAuthorId,
        currentAuthorName: defaultProps.currentAuthorName,
        currentAuthorPicture: defaultProps.currentAuthorPicture,
        isAdmin: defaultProps.isAdmin,
      }),
    );
  });
});

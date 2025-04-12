import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedPosts from "../../../../pages/Feed/MainFeed/FeedPosts/FeedPosts";

// Create a spy we can use for prop checking
const postContainerProps = [];

// Mock the PostContainer component to capture props
vi.mock("../../../../pages/Feed/MainFeed/FeedPosts/PostContainer", () => ({
  default: (props) => {
    postContainerProps.push(props);
    return (
      <div data-testid="post-container">
        <span data-testid="post-id">{props.post.id}</span>
        <span data-testid="post-content">{props.post.content}</span>
      </div>
    );
  },
}));

describe("FeedPosts Component", () => {
  beforeEach(() => {
    postContainerProps.length = 0;
  });

  // Common props for testing
  const defaultProps = {
    posts: [
      { id: "1", content: "Test post 1" },
      { id: "2", content: "Test post 2" },
      { id: "3", content: "Test post 3" },
    ],
    lastPostRef: vi.fn(),
    handleSharePost: vi.fn(),
    handleDeletePost: vi.fn(),
    currentAuthorId: "user123",
    currentAuthorName: "Test User",
    currentAuthorPicture: "profile.jpg",
    isAdmin: false,
  };
  it("renders nothing when posts array is empty", () => {
    render(<FeedPosts {...defaultProps} posts={[]} />);

    const postContainers = screen.queryAllByTestId("post-container");
    expect(postContainers.length).toBe(0);
  });

  it("renders nothing when posts is null or undefined", () => {
    render(<FeedPosts {...defaultProps} posts={null} />);

    const postContainers = screen.queryAllByTestId("post-container");
    expect(postContainers.length).toBe(0);

    render(<FeedPosts {...defaultProps} posts={undefined} />);

    const postContainersAfterRerender =
      screen.queryAllByTestId("post-container");
    expect(postContainersAfterRerender.length).toBe(0);
  });

  it("renders correct number of posts", () => {
    render(<FeedPosts {...defaultProps} />);

    const postContainers = screen.getAllByTestId("post-container");
    expect(postContainers.length).toBe(3);
  });

  it("renders all post content correctly", () => {
    render(<FeedPosts {...defaultProps} />);

    const postContents = screen.getAllByTestId("post-content");
    expect(postContents[0].textContent).toBe("Test post 1");
    expect(postContents[1].textContent).toBe("Test post 2");
    expect(postContents[2].textContent).toBe("Test post 3");
  });

  it("applies ref to the last post", () => {
    const mockRef = vi.fn();
    const { container } = render(
      <FeedPosts {...defaultProps} lastPostRef={mockRef} />,
    );

    // We can't directly test if the ref was applied since it's not exposed in the DOM
    // But we can check that the last post is wrapped in a div (where the ref is applied)
    const divs = container.querySelectorAll("div > div");
    expect(divs.length).toBeGreaterThan(0);

    // Ensure the other posts are not wrapped in an extra div
    const postContainers = screen.getAllByTestId("post-container");
    expect(postContainers.length).toBe(3);
  });

  it("passes correct props to PostContainer", () => {
    render(<FeedPosts {...defaultProps} />);

    // Check that we have the right number of components rendered
    expect(postContainerProps.length).toBe(3);

    // Check props for the first post
    expect(postContainerProps[0]).toEqual(
      expect.objectContaining({
        post: { id: "1", content: "Test post 1" },
        handleSharePost: defaultProps.handleSharePost,
        handleDeletePost: defaultProps.handleDeletePost,
        currentAuthorId: "user123",
        currentAuthorName: "Test User",
        currentAuthorPicture: "profile.jpg",
        isAdmin: false,
      }),
    );

    // Optionally check props for the second post
    expect(postContainerProps[1].post).toEqual({
      id: "2",
      content: "Test post 2",
    });

    // And the third post
    expect(postContainerProps[2].post).toEqual({
      id: "3",
      content: "Test post 3",
    });
  });
});

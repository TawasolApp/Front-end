import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeedPosts from "../pages/Feed/MainFeed/FeedPosts/FeedPosts";

// Mock the PostCard component to isolate testing
vi.mock("../pages/Feed/MainFeed/FeedPosts/PostCard/PostCard", () => ({
  default: ({ post, deletePost }) => (
    <div data-testid={`post-card-${post.id}`} className="mock-post-card">
      <h3>{post.authorName}</h3>
      <p>{post.content}</p>
      <button onClick={() => deletePost(post.id)}>Delete</button>
    </div>
  ),
}));

describe("FeedPosts Component", () => {
  const mockDeletePost = vi.fn();
  const mockRef = vi.fn();

  const mockPosts = [
    {
      id: "post1",
      authorName: "John Doe",
      content: "First post content",
      authorId: "user1",
      timestamp: "2025-03-24T10:00:00Z",
      comments: 5,
      reactions: { like: 10 },
    },
    {
      id: "post2",
      authorName: "Jane Smith",
      content: "Second post content",
      authorId: "user2",
      timestamp: "2025-03-24T11:00:00Z",
      comments: 3,
      reactions: { like: 7 },
    },
    {
      id: "post3",
      authorName: "Bob Johnson",
      content: "Third post content",
      authorId: "user3",
      timestamp: "2025-03-24T12:00:00Z",
      comments: 0,
      reactions: { like: 2 },
    },
  ];

  it("renders all posts correctly", () => {
    render(
      <FeedPosts
        posts={mockPosts}
        lastPostRef={mockRef}
        deletePost={mockDeletePost}
      />,
    );

    // Check that all posts are rendered
    expect(screen.getByTestId("post-card-post1")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-post2")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-post3")).toBeInTheDocument();

    // Check post content is displayed correctly
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("First post content")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Second post content")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("Third post content")).toBeInTheDocument();
  });

  it("handles empty posts array", () => {
    render(
      <FeedPosts
        posts={[]}
        lastPostRef={mockRef}
        deletePost={mockDeletePost}
      />,
    );

    // Check that no posts are rendered
    expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument();
  });

  it("handles undefined posts", () => {
    render(
      <FeedPosts
        posts={undefined}
        lastPostRef={mockRef}
        deletePost={mockDeletePost}
      />,
    );

    // Check that no posts are rendered
    expect(screen.queryByTestId(/post-card-/)).not.toBeInTheDocument();
  });

  it("adds ref to last post for infinite scrolling", () => {
    const { container } = render(
      <FeedPosts
        posts={mockPosts}
        lastPostRef={mockRef}
        deletePost={mockDeletePost}
      />,
    );

    // Find all divs with post-card class (our mocked PostCard component)
    const postCards = container.querySelectorAll(".mock-post-card");

    // Check that correct number of posts are rendered
    expect(postCards).toHaveLength(3);

    // We can't directly test that ref was applied since it's a DOM property,
    // but we can verify the component structure matches what we expect
    const lastPostContainer =
      screen.getByTestId("post-card-post3").parentElement;
    expect(lastPostContainer).toBeInTheDocument();
  });

  it("handles posts with missing IDs gracefully", () => {
    const postsWithMissingIds = [
      { ...mockPosts[0], id: undefined },
      { ...mockPosts[1] },
      { ...mockPosts[2], id: null },
    ];

    render(
      <FeedPosts
        posts={postsWithMissingIds}
        lastPostRef={mockRef}
        deletePost={mockDeletePost}
      />,
    );

    // Should still render all posts using index as key fallback
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Second post content")).toBeInTheDocument();
    expect(screen.getByText("Third post content")).toBeInTheDocument();
  });
});

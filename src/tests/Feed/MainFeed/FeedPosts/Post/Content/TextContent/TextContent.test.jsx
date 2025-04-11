import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TextContent from "../../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/TextContent/TextContent";
import { usePost } from "../../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Mock dependencies
vi.mock(
  "../../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext",
  () => ({
    usePost: vi.fn(),
  }),
);

// Mock the TextViewer component
vi.mock("../../../../../../../pages/Feed/GenericComponents/TextViewer", () => ({
  default: ({ text, maxChars, maxLines, taggedUsers }) => (
    <div data-testid="text-viewer">
      <div data-testid="text-content">{text}</div>
      <div data-testid="max-chars">{maxChars}</div>
      <div data-testid="max-lines">{maxLines}</div>
      <div data-testid="tagged-users">{JSON.stringify(taggedUsers)}</div>
    </div>
  ),
}));

describe("TextContent Component", () => {
  const mockPost = {
    content: "Regular post content",
    taggedUsers: [{ id: "user1", name: "User One" }],
    repostedComponents: {
      content: "Reposted content",
      taggedUsers: [{ id: "user2", name: "User Two" }],
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    usePost.mockReturnValue({ post: mockPost });
  });

  it("renders regular post content when reposted is false", () => {
    render(<TextContent reposted={false} />);

    expect(screen.getByTestId("text-content")).toHaveTextContent(
      "Regular post content",
    );
    expect(screen.getByTestId("tagged-users")).toHaveTextContent("user1");
    expect(screen.getByTestId("tagged-users")).toHaveTextContent("User One");
  });

  it("renders reposted content when reposted is true", () => {
    render(<TextContent reposted={true} />);

    expect(screen.getByTestId("text-content")).toHaveTextContent(
      "Reposted content",
    );
    expect(screen.getByTestId("tagged-users")).toHaveTextContent("user2");
    expect(screen.getByTestId("tagged-users")).toHaveTextContent("User Two");
  });

  it("passes the correct props to TextViewer for regular content", () => {
    render(<TextContent reposted={false} />);

    expect(screen.getByTestId("max-chars")).toHaveTextContent("300");
    expect(screen.getByTestId("max-lines")).toHaveTextContent("3");
  });

  it("passes the correct props to TextViewer for reposted content", () => {
    render(<TextContent reposted={true} />);

    expect(screen.getByTestId("max-chars")).toHaveTextContent("300");
    expect(screen.getByTestId("max-lines")).toHaveTextContent("3");
  });

  it("applies the correct container styling", () => {
    render(<TextContent reposted={false} />);

    const container = screen.getByTestId("text-viewer").parentElement;
    expect(container).toHaveClass("pb-2");
    expect(container).toHaveClass("mx-4");
  });

  it("handles falsy tagged users gracefully", () => {
    // Mock post with undefined taggedUsers
    usePost.mockReturnValue({
      post: {
        ...mockPost,
        taggedUsers: undefined,
      },
    });

    // Should render without errors
    expect(() => {
      render(<TextContent reposted={false} />);
    }).not.toThrow();
  });

  it("handles falsy reposted content gracefully", () => {
    // Mock post with undefined repostedComponents.content
    usePost.mockReturnValue({
      post: {
        ...mockPost,
        repostedComponents: {
          ...mockPost.repostedComponents,
          content: undefined,
        },
      },
    });

    render(<TextContent reposted={true} />);

    // Should render without errors and with empty content
    expect(screen.getByTestId("text-content")).toBeEmptyDOMElement();
  });

  it("defaults to reposted=false when not specified", () => {
    render(<TextContent />);

    expect(screen.getByTestId("text-content")).toHaveTextContent(
      "Regular post content",
    );
  });
});

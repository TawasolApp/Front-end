import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PostContent from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/PostContent";

// Mock child components
vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/TextContent/TextContent",
  () => ({
    default: ({ reposted }) => (
      <div
        data-testid="text-content"
        data-reposted={reposted ? "true" : "false"}
      >
        Text Content Mock
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Content/MediaContent/MediaDisplay",
  () => ({
    default: ({ handleOpenPostModal, reposted }) => (
      <div
        data-testid="media-display"
        data-reposted={reposted ? "true" : "false"}
        onClick={handleOpenPostModal}
      >
        Media Display Mock
      </div>
    ),
  }),
);

describe("PostContent Component", () => {
  const mockHandleOpenPostModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders TextContent with default props", () => {
    render(<PostContent />);

    const textContent = screen.getByTestId("text-content");
    expect(textContent).toBeInTheDocument();
    expect(textContent).toHaveAttribute("data-reposted", "false");
  });

  it("renders MediaDisplay when not in modal mode", () => {
    render(
      <PostContent
        modal={false}
        handleOpenPostModal={mockHandleOpenPostModal}
      />,
    );

    const mediaDisplay = screen.getByTestId("media-display");
    expect(mediaDisplay).toBeInTheDocument();
    expect(mediaDisplay).toHaveAttribute("data-reposted", "false");
  });

  it("does not render MediaDisplay in modal mode", () => {
    render(
      <PostContent
        modal={true}
        handleOpenPostModal={mockHandleOpenPostModal}
      />,
    );

    expect(screen.queryByTestId("media-display")).not.toBeInTheDocument();
  });

  it("passes handleOpenPostModal to MediaDisplay", () => {
    render(
      <PostContent
        modal={false}
        handleOpenPostModal={mockHandleOpenPostModal}
      />,
    );

    const mediaDisplay = screen.getByTestId("media-display");
    mediaDisplay.click();

    expect(mockHandleOpenPostModal).toHaveBeenCalledTimes(1);
  });

  it("passes reposted=true to child components when specified", () => {
    render(
      <PostContent
        modal={false}
        handleOpenPostModal={mockHandleOpenPostModal}
        reposted={true}
      />,
    );

    const textContent = screen.getByTestId("text-content");
    expect(textContent).toHaveAttribute("data-reposted", "true");

    const mediaDisplay = screen.getByTestId("media-display");
    expect(mediaDisplay).toHaveAttribute("data-reposted", "true");
  });

  it("handles undefined handleOpenPostModal gracefully", () => {
    // This test ensures the component doesn't crash when handleOpenPostModal is not provided
    expect(() => {
      render(<PostContent modal={false} />);
    }).not.toThrow();

    const mediaDisplay = screen.getByTestId("media-display");
    expect(mediaDisplay).toBeInTheDocument();

    // Clicking shouldn't throw an error even without a handler
    expect(() => {
      mediaDisplay.click();
    }).not.toThrow();
  });
});

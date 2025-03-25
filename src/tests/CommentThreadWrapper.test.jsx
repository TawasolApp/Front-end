import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentThreadWrapper from "../pages/Feed/MainFeed/FeedPosts/PostCard/Comments/CommentThreadWrapper";

describe("CommentThreadWrapper Component", () => {
  it("renders children correctly", () => {
    render(
      <CommentThreadWrapper>
        <div data-testid="child-element">Test Child</div>
      </CommentThreadWrapper>,
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("applies correct spacing when hasReplies is false (default)", () => {
    const { container } = render(
      <CommentThreadWrapper>
        <div>Content</div>
      </CommentThreadWrapper>,
    );

    // Should have the inner div with pl-8 class for padding
    const paddingDiv = container.querySelector(".pl-8");
    expect(paddingDiv).toBeInTheDocument();

    // Should not have the px-[15px] div
    const threadLineDiv = container.querySelector(".px-\\[15px\\]");
    expect(threadLineDiv).not.toBeInTheDocument();
  });

  it("applies correct spacing when hasReplies is true", () => {
    const { container } = render(
      <CommentThreadWrapper hasReplies={true}>
        <div>Content</div>
      </CommentThreadWrapper>,
    );

    // Should have the inner div with px-[15px] class for the thread line
    const threadLineDiv = container.querySelector(".px-\\[15px\\]");
    expect(threadLineDiv).toBeInTheDocument();

    // Should not have the pl-8 div
    const paddingDiv = container.querySelector(".pl-8");
    expect(paddingDiv).not.toBeInTheDocument();
  });

  it("has the expected structure with outer container and content div", () => {
    const { container } = render(
      <CommentThreadWrapper>
        <div>Content</div>
      </CommentThreadWrapper>,
    );

    // Outer container should have the relative, px-4, and flex classes
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass("relative");
    expect(outerDiv).toHaveClass("px-4");
    expect(outerDiv).toHaveClass("flex");

    // Inner content div should have relative and full-w classes
    const contentDiv = container.querySelector(".relative.full-w");
    expect(contentDiv).toBeInTheDocument();
  });

  it("accepts and handles isLastReply prop", () => {
    render(
      <CommentThreadWrapper hasReplies={true} isLastReply={true}>
        <div>Content</div>
      </CommentThreadWrapper>,
    );

    // The component accepts the prop, but currently doesn't use it for styling
    // This test ensures the component doesn't break when the prop is provided
    // If functionality is added in the future that uses this prop, the test should be updated
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});

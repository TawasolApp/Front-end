import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ImageEnlarge from "../pages/UserProfile/Components/HeaderComponents/ImageEnlarge";

// Sample image
const testImage = "https://example.com/image.jpg";

// Helper to reset scroll lock
function resetScrollLock() {
  document.body.classList.remove("overflow-hidden");
}

describe("ImageEnlarge Component", () => {
  beforeEach(() => resetScrollLock());
  afterEach(() => cleanup());

  it("does not render if isOpen is false", () => {
    render(
      <ImageEnlarge
        isOpen={false}
        profilePicture={testImage}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByAltText("Profile Enlarged")).not.toBeInTheDocument();
  });

  it("does not render if profilePicture is missing", () => {
    render(
      <ImageEnlarge isOpen={true} profilePicture={null} onClose={vi.fn()} />,
    );
    expect(screen.queryByAltText("Profile Enlarged")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true and profilePicture is provided", () => {
    render(
      <ImageEnlarge
        isOpen={true}
        profilePicture={testImage}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByAltText("Profile Enlarged")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ImageEnlarge
        isOpen={true}
        profilePicture={testImage}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalled();
  });

  it("adds and removes scroll lock class to body", () => {
    const { unmount } = render(
      <ImageEnlarge
        isOpen={true}
        profilePicture={testImage}
        onClose={vi.fn()}
      />,
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(true);
    unmount();
    expect(document.body.classList.contains("overflow-hidden")).toBe(false);
  });
});

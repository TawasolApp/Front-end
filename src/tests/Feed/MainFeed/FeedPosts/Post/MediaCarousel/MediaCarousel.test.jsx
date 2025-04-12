import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MediaCarousel from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/MediaCarousel/MediaCarousel";

describe("MediaCarousel Component", () => {
  // Mock media data
  const imageMedia = ["image1.jpg", "image2.jpg", "image3.jpg"];
  const mixedMedia = ["image1.jpg", "video.mp4", "image3.jpg"];

  // Helper to find buttons by position rather than name
  const findPrevButton = () => screen.getAllByRole("button")[0];
  const findNextButton = () => screen.getAllByRole("button")[1];

  beforeEach(() => {
    // Clean up between tests
    vi.clearAllMocks();
  });

  it("renders correctly with single image", () => {
    const singleImage = ["image1.jpg"];
    render(<MediaCarousel media={singleImage} mediaIndex={0} />);

    // Should have one image and no navigation buttons should be enabled
    const img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(singleImage[0]);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled(); // Previous
    expect(buttons[1]).toBeDisabled(); // Next
  });

  it("renders correctly with multiple images starting at first image", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={0} />);

    // Should show the first image
    const img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageMedia[0]);

    // Previous button should be disabled, next button enabled
    const prevButton = findPrevButton();
    const nextButton = findNextButton();
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("renders correctly with multiple images starting at middle image", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={1} />);

    // Should show the second image
    const img = screen.getByAltText("Post media 2");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageMedia[1]);

    // Both buttons should be enabled
    const prevButton = findPrevButton();
    const nextButton = findNextButton();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("renders correctly with multiple images starting at last image", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={2} />);

    // Should show the last image
    const img = screen.getByAltText("Post media 3");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageMedia[2]);

    // Previous button should be enabled, next button disabled
    const prevButton = findPrevButton();
    const nextButton = findNextButton();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("navigates to next image when next button is clicked", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={0} />);

    // Initial state - first image
    let img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();

    // Click next button
    const nextButton = findNextButton();
    fireEvent.click(nextButton);

    // Should now show the second image
    img = screen.getByAltText("Post media 2");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageMedia[1]);
  });

  it("navigates to previous image when previous button is clicked", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={1} />);

    // Initial state - second image
    let img = screen.getByAltText("Post media 2");
    expect(img).toBeInTheDocument();

    // Click previous button
    const prevButton = findPrevButton();
    fireEvent.click(prevButton);

    // Should now show the first image
    img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(imageMedia[0]);
  });

  it("disables previous button at first image", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={1} />);

    // Navigate to first image
    const prevButton = findPrevButton();
    fireEvent.click(prevButton);

    // Previous button should now be disabled
    expect(prevButton).toBeDisabled();
  });

  it("disables next button at last image", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={1} />);

    // Navigate to last image
    const nextButton = findNextButton();
    fireEvent.click(nextButton);

    // Next button should now be disabled
    expect(nextButton).toBeDisabled();
  });

  it("renders video elements for video media", () => {
    render(<MediaCarousel media={mixedMedia} mediaIndex={1} />);

    // Should render a video element - using querySelector instead of getByRole
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video.src).toContain(mixedMedia[1]);
    expect(video).toHaveAttribute("controls");
  });

  it("correctly determines media type based on file extension", () => {
    render(<MediaCarousel media={mixedMedia} mediaIndex={0} />);

    // Start with an image
    expect(screen.getByAltText("Post media 1")).toBeInTheDocument();
    expect(document.querySelector("video")).toBeVisible();

    // Navigate to video
    const nextButton = findNextButton();
    fireEvent.click(nextButton);

    expect(screen.queryByAltText("Post media 2")).not.toBeInTheDocument();

    // Check for video element using querySelector
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();

    // Navigate to image again
    fireEvent.click(nextButton);

    expect(screen.getByAltText("Post media 3")).toBeInTheDocument();
    expect(document.querySelector("video")).toBeVisible();
  });

  it("handles clicking next multiple times correctly", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={0} />);

    const nextButton = findNextButton();

    // First click - should move to second image
    fireEvent.click(nextButton);
    let img = screen.getByAltText("Post media 2");
    expect(img).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();

    // Second click - should move to third image
    fireEvent.click(nextButton);
    img = screen.getByAltText("Post media 3");
    expect(img).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    // Another click should not change anything (button is disabled)
    fireEvent.click(nextButton);
    img = screen.getByAltText("Post media 3");
    expect(img).toBeInTheDocument();
  });

  it("handles clicking previous multiple times correctly", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={2} />);

    const prevButton = findPrevButton();

    // First click - should move to second image
    fireEvent.click(prevButton);
    let img = screen.getByAltText("Post media 2");
    expect(img).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();

    // Second click - should move to first image
    fireEvent.click(prevButton);
    img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();
    expect(prevButton).toBeDisabled();

    // Another click should not change anything (button is disabled)
    fireEvent.click(prevButton);
    img = screen.getByAltText("Post media 1");
    expect(img).toBeInTheDocument();
  });

  it("renders all images but only shows the current one", () => {
    render(<MediaCarousel media={imageMedia} mediaIndex={0} />);

    // All images should be in the DOM but only the current one should be visible
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(3);

    // Check that only the first image has opacity-100 class
    const containers = images.map((img) => img.parentElement.parentElement);
    expect(containers[0].className).toContain("opacity-100");
    expect(containers[1].className).toContain("opacity-0");
    expect(containers[2].className).toContain("opacity-0");

    // Navigate to second image - use the updated button finder
    const nextButton = findNextButton();
    fireEvent.click(nextButton);

    // Now the second image should be visible
    expect(containers[0].className).toContain("opacity-0");
    expect(containers[1].className).toContain("opacity-100");
    expect(containers[2].className).toContain("opacity-0");
  });
});

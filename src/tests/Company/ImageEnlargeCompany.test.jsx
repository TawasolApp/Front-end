import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ImageEnlarge from "../../pages/Company/Components/HomePage/ImageEnlarge";

describe("ImageEnlarge", () => {
  const dummyImage = "https://example.com/test-image.jpg";

  test("does not render when isOpen is false", () => {
    render(
      <ImageEnlarge
        profilePicture={dummyImage}
        isOpen={false}
        onClose={vi.fn()}
      />,
    );

    // Modal should not exist
    const image = screen.queryByAltText("Profile Enlarged");
    expect(image).not.toBeInTheDocument();
  });

  test("renders image when isOpen is true", () => {
    render(
      <ImageEnlarge
        profilePicture={dummyImage}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const image = screen.getByAltText("Profile Enlarged");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", dummyImage);
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <ImageEnlarge
        profilePicture={dummyImage}
        isOpen={true}
        onClose={onClose}
      />,
    );

    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  test("clicking inside modal doesn't trigger onClose", () => {
    const onClose = vi.fn();

    render(
      <ImageEnlarge
        profilePicture={dummyImage}
        isOpen={true}
        onClose={onClose}
      />,
    );

    const imageContainer =
      screen.getByAltText("Profile Enlarged").parentElement;
    fireEvent.click(imageContainer); // Should NOT close

    expect(onClose).not.toHaveBeenCalled();
  });
});

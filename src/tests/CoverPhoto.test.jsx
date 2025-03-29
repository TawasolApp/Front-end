import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CoverPhoto from "../pages/UserProfile/Components/HeaderComponents/CoverPhoto";

describe("CoverPhoto Component", () => {
  const mockImage = "test-cover.jpg";

  it("renders the cover image with correct src", () => {
    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    const img = screen.getByAltText("Cover");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockImage);
  });

  it("calls onImageClick when cover image is clicked", () => {
    const handleClick = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />,
    );

    const img = screen.getByAltText("Cover");
    fireEvent.click(img);
    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  it("renders upload button with camera icon and calls onUpload when clicked", () => {
    const handleUpload = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />,
    );

    const uploadBtn = screen.getByRole("button");
    const icon = screen.getByAltText("Change Cover");
    expect(icon).toBeInTheDocument();
    fireEvent.click(uploadBtn);
    expect(handleUpload).toHaveBeenCalled();
  });

  it("does not render upload button if not owner", () => {
    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={false}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    const button = screen.queryByRole("button");
    expect(button).toBeNull();

    const icon = screen.queryByAltText("Change Cover");
    expect(icon).toBeNull();
  });
});

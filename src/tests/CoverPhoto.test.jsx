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
      />
    );

    const img = screen.getByAltText("Cover Photo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockImage);
  });

  it("calls onImageClick when image is clicked", () => {
    const handleClick = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("Cover Photo");
    fireEvent.click(img);
    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  it("renders upload button for owners and triggers onUpload", () => {
    const handleUpload = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />
    );

    const uploadBtn = screen.getByRole("button");
    fireEvent.click(uploadBtn);
    expect(handleUpload).toHaveBeenCalled();
  });

  it("does not show upload button for non-owners", () => {
    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={false}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const button = screen.queryByRole("button");
    expect(button).toBeNull();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CoverPhoto from "../../../pages/UserProfile/Components/HeaderComponents/CoverPhoto";

describe("CoverPhoto Component", () => {
  const mockImage = "test-cover.jpg";
  const defaultImage = "defaultCoverPhoto.jpg";

  it("renders the cover image with correct src", () => {
    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
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
      />
    );

    fireEvent.click(screen.getByAltText("Cover"));
    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  it("renders edit icon (✎) if custom image and calls onUpload", () => {
    const handleUpload = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleUpload).toHaveBeenCalled();
    expect(screen.getByText("✎")).toBeInTheDocument();
  });

  it("renders camera icon if default image and calls onUpload", () => {
    const handleUpload = vi.fn();

    render(
      <CoverPhoto
        backgroundImage={defaultImage}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />
    );

    const icon = screen.getByAltText("Change Cover");
    expect(icon).toBeInTheDocument();

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleUpload).toHaveBeenCalled();
  });

  it("does not render upload button if not owner", () => {
    render(
      <CoverPhoto
        backgroundImage={mockImage}
        isOwner={false}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByAltText("Change Cover")).toBeNull();
  });
});

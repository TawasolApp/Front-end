import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePicture from "../pages/UserProfile/Components/HeaderComponents/ProfilePicture";

describe("ProfilePicture Component", () => {
  const mockSrc = "test-profile.jpg";

  it("renders the profile picture", () => {
    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("User Profile");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockSrc);
  });

  it("calls onImageClick when image is clicked", () => {
    const handleClick = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("User Profile");
    fireEvent.click(img);
    expect(handleClick).toHaveBeenCalledWith(mockSrc);
  });

  it("shows and triggers upload button for owners", () => {
    const handleUpload = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
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
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={false}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0);
  });
});

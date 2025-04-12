import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePicture from "../../../pages/UserProfile/Components/HeaderComponents/ProfilePicture";

describe("ProfilePicture Component", () => {
  const mockSrc = "test-profile.jpg";
  const defaultSrc = "defaultProfilePicture.png";

  it("renders the profile picture with correct src and alt text", () => {
    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("Profile");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockSrc);
  });

  it("calls onImageClick with image src when non-default image is clicked", () => {
    const handleClick = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("Profile");
    fireEvent.click(img);

    expect(handleClick).toHaveBeenCalledWith(mockSrc);
  });

  it("does not call onImageClick when default image is clicked", () => {
    const handleClick = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={defaultSrc}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />
    );

    const img = screen.getByAltText("Profile");
    fireEvent.click(img);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows ✎ icon if custom image and triggers onUpload on click", () => {
    const handleUpload = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />
    );

    const uploadButton = screen.getByTitle("Edit Profile Picture");
    expect(uploadButton).toHaveTextContent("✎");

    fireEvent.click(uploadButton);
    expect(handleUpload).toHaveBeenCalled();
  });

  it("shows + icon if default image", () => {
    render(
      <ProfilePicture
        profilePictureSrc={defaultSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />
    );

    const uploadButton = screen.getByTitle("Edit Profile Picture");
    expect(uploadButton).toHaveTextContent("+");
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

    const uploadButton = screen.queryByTitle("Edit Profile Picture");
    expect(uploadButton).not.toBeInTheDocument();
  });
});

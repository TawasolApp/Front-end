import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePicture from "../pages/UserProfile/Components/HeaderComponents/ProfilePicture";

describe("ProfilePicture Component", () => {
  const mockSrc = "test-profile.jpg";

  it("renders the profile picture with the correct src and alt text", () => {
    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    const img = screen.getByAltText("Profile"); // updated alt text
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockSrc);
  });

  it("calls onImageClick with image src when clicked", () => {
    const handleClick = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={handleClick}
        onUpload={vi.fn()}
      />,
    );

    const img = screen.getByAltText("Profile"); // updated alt text
    fireEvent.click(img);

    expect(handleClick).toHaveBeenCalledWith(mockSrc);
  });

  it("shows upload button (+ icon) and triggers onUpload when clicked for owners", () => {
    const handleUpload = vi.fn();

    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={true}
        onImageClick={vi.fn()}
        onUpload={handleUpload}
      />,
    );

    const uploadButton = screen.getByRole("button", { name: "+" }); // the "+" icon is the button content
    expect(uploadButton).toBeInTheDocument();

    fireEvent.click(uploadButton);
    expect(handleUpload).toHaveBeenCalled();
  });

  it("does not show upload button for non-owners", () => {
    render(
      <ProfilePicture
        profilePictureSrc={mockSrc}
        isOwner={false}
        onImageClick={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0); // assuming only the "+" button exists for owners
  });
});

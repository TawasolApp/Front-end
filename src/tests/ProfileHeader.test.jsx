import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileHeader from "../pages/UserProfile/Components/HeaderComponents/ProfileHeader";

// Mock children components to isolate ProfileHeader
vi.mock("../pages/UserProfile/Components/ViewerView", () => ({
  default: () => <div data-testid="viewer-view">ViewerView Component</div>,
}));

vi.mock(
  "../pages/UserProfile/Components/HeaderComponents/ImageEnlarge",
  () => ({
    default: ({ profilePicture, onClose }) => (
      <div data-testid="image-enlarge" onClick={onClose}>
        Enlarged: {profilePicture}
      </div>
    ),
  }),
);

vi.mock("../pages/UserProfile/Components/ImageUploadModal", () => ({
  default: ({ isOpen, onClose, onUpload }) =>
    isOpen ? (
      <div data-testid="upload-modal">
        Upload Modal
        <button
          data-testid="upload-confirm"
          onClick={() => onUpload("uploaded.jpg")}
        >
          Confirm Upload
        </button>
        <button data-testid="upload-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    ) : null,
}));

vi.mock(
  "../pages/UserProfile/Components/HeaderComponents/EditProfileModal",
  () => ({
    default: ({ isOpen, onClose, onSave }) =>
      isOpen ? (
        <div data-testid="edit-modal">
          Edit Modal
          <button
            data-testid="save-edit"
            onClick={() => onSave({ firstName: "Updated" })}
          >
            Save
          </button>
          <button data-testid="cancel-edit" onClick={onClose}>
            Cancel
          </button>
        </div>
      ) : null,
  }),
);

vi.mock(
  "../pages/UserProfile/Components/HeaderComponents/ProfilePicture",
  () => ({
    default: ({ onImageClick, onUpload }) => (
      <>
        <img
          data-testid="profile-picture"
          alt="Profile"
          onClick={() => onImageClick("profile.jpg")}
        />
        <button data-testid="upload-profile" onClick={onUpload}>
          Upload Profile
        </button>
      </>
    ),
  }),
);

vi.mock("../pages/UserProfile/Components/HeaderComponents/CoverPhoto", () => ({
  default: ({ onImageClick, onUpload }) => (
    <>
      <img
        data-testid="cover-photo"
        alt="Cover"
        onClick={() => onImageClick("cover.jpg")}
      />
      <button data-testid="upload-cover" onClick={onUpload}>
        Upload Cover
      </button>
    </>
  ),
}));

describe("ProfileHeader Component", () => {
  const scrollToMock = vi.fn();
  const mockUser = {
    firstName: "Fatma",
    lastName: "Gamal",
    bio: "Frontend Developer",
    city: "Cairo",
    country: "Egypt",
    connectionCount: 42,
    experience: [{ title: "Software Intern" }],
    education: [{ institution: "Cairo University" }],
    profilePicture: "",
    coverPhoto: "",
  };

  const experienceRef = { current: document.createElement("div") };
  const educationRef = { current: document.createElement("div") };

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = scrollToMock;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui) =>
    render(
      <MemoryRouter initialEntries={["/users/fatma-gamal-1"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={ui} />
        </Routes>
      </MemoryRouter>,
    );

  it("returns null if editedUser is null", () => {
    const { container } = renderWithRouter(<ProfileHeader user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders user info and dynamic sections for owner", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    expect(screen.getByText("Fatma Gamal")).toBeInTheDocument();
    expect(screen.getByText("Student at Cairo University")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) => content.includes("Cairo") && content.includes("Egypt"),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("42 connections")).toBeInTheDocument();
    expect(screen.getByText("Software Intern")).toBeInTheDocument();
    expect(screen.getByText("Cairo University")).toBeInTheDocument();
  });

  it("renders viewer view if not owner", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={false}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    expect(screen.getByTestId("viewer-view")).toBeInTheDocument();
  });

  it("opens edit modal on edit button click", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("saves profile changes and closes edit modal", () => {
    const onSave = vi.fn();
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={onSave}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    fireEvent.click(screen.getByTestId("save-edit"));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "Updated" }),
    );
  });

  it("opens image modal when profile picture is clicked", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("profile-picture"));
    expect(screen.getByTestId("image-enlarge")).toHaveTextContent(
      "profile.jpg",
    );
  });

  it("opens image modal when cover photo is clicked", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("cover-photo"));
    expect(screen.getByTestId("image-enlarge")).toHaveTextContent("cover.jpg");
  });

  it("opens upload modal and handles profile upload", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-profile"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("upload-confirm"));
    // nothing to assert here — state updates inside component only
  });

  it("handles cover photo upload through modal", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-cover"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("upload-confirm"));
  });

  it("scrolls to experience and education sections on click", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByText("Software Intern"));
    fireEvent.click(screen.getByText("Cairo University"));

    expect(scrollToMock).toHaveBeenCalledTimes(2);
  });
});

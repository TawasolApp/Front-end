import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileHeader from "../pages/UserProfile/Components/HeaderComponents/ProfileHeader";

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
  })
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
          <button onClick={onClose}>Cancel</button>
        </div>
      ) : null,
  })
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
        <button data-testid="upload-profile" onClick={() => onUpload()}>
          Upload Profile
        </button>
      </>
    ),
  })
);
vi.mock("../pages/UserProfile/Components/HeaderComponents/CoverPhoto", () => ({
  default: ({ onImageClick, onUpload }) => (
    <>
      <img
        data-testid="cover-photo"
        alt="Cover"
        onClick={() => onImageClick("cover.jpg")}
      />
      <button data-testid="upload-cover" onClick={() => onUpload()}>
        Upload Cover
      </button>
    </>
  ),
}));

describe("ProfileHeader Component", () => {
  const mockUser = {
    firstName: "Fatma",
    lastName: "Gamal",
    bio: "Frontend Developer",
    country: "Egypt",
    city: "Cairo",
    connectionCount: 42,
    experience: [{ title: "Software Intern" }],
    education: [{ institution: "Cairo University" }],
    profilePicture: "",
    coverPhoto: "",
  };

  const scrollToMock = vi.fn();

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = scrollToMock;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  function renderWithRouter(children) {
    return render(
      <MemoryRouter initialEntries={["/users/fatma-gamal-1"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<>{children}</>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("renders user basic information", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    expect(screen.getByText("Fatma Gamal")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Egypt, Cairo")).toBeInTheDocument();
    expect(screen.getByText("42 connections")).toBeInTheDocument();
    expect(screen.getByText("Software Intern")).toBeInTheDocument();
    expect(screen.getByText("Cairo University")).toBeInTheDocument();
  });

  it("renders ViewerView if not owner", async () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={false}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    const viewer = await screen.findByTestId("viewer-view");
    expect(viewer).toBeInTheDocument();
  });

  it("opens edit modal on edit button click", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    const editBtn = screen.getByRole("button", { name: /✎/i });
    fireEvent.click(editBtn);
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("calls saveProfileChanges when save button clicked", () => {
    const onSave = vi.fn();
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={onSave}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    fireEvent.click(screen.getByTestId("save-edit"));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "Updated" })
    );
  });

  it("opens image modal when profile picture is clicked", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    const profilePic = screen.getByTestId("profile-picture");
    fireEvent.click(profilePic);
    expect(screen.getByTestId("image-enlarge")).toHaveTextContent(
      "profile.jpg"
    );
  });

  it("opens image modal when cover photo is clicked", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    const coverPhoto = screen.getByTestId("cover-photo");
    fireEvent.click(coverPhoto);
    expect(screen.getByTestId("image-enlarge")).toHaveTextContent("cover.jpg");
  });

  it("opens upload modal when profile or cover upload is clicked", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    fireEvent.click(screen.getByTestId("upload-profile"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("upload-confirm"));
  });

  it("updates backgroundImage when uploading cover photo", () => {
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={{ current: document.createElement("div") }}
        educationRef={{ current: document.createElement("div") }}
      />
    );

    fireEvent.click(screen.getByTestId("upload-cover"));
    fireEvent.click(screen.getByTestId("upload-confirm"));
  });

  it("calls scrollToSection for experience and education", () => {
    const expRef = { current: document.createElement("div") };
    const eduRef = { current: document.createElement("div") };
    renderWithRouter(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        onSave={vi.fn()}
        experienceRef={expRef}
        educationRef={eduRef}
      />
    );

    fireEvent.click(screen.getByText("Software Intern"));
    fireEvent.click(screen.getByText("Cairo University"));

    expect(scrollToMock).toHaveBeenCalledTimes(2);
  });
});

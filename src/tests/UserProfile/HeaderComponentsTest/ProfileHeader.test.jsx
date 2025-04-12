import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfileHeader from "../../../pages/UserProfile/Components/HeaderComponents/ProfileHeader";
import { axiosInstance as axios } from "../../../apis/axios.js";

// Setup a basic redux store with mocked authentication
const mockStore = configureStore({
  reducer: {
    authentication: () => ({ userId: "viewer-1" }),
  },
});

// Mock ViewerView component
vi.mock("./ViewerView", () => ({
  default: () => <div data-testid="viewer-view">ViewerView Component</div>,
}));

// Mock image modal
vi.mock(
  "../../../pages/UserProfile/Components/HeaderComponents/ImageEnlarge",
  () => ({
    default: ({ profilePicture, onClose }) => (
      <div data-testid="image-enlarge" onClick={onClose}>
        Enlarged: {profilePicture}
      </div>
    ),
  }),
);

vi.mock(
  "../../../pages/UserProfile/Components/HeaderComponents/ImageUploadModal",
  () => ({
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
          <button data-testid="upload-delete" onClick={() => onUpload(null)}>
            Delete
          </button>
        </div>
      ) : null,
  }),
);

vi.mock(
  "../../../pages/UserProfile/Components/HeaderComponents/EditProfileModal",
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
  "../../../pages/UserProfile/Components/HeaderComponents/ProfilePicture",
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

vi.mock(
  "../../../pages/UserProfile/Components/HeaderComponents/CoverPhoto",
  () => ({
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
  }),
);

describe("ProfileHeader Component", () => {
  const scrollToMock = vi.fn();

  const mockUser = {
    _id: "user-123",
    firstName: "Fatma",
    lastName: "Gamal",
    headline: "Student at Cairo University",
    location: "Cairo, Egypt",
    connectionCount: 42,
    workExperience: [{ title: "Software Intern" }],
    education: [{ school: "Cairo University" }],
    profilePicture: "",
    coverPhoto: "",
    selectedExperienceIndex: 0,
    selectedEducationIndex: 0,
    connectStatus: "not_connected",
    followStatus: false,
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

  const renderWithProviders = (ui) =>
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/users/fatma-gamal-1"]}>
          <Routes>
            <Route path="/users/:profileSlug" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

  it("returns null if user is null", () => {
    const { container } = renderWithProviders(<ProfileHeader user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders profile info if user is owner", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    expect(screen.getByText("Fatma Gamal")).toBeInTheDocument();
    expect(screen.getByText("Student at Cairo University")).toBeInTheDocument();
    expect(screen.getByText(/Cairo.*Egypt/)).toBeInTheDocument();
    expect(screen.getByText("42 connections")).toBeInTheDocument();
    expect(screen.getByText("Software Intern")).toBeInTheDocument();
    expect(screen.getByText("Cairo University")).toBeInTheDocument();
  });

  it("handles deleting profile picture when fileOrNull is null", async () => {
    const deleteSpy = vi.spyOn(axios, "delete");

    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-profile"));
    fireEvent.click(screen.getByTestId("upload-delete"));

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("/profile/profile-picture");
    });
  });

  it("renders viewer view if not owner", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={false}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );
    expect(screen.getByTestId("viewer-view")).toBeInTheDocument();
  });

  it("opens edit modal when edit button is clicked", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("saves edit and closes modal", () => {
    const onSave = vi.fn();
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
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

  it("opens image modal for profile picture", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
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

  it("opens image modal for cover photo", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("cover-photo"));
    expect(screen.getByTestId("image-enlarge")).toHaveTextContent("cover.jpg");
  });

  it("opens upload modal and handles profile picture upload", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-profile"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("upload-confirm"));
  });

  it("opens upload modal and handles cover photo upload", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-cover"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("upload-confirm"));
  });
  it("updates visibility when saved in visibility modal", async () => {
    const patchSpy = vi.spyOn(axios, "patch").mockResolvedValueOnce({});
    const onSave = vi.fn();

    renderWithProviders(
      <ProfileHeader
        user={{ ...mockUser, visibility: "public" }}
        isOwner={true}
        isVisible={true}
        onSave={onSave}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    // Open the 3-dot menu and visibility modal
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    fireEvent.click(screen.getByText(/edit profile visibility/i));

    // Change visibility to trigger state update (radio input)
    fireEvent.click(screen.getByRole("radio", { name: /connections only/i }));

    // Save the new visibility
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(patchSpy).toHaveBeenCalledWith("/profile", {
        visibility: "connections_only",
      });
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ visibility: "connections_only" }),
      );
    });
  });
  it("saves edit and closes modal", async () => {
    const onSave = vi.fn();
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={onSave}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("save-edit"));

    await waitFor(() => {
      // Modal should disappear
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "Updated" }),
    );
  });
  it("uploads new profile picture and updates UI", async () => {
    const postSpy = vi
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ data: { url: "http://test.com/image.jpg" } });

    const patchSpy = vi.spyOn(axios, "patch").mockResolvedValueOnce({});

    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    // Open upload modal
    fireEvent.click(screen.getByTestId("upload-profile"));
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();

    // Confirm upload (this calls onUpload("uploaded.jpg"))
    fireEvent.click(screen.getByTestId("upload-confirm"));

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith(
        "/media",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );

      expect(patchSpy).toHaveBeenCalledWith("/profile", {
        profilePicture: "http://test.com/image.jpg",
      });
    });
  });

  it("handles upload error gracefully", async () => {
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("Upload failed"));

    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
        onSave={vi.fn()}
        experienceRef={experienceRef}
        educationRef={educationRef}
      />,
    );

    fireEvent.click(screen.getByTestId("upload-profile"));
    fireEvent.click(screen.getByTestId("upload-confirm"));

    await waitFor(() => {
      // Optionally assert that the UI did not break or log was triggered
      // You can spy on console.error if needed
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("scrolls to experience and education on click", () => {
    renderWithProviders(
      <ProfileHeader
        user={mockUser}
        isOwner={true}
        isVisible={true}
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

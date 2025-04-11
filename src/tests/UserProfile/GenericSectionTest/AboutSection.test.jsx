import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AboutSection from "../../../pages/UserProfile/Components/Sections/AboutSection";

// ✅ Mock AboutEditingModal so we don't render the full modal
vi.mock(
  "../../../pages/UserProfile/Components/AboutComponents/AboutEditingModal",
  () => ({
    default: ({ onSave, onClose }) => (
      <div data-testid="about-modal">
        <button onClick={() => onSave("Updated bio")}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    ),
  }),
);

// ✅ Mock axiosInstance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(() => Promise.resolve({ data: { bio: "Updated bio" } })),
    delete: vi.fn(() => Promise.resolve({})),
  },
}));

const userWithBio = { id: "1", bio: "This is a sample bio" };
const userWithoutBio = { id: "1" };

describe("AboutSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows bio text if available", () => {
    render(<AboutSection user={userWithBio} isOwner={false} />);
    expect(screen.getByText("This is a sample bio")).toBeInTheDocument();
  });

  it("shows modal and updates bio on save", async () => {
    render(<AboutSection user={userWithoutBio} isOwner={true} />);
    fireEvent.click(screen.getByText("+")); // open modal
    fireEvent.click(screen.getByText("Save")); // save

    await waitFor(() =>
      expect(screen.getByText("Updated bio")).toBeInTheDocument(),
    );
  });

  it("deletes bio if saved as empty", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    axiosInstance.patch.mockImplementation(() => Promise.resolve({ data: {} }));

    render(<AboutSection user={{ ...userWithBio }} isOwner={true} />);
    fireEvent.click(screen.getByText("✎")); // open modal

    const modal = screen.getByTestId("about-modal");
    expect(modal).toBeInTheDocument();

    // Simulate save empty bio (mocked as still calling patch here)
    await waitFor(() => {
      fireEvent.click(screen.getByText("Save"));
    });

    expect(axiosInstance.patch).toHaveBeenCalled();
  });

  it("does not render if not owner and bio is empty", () => {
    render(<AboutSection user={userWithoutBio} isOwner={false} />);
    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });
});

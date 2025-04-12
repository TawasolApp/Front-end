import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AboutSection from "../../../pages/UserProfile/Components/Sections/AboutSection";

// ✅ Mock AboutEditingModal
vi.mock(
  "../../../pages/UserProfile/Components/AboutComponents/AboutEditingModal",
  () => ({
    default: ({ onSave, onClose }) => (
      <div data-testid="about-modal">
        <button onClick={() => onSave("Updated bio")}>Save</button>
        <button onClick={() => onSave("   ")}>Save Empty</button>
        <button onClick={onClose}>Close</button>
      </div>
    ),
  })
);

// ✅ Mock axios
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
    fireEvent.click(screen.getByText("Save")); // simulate save updated bio

    await waitFor(() =>
      expect(screen.getByText("Updated bio")).toBeInTheDocument()
    );
  });

  it("calls delete and clears bio when empty string is saved", async () => {
    const { axiosInstance } = await import("../../../apis/axios");

    render(<AboutSection user={userWithBio} isOwner={true} />);
    fireEvent.click(screen.getByText("✎")); // open modal
    fireEvent.click(screen.getByText("Save Empty")); // simulate empty save

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith("/profile/bio");
      expect(
        screen.queryByText("This is a sample bio")
      ).not.toBeInTheDocument();
    });
  });

  it("logs error if patch fails", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    const error = new Error("Patch failed");
    axiosInstance.patch.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<AboutSection user={userWithoutBio} isOwner={true} />);
    fireEvent.click(screen.getByText("+")); // open modal
    fireEvent.click(screen.getByText("Save")); // simulate patch error

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to update bio:", error);
    });

    consoleSpy.mockRestore();
  });

  it("logs error if delete fails", async () => {
    const { axiosInstance } = await import("../../../apis/axios");
    const error = new Error("Delete failed");
    axiosInstance.delete.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<AboutSection user={userWithBio} isOwner={true} />);
    fireEvent.click(screen.getByText("✎")); // open modal
    fireEvent.click(screen.getByText("Save Empty")); // simulate delete error

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to update bio:", error);
    });

    consoleSpy.mockRestore();
  });

  it("does not render if not owner and bio is empty", () => {
    render(<AboutSection user={userWithoutBio} isOwner={false} />);
    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });
});

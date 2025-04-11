// ResumeSection.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ Mock axios with fresh mocks inside the factory to avoid hoisting issues
vi.mock("../../../apis/axios", () => {
  return {
    axiosInstance: {
      patch: vi.fn(),
      post: vi.fn(),
    },
  };
});

vi.mock("react-icons/fa", () => ({
  FaEye: () => <span>ViewIcon</span>,
  FaDownload: () => <span>DownloadIcon</span>,
  FaTrash: () => <button>DeleteIcon</button>,
}));

vi.mock(
  "../../../pages/UserProfile/Components/GenericDisplay/ConfirmModal",
  () => ({
    default: ({ onConfirm, onCancel }) => (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ),
  })
);

// ✅ Import AFTER mocks
import { axiosInstance } from "../../../apis/axios";
import ResumeSection from "../../../pages/UserProfile/Components/Sections/ResumeSection";

const mockUser = {
  id: "123",
  resume: "http://localhost/resume.pdf",
};

describe("ResumeSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders resume file name and icons if resume exists", () => {
    render(<ResumeSection user={mockUser} isOwner={true} />);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.getByText("ViewIcon")).toBeInTheDocument();
    expect(screen.getByText("DownloadIcon")).toBeInTheDocument();
    expect(screen.getByText("DeleteIcon")).toBeInTheDocument();
  });

  it("shows upload UI when no resume exists", () => {
    render(<ResumeSection user={{ id: "123" }} isOwner={true} />);
    expect(
      screen.getByText("Add a resume to help recruiters find you")
    ).toBeInTheDocument();
    expect(screen.getByText("Upload Resume")).toBeInTheDocument();
  });

  it("calls delete API and hides modal when confirm is clicked", async () => {
    axiosInstance.patch.mockResolvedValue({ status: 200 });

    render(<ResumeSection user={mockUser} isOwner={true} />);
    fireEvent.click(screen.getByText("DeleteIcon")); // open modal
    fireEvent.click(screen.getByText("Delete")); // confirm delete

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith("/profile/123", {
        resume: null,
      });
    });
  });

  it("closes delete modal when cancel is clicked", () => {
    render(<ResumeSection user={mockUser} isOwner={true} />);
    fireEvent.click(screen.getByText("DeleteIcon")); // open modal
    fireEvent.click(screen.getByText("Cancel")); // cancel
    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });
});

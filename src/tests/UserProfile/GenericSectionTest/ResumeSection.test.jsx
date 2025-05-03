import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResumeSection from "../../../pages/UserProfile/Components/Sections/ResumeSection";
import { axiosInstance as axios } from "../../../apis/axios";
import { vi } from "vitest";

// Mocks
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock(
  "../../../pages/UserProfile/Components/ReusableModals/ConfirmModal",
  () => ({
    __esModule: true,
    default: ({ title, onConfirm, onCancel }) => (
      <div data-testid="confirm-modal">
        <div>{title}</div>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ),
  })
);

describe("ResumeSection", () => {
  const userWithResume = {
    _id: "123",
    resume: "https://example.com/files/my_resume.pdf",
  };

  const userWithoutResume = {
    _id: "123",
    resume: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows upload prompt when no resume exists", () => {
    render(<ResumeSection user={userWithoutResume} isOwner={true} />);
    expect(
      screen.getByText("Add a resume to help recruiters find you")
    ).toBeInTheDocument();
    expect(screen.getByText("Upload Resume")).toBeInTheDocument();
  });

  it("displays resume info with view and delete buttons when resume exists", () => {
    render(<ResumeSection user={userWithResume} isOwner={true} />);
    expect(screen.getByText("my_resume.pdf")).toBeInTheDocument();
    expect(screen.getByTitle("View")).toBeInTheDocument();
    expect(screen.getByTitle("Delete")).toBeInTheDocument();
  });

  it("does not show edit/delete if not owner", () => {
    render(<ResumeSection user={userWithResume} isOwner={false} />);
    expect(screen.queryByTitle("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("✎")).not.toBeInTheDocument();
  });

  it("handles invalid file type and size", async () => {
    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["bad"], "bad.exe", {
      type: "application/x-msdownload",
    });

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("uploads resume and updates UI", async () => {
    axios.post.mockResolvedValueOnce({
      data: { url: "https://example.com/resume.pdf" },
    });
    axios.patch.mockResolvedValueOnce({ status: 200 });

    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.patch).toHaveBeenCalledWith("/profile", {
        resume: "https://example.com/resume.pdf",
      });
    });
  });

  it("opens and confirms delete modal", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });
    render(<ResumeSection user={userWithResume} isOwner={true} />);
    fireEvent.click(screen.getByTitle("Delete"));

    const modal = await screen.findByTestId("confirm-modal");
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/profile/resume");
    });
  });

  it("shows error if file size exceeds 10MB", async () => {
    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');

    const largeFile = new File(["a".repeat(11 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(screen.getByText("Upload Resume")).toBeInTheDocument();
    });
  });

  it("throws error if upload returns invalid URL", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');

    const file = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.patch).not.toHaveBeenCalled();
    });
  });

  it("catches and shows error on upload failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("upload failed"));

    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');

    const file = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("catches and shows error on delete failure", async () => {
    axios.delete.mockRejectedValueOnce(new Error("delete failed"));

    render(<ResumeSection user={userWithResume} isOwner={true} />);
    fireEvent.click(screen.getByTitle("Delete"));

    const modal = await screen.findByTestId("confirm-modal");
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/profile/resume");
    });
  });
  it("skips upload if no file is selected", async () => {
    const { container } = render(
      <ResumeSection user={userWithoutResume} isOwner={true} />
    );
    const fileInput = container.querySelector('input[type="file"]');

    // Simulate change event with no files
    fireEvent.change(fileInput, { target: { files: [] } });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(axios.patch).not.toHaveBeenCalled();
    });
  });

  it("cancels delete modal", async () => {
    render(<ResumeSection user={userWithResume} isOwner={true} />);
    fireEvent.click(screen.getByTitle("Delete"));

    const modal = await screen.findByTestId("confirm-modal");
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).toBeNull();
    });
  });
});

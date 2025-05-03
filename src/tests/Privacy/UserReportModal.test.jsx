// src/tests/Privacy/ReportModal.test.jsx
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportModal from "../../pages/Privacy/UserReportModal";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../apis/axios", () => ({
  axiosInstance: { post: vi.fn(() => Promise.resolve()) },
}));

const onClose = vi.fn();
const onSubmitComplete = vi.fn();

describe("ReportModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ReportModal isOpen={false} onClose={onClose} targetId="user123" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders correctly with predefined reasons", () => {
    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    expect(screen.getByText("Report this profile")).toBeInTheDocument();
    expect(screen.getByText("Select a reason:")).toBeInTheDocument();
    expect(screen.getByText("Something else...")).toBeInTheDocument();
  });

  it("switches to custom reason mode", () => {
    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    fireEvent.click(screen.getByText("Something else..."));
    expect(
      screen.getByPlaceholderText(/describe the issue/i)
    ).toBeInTheDocument();
  });

  it("switches back to predefined reasons", () => {
    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.click(screen.getByText(/← Go back/i));
    expect(screen.getByText("Select a reason:")).toBeInTheDocument();
  });

  it("does not call API or toast if no reason is selected", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled(); // button is disabled
    });
  });

  it("submits with predefined reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(
      <ReportModal
        isOpen={true}
        onClose={onClose}
        targetId="user123"
        onSubmitComplete={onSubmitComplete}
      />
    );
    fireEvent.click(
      screen.getByLabelText("This person is impersonating someone")
    );
    fireEvent.click(screen.getByText("Submit report"));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("submits with custom reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(
      <ReportModal
        isOpen={true}
        onClose={onClose}
        targetId="user123"
        onSubmitComplete={onSubmitComplete}
      />
    );
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "Custom report reason" },
    });
    fireEvent.click(screen.getByText("Submit report"));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/security/report",
        expect.objectContaining({ reason: "Custom report reason" })
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("does not call API or toast if custom reason is only whitespace", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "    " },
    });
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled(); // submission blocked by disabled button
    });
  });

  it("handles API error", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    axiosInstance.post.mockRejectedValueOnce({ message: "fail" });

    render(<ReportModal isOpen={true} onClose={onClose} targetId="user123" />);
    fireEvent.click(screen.getByLabelText("This account is fake"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to submit report. Please try again."
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostReportModal from "../../pages/Privacy/PostReportModal";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));
vi.mock("../../apis/axios", () => ({
  axiosInstance: { post: vi.fn(() => Promise.resolve()) },
}));

const onClose = vi.fn();

describe("PostReportModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and toggles reason input", () => {
    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );
    expect(screen.getByText("Report this post")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Something else..."));
    expect(
      screen.getByPlaceholderText(/describe the issue/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("← Go back to predefined reasons"));
    expect(screen.getByText("Select a reason:")).toBeInTheDocument();
  });
  it("logs fallback error message if err.response is undefined", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    axiosInstance.post.mockRejectedValueOnce({
      message: "Network down",
    });

    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );

    fireEvent.click(screen.getByText("Spam"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        " Report Failed:",
        "Network down"
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to submit report. Please try again."
      );
    });

    consoleSpy.mockRestore();
  });

  it("submits with predefined reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );
    fireEvent.click(screen.getByText("Spam"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/security/report",
        expect.objectContaining({ reason: "Spam" })
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("handles API failure gracefully", async () => {
    const { axiosInstance } = await import("../../apis/axios");

    // Force axios.post to reject
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Server error" },
    });

    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );

    fireEvent.click(screen.getByText("Spam"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to submit report. Please try again."
      );
    });
  });
  it("handles API failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { axiosInstance } = await import("../../apis/axios");

    axiosInstance.post.mockRejectedValueOnce({
      response: { data: "Server error" },
    });

    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );

    fireEvent.click(screen.getByText("Spam"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        " Report Failed:",
        "Server error"
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to submit report. Please try again."
      );
    });

    consoleSpy.mockRestore();
  });

  it("switches to custom reason input when 'Something else...' is clicked", () => {
    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );
    fireEvent.click(screen.getByText("Something else..."));

    // This ensures setIsOtherReason(true) and setSelectedReason("") are hit
    expect(
      screen.getByPlaceholderText(/describe the issue/i)
    ).toBeInTheDocument();
  });
  it("disables submission when custom reason is only whitespace", () => {
    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );
    fireEvent.click(screen.getByText("Something else..."));

    const textarea = screen.getByPlaceholderText(/describe the issue/i);
    fireEvent.change(textarea, { target: { value: "    " } }); // whitespace

    const submitButton = screen.getByText("Submit report");
    expect(submitButton).toBeDisabled();
  });
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <PostReportModal isOpen={false} onClose={onClose} targetId="post123" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("submits with custom reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(
      <PostReportModal isOpen={true} onClose={onClose} targetId="post123" />
    );
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "custom reason" },
    });
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/security/report",
        expect.objectContaining({ reason: "custom reason" })
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

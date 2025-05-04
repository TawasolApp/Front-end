import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportJobModal from "../../pages/Privacy/ReportJobModal";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(() => Promise.resolve()),
  },
}));

const onClose = vi.fn();
const onSubmitComplete = vi.fn();

describe("ReportJobModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ReportJobModal isOpen={false} onClose={onClose} jobId="job1" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders and allows selecting a predefined reason", () => {
    render(<ReportJobModal isOpen={true} onClose={onClose} jobId="job1" />);
    expect(screen.getByText("Report this job")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Scam or fraud"));
    expect(screen.getByDisplayValue("Scam or fraud")).toBeChecked();
  });

  it("switches to custom reason input", () => {
    render(<ReportJobModal isOpen={true} onClose={onClose} jobId="job1" />);
    fireEvent.click(screen.getByText("Something else..."));
    expect(
      screen.getByPlaceholderText(/describe the issue/i)
    ).toBeInTheDocument();
  });

  it("disables submit for empty custom reason", () => {
    render(<ReportJobModal isOpen={true} onClose={onClose} jobId="job1" />);
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "   " },
    });
    const submitButton = screen.getByText("Submit report");
    expect(submitButton).toBeDisabled();
  });

  it("submits with predefined reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(
      <ReportJobModal
        isOpen={true}
        onClose={onClose}
        jobId="job1"
        onSubmitComplete={onSubmitComplete}
      />
    );
    fireEvent.click(screen.getByLabelText("Company misrepresentation"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/security/report/job/job1",
        {
          reason: "Company misrepresentation",
        }
      );
      expect(toast.success).toHaveBeenCalledWith("Job reported successfully.");
      expect(onSubmitComplete).toHaveBeenCalled();
    });
  });

  it("submits with custom reason", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    render(<ReportJobModal isOpen={true} onClose={onClose} jobId="job1" />);
    fireEvent.click(screen.getByText("Something else..."));
    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: "This job is fake." },
    });
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/security/report/job/job1",
        {
          reason: "This job is fake.",
        }
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("handles API failure gracefully", async () => {
    const { axiosInstance } = await import("../../apis/axios");
    axiosInstance.post.mockRejectedValueOnce({ message: "Network error" });

    render(<ReportJobModal isOpen={true} onClose={onClose} jobId="job1" />);
    fireEvent.click(screen.getByLabelText("Scam or fraud"));
    fireEvent.click(screen.getByText("Submit report"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to report job. Please try again."
      );
    });
  });
});

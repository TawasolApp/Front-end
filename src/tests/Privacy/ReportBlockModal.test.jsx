import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportBlockModal from "../../../src/pages/Privacy/ReportBlockModal";
import { toast } from "react-toastify";
import { axiosInstance as axios } from "../../../src/apis/axios";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../../src/apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("../../../src/pages/Privacy/UserReportModal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="report-user-modal">
        <button onClick={onClose}>Close Report Modal</button>
      </div>
    ) : null,
}));

vi.mock(
  "../../../src/pages/UserProfile/Components/ReusableModals/ConfirmModal",
  () => ({
    __esModule: true,
    default: ({ onConfirm, onCancel }) => (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm}>Confirm Block</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ),
  })
);

describe("ReportBlockModal", () => {
  const onClose = vi.fn();
  const onBlocked = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ReportBlockModal
        isOpen={false}
        onClose={onClose}
        fullName="John Doe"
        userId="user123"
        viewerId="viewer123"
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders main modal and toggles to block confirm modal", () => {
    render(
      <ReportBlockModal
        isOpen={true}
        onClose={onClose}
        fullName="John Doe"
        userId="user123"
        viewerId="viewer123"
      />
    );

    expect(screen.getByText("Report or block")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Block John Doe"));
    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
  });

  it("renders report modal from main modal", () => {
    render(
      <ReportBlockModal
        isOpen={true}
        onClose={onClose}
        fullName="John Doe"
        userId="user123"
        viewerId="viewer123"
      />
    );

    fireEvent.click(screen.getByText("Report John Doe or entire account"));
    expect(screen.getByTestId("report-user-modal")).toBeInTheDocument();
  });

  it("calls axios and toast on successful block", async () => {
    render(
      <ReportBlockModal
        isOpen={true}
        onClose={onClose}
        fullName="John Doe"
        userId="user123"
        viewerId="viewer123"
        onBlocked={onBlocked}
      />
    );

    fireEvent.click(screen.getByText("Block John Doe"));
    fireEvent.click(screen.getByText("Confirm Block"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/security/block/user123");
      expect(toast.success).toHaveBeenCalledWith(
        "John Doe has been blocked successfully."
      );
      expect(onBlocked).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles block failure and shows error toast", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 500, data: "Server error" },
      message: "Internal Server Error",
    });

    render(
      <ReportBlockModal
        isOpen={true}
        onClose={onClose}
        fullName="John Doe"
        userId="user123"
        viewerId="viewer123"
      />
    );

    fireEvent.click(screen.getByText("Block John Doe"));
    fireEvent.click(screen.getByText("Confirm Block"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to block user.");
    });
  });
});

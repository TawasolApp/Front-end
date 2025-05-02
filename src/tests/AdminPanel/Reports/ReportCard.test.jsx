import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ReportCard from "../../../pages/AdminPanel/Reports/ReportCard";
import { axiosInstance as axios } from "../../../apis/axios";

//  Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
    get: vi.fn(),
  },
}));

describe("ReportCard", () => {
  const baseReport = {
    id: "r1",
    postAuthor: "Alice",
    postAuthorAvatar: "/alice.jpg",
    postAuthorRole: "Software Engineer",
    postAuthorType: "User",
    postContent: "This is a reported post",
    postMedia: "/image.png",
    reportedAt: "2024-05-01T14:00:00Z",
    reporterAvatar: "/bob.jpg",
    reportedBy: "Bob",
    reason: "Offensive content",
    status: "Pending",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders report content, author, and metadata", () => {
    render(<ReportCard report={baseReport} onResolve={vi.fn()} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("This is a reported post")).toBeInTheDocument();
    expect(screen.getByAltText("Author")).toHaveAttribute("src", "/alice.jpg");
    expect(screen.getByAltText("Reporter")).toHaveAttribute("src", "/bob.jpg");
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Offensive content")).toBeInTheDocument();
    expect(screen.getByText("Delete Post")).toBeInTheDocument();
    expect(screen.getByText("Ignore")).toBeInTheDocument();
    expect(screen.getByText("Suspend User")).toBeInTheDocument();
  });

  test("does not render action buttons if status is not 'Pending'", () => {
    const resolvedReport = { ...baseReport, status: "Resolved" };
    render(<ReportCard report={resolvedReport} onResolve={vi.fn()} />);
    expect(screen.queryByText("Delete Post")).not.toBeInTheDocument();
    expect(screen.queryByText("Ignore")).not.toBeInTheDocument();
    expect(screen.queryByText("Suspend User")).not.toBeInTheDocument();
  });

  test("hides suspend button if postAuthorType is 'Company'", () => {
    const companyReport = { ...baseReport, postAuthorType: "Company" };
    render(<ReportCard report={companyReport} onResolve={vi.fn()} />);
    expect(screen.queryByText("Suspend User")).not.toBeInTheDocument();
  });

  test("calls onResolve after resolving report (delete_post)", async () => {
    const mockUpdated = { ...baseReport, status: "Resolved" };
    const mockOnResolve = vi.fn();

    axios.patch.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [mockUpdated] });

    render(<ReportCard report={baseReport} onResolve={mockOnResolve} />);

    fireEvent.click(screen.getByText("Delete Post"));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith("/admin/reports/r1/resolve", {
        action: "delete_post",
        comment: "",
      });
      expect(mockOnResolve).toHaveBeenCalledWith(mockUpdated);
    });
  });

  test("disables buttons during loading", async () => {
    let resolvePatch;
    axios.patch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePatch = resolve;
        })
    );
    axios.get.mockResolvedValueOnce({ data: [baseReport] });

    render(<ReportCard report={baseReport} onResolve={vi.fn()} />);

    fireEvent.click(screen.getByText("Ignore"));
    expect(screen.getByText("Ignoring...")).toBeDisabled();

    // Resolve manually
    resolvePatch({});
  });
});

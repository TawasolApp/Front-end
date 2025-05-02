import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Reports from "../../../pages/AdminPanel/Reports/Reports";
import { axiosInstance as axios } from "../../../apis/axios";

//  Mock child components
vi.mock("../../../pages/AdminPanel/Reports/ReportCard", () => ({
  __esModule: true,
  default: ({ report, onResolve }) => (
    <div data-testid="report-card">
      <p>{report.postContent}</p>
      <button onClick={() => onResolve({ ...report, status: "Resolved" })}>
        Resolve
      </button>
    </div>
  ),
}));

vi.mock("../../../pages/AdminPanel/Reports/ReportFilters", () => ({
  __esModule: true,
  default: ({ current, onChange }) => (
    <select
      data-testid="filter-select"
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      <option>All</option>
      <option>Pending</option>
      <option>Resolved</option>
    </select>
  ),
}));

vi.mock("../../../pages/AdminPanel/Reports/ReportStats", () => ({
  __esModule: true,
  default: () => <div data-testid="report-stats">Report Stats</div>,
}));

vi.mock("../../../pages/LoadingScreen/LoadingPage", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading...</div>,
}));

//  Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe("Reports", () => {
  const mockReports = [
    { id: "1", status: "Pending", postContent: "Offensive content A" },
    { id: "2", status: "Resolved", postContent: "Spam B" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays loading state initially", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReports });
    render(<Reports />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument()
    );
  });

  test("renders all reports after loading", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReports });
    render(<Reports />);

    await waitFor(() => {
      expect(screen.getAllByTestId("report-card")).toHaveLength(2);
      expect(screen.getByText("Offensive content A")).toBeInTheDocument();
      expect(screen.getByText("Spam B")).toBeInTheDocument();
      expect(screen.getByTestId("report-stats")).toBeInTheDocument();
    });
  });

  test("filters reports by status", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReports });
    render(<Reports />);

    await waitFor(() => {
      expect(screen.getAllByTestId("report-card")).toHaveLength(2);
    });

    const filter = screen.getByTestId("filter-select");
    fireEvent.change(filter, { target: { value: "Pending" } });

    await waitFor(() => {
      expect(screen.getAllByTestId("report-card")).toHaveLength(1);
      expect(screen.getByText("Offensive content A")).toBeInTheDocument();
    });
  });

  test("updates report status using onResolve", async () => {
    axios.get.mockResolvedValueOnce({ data: mockReports });
    render(<Reports />);

    await waitFor(() => {
      expect(screen.getByText("Offensive content A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Resolve")[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId("report-card")).toHaveLength(2);
      expect(screen.queryByText("Offensive content A")).toBeInTheDocument(); // Still present, but status is now resolved
    });
  });

  test("handles API fetch failure gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));
    render(<Reports />);

    await waitFor(() =>
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument()
    );

    expect(screen.getByText("Showing 0 of 0 reports")).toBeInTheDocument();
  });
});

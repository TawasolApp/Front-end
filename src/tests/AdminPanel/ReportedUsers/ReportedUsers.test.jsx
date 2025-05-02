import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ReportedUsers from "../../../pages/AdminPanel/ReportedUsers/ReportedUsers";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("ReportedUsers component", () => {
  const mockReports = [
    {
      id: "r1",
      reportedUser: "John Doe",
      reportedUserRole: "User",
      reportedUserAvatar: "/john.png",
      reportedBy: "Jane",
      reporterAvatar: "/jane.png",
      reason: "Harassment",
      reportedAt: "2025-04-30T12:00:00Z",
      status: "Pending",
    },
    {
      id: "r2",
      reportedUser: "Alice Smith",
      reportedUserRole: "Admin",
      reportedUserAvatar: "/alice.png",
      reportedBy: "Bob",
      reporterAvatar: "/bob.png",
      reason: "Spam",
      reportedAt: "2025-04-29T09:30:00Z",
      status: "Dismissed",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockReports });
    axios.patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    render(<ReportedUsers />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  test("renders reports after fetching", async () => {
    render(<ReportedUsers />);
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });
  });

  test("filters reports based on selected status", async () => {
    render(<ReportedUsers />);
    await screen.findByText("John Doe");

    fireEvent.click(screen.getByRole("button", { name: "Pending" }));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
  });

  test("calls API when ignoring a report", async () => {
    render(<ReportedUsers />);
    await screen.findByText("John Doe");

    const ignoreButton = screen.getByText("Ignore");
    fireEvent.click(ignoreButton);

    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith(
        "/admin/reports/r1/resolve",
        expect.objectContaining({ action: "ignore" })
      )
    );
  });

  test("calls API when suspending a user", async () => {
    render(<ReportedUsers />);
    await screen.findByText("John Doe");

    const suspendButton = screen.getByText("Suspend User");
    fireEvent.click(suspendButton);

    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith(
        "/admin/reports/r1/resolve",
        expect.objectContaining({ action: "suspend_user" })
      )
    );
  });
});

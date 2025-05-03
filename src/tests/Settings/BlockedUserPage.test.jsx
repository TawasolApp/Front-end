// src/tests/Privacy/BlockedUsersPage.test.jsx
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BlockedUsersPage from "../../pages/Settings/BlockedUsersPage";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockAxios = await import("../../apis/axios");

const renderWithRouter = (ui) => <BrowserRouter>{ui}</BrowserRouter>;

describe("BlockedUsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockAxios.axiosInstance.get.mockReturnValueOnce(new Promise(() => {}));
    render(renderWithRouter(<BlockedUsersPage />));
    expect(await screen.findByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders empty state when no blocked users", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({ data: [] });
    render(renderWithRouter(<BlockedUsersPage />));
    await waitFor(() =>
      expect(
        screen.getByText(/You’re currently not blocking anyone/i)
      ).toBeInTheDocument()
    );
  });

  it("renders blocked users", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "u1",
          firstName: "Alice",
          lastName: "Johnson",
        },
      ],
    });
    render(renderWithRouter(<BlockedUsersPage />));
    expect(
      await screen.findByText("You’re currently blocking 1 person.")
    ).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByTestId("unblock-button-u1")).toBeInTheDocument();
  });

  it("unblocks a user after confirmation", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "u1",
          firstName: "Alice",
          lastName: "Johnson",
        },
      ],
    });

    mockAxios.axiosInstance.post.mockResolvedValueOnce({});

    render(renderWithRouter(<BlockedUsersPage />));

    await screen.findByText("Alice Johnson");

    // Click the unblock button from the list
    fireEvent.click(screen.getByTestId("unblock-button-u1"));

    // Confirm modal appears
    await screen.findByText("Unblock member?");
    fireEvent.click(screen.getByTestId("confirm-modal"));

    await waitFor(() => {
      expect(mockAxios.axiosInstance.post).toHaveBeenCalledWith(
        "/security/unblock/u1"
      );
      expect(toast.success).toHaveBeenCalledWith(
        "User unblocked successfully."
      );
    });
  });
  it("logs error to console if fetching blocked users fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockAxios.axiosInstance.get.mockRejectedValueOnce(
      new Error("Network error")
    );

    render(renderWithRouter(<BlockedUsersPage />));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch blocked users:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
  it("shows 'person' when blocking one user", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "u1",
          firstName: "Alice",
          lastName: "Johnson",
        },
      ],
    });

    render(renderWithRouter(<BlockedUsersPage />));
    expect(
      await screen.findByText("You’re currently blocking 1 person.")
    ).toBeInTheDocument();
  });
  it("shows 'people' when blocking multiple users", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        { userId: "u1", firstName: "Alice", lastName: "Johnson" },
        { userId: "u2", firstName: "Bob", lastName: "Smith" },
      ],
    });

    render(renderWithRouter(<BlockedUsersPage />));
    expect(
      await screen.findByText("You’re currently blocking 2 people.")
    ).toBeInTheDocument();
  });

  it("resets modal state on cancel (setShowConfirm and setSelectedUserId)", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "u1",
          firstName: "Alice",
          lastName: "Johnson",
        },
      ],
    });

    render(renderWithRouter(<BlockedUsersPage />));

    // Wait for user to load
    await screen.findByText("Alice Johnson");

    // Open the confirmation modal
    fireEvent.click(screen.getByTestId("unblock-button-u1"));

    // Ensure modal is shown
    expect(await screen.findByText("Unblock member?")).toBeInTheDocument();

    // Click cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Confirm modal has closed and user deselected
    await waitFor(() => {
      expect(screen.queryByText("Unblock member?")).not.toBeInTheDocument();
    });
  });

  it("shows error if unblock fails", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "u1",
          firstName: "Alice",
          lastName: "Johnson",
        },
      ],
    });

    mockAxios.axiosInstance.post.mockRejectedValueOnce({
      message: "Unblock failed",
    });

    render(renderWithRouter(<BlockedUsersPage />));

    await screen.findByText("Alice Johnson");
    fireEvent.click(screen.getByTestId("unblock-button-u1"));
    await screen.findByText("Unblock member?");
    fireEvent.click(screen.getByTestId("confirm-modal"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to unblock user.");
    });
  });
});

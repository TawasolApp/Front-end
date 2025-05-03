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
    expect(await screen.findByText(/loading/i)).toBeTruthy(); // based on your LoadingPage
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
    expect(screen.getByText("Unblock")).toBeInTheDocument();
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

    // Wait for user to appear
    await screen.findByText("Alice Johnson");

    // Click unblock and confirm
    fireEvent.click(screen.getByText("Unblock"));
    await screen.findByText("Unblock member?");
    fireEvent.click(screen.getByText("Unblock"));

    await waitFor(() => {
      expect(mockAxios.axiosInstance.post).toHaveBeenCalledWith(
        "/security/unblock/u1"
      );
      expect(toast.success).toHaveBeenCalledWith(
        "User unblocked successfully."
      );
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
    fireEvent.click(screen.getByText("Unblock"));
    await screen.findByText("Unblock member?");
    fireEvent.click(screen.getByText("Unblock"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to unblock user.");
    });
  });
});

// src/tests/Settings/ProfileVisibilityPage.test.jsx
import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProfileVisibilityPage from "../../pages/Settings/ProfileVisibilityPage";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockAxios = await import("../../apis/axios");

const renderWithRouter = (ui) => <BrowserRouter>{ui}</BrowserRouter>;

describe("ProfileVisibilityPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", async () => {
    mockAxios.axiosInstance.get.mockReturnValueOnce(new Promise(() => {}));
    render(renderWithRouter(<ProfileVisibilityPage />));
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders visibility options and current selection", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: { visibility: "connections_only" },
    });
    render(renderWithRouter(<ProfileVisibilityPage />));

    await waitFor(() =>
      expect(screen.getByLabelText(/connections only/i)).toBeChecked()
    );
  });
  it("logs error to console if visibility fetch fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockAxios.axiosInstance.get.mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(renderWithRouter(<ProfileVisibilityPage />));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch visibility:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("enables Save button when a new option is selected", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: { visibility: "connections_only" },
    });

    render(renderWithRouter(<ProfileVisibilityPage />));
    await screen.findByLabelText(/connections only/i);

    fireEvent.click(screen.getByLabelText(/public/i));
    expect(
      screen.getByRole("button", { name: /save profile visibility settings/i })
    ).toBeEnabled();
  });

  it("successfully saves visibility and shows toast", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: { visibility: "private" },
    });
    mockAxios.axiosInstance.patch.mockResolvedValueOnce({});

    render(renderWithRouter(<ProfileVisibilityPage />));
    await screen.findByLabelText(/private/i);

    fireEvent.click(screen.getByLabelText(/public/i));
    fireEvent.click(
      screen.getByRole("button", { name: /save profile visibility settings/i })
    );

    await waitFor(() => {
      expect(mockAxios.axiosInstance.patch).toHaveBeenCalledWith("/profile", {
        visibility: "public",
      });
      expect(toast.success).toHaveBeenCalledWith(
        " Profile visibility updated successfully!"
      );
    });
  });

  it("shows error toast if save fails", async () => {
    mockAxios.axiosInstance.get.mockResolvedValueOnce({
      data: { visibility: "public" },
    });
    mockAxios.axiosInstance.patch.mockRejectedValueOnce({
      message: "Update failed",
    });

    render(renderWithRouter(<ProfileVisibilityPage />));
    await screen.findByLabelText(/public/i);

    fireEvent.click(screen.getByLabelText(/private/i));
    fireEvent.click(
      screen.getByRole("button", { name: /save profile visibility settings/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        " Failed to update profile visibility."
      );
    });
  });
});

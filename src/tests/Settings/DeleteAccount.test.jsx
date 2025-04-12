import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import DeleteAccount from "../../pages/Settings/DeleteAccount";
import { axiosInstance } from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    delete: vi.fn(),
  },
}));

vi.mock("@mui/icons-material/ArrowBack", () => ({
  default: () => <div data-testid="mock-arrow-back" />,
}));

describe("DeleteAccount Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockReturnValue({ firstName: "John" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("navigates back when back button is clicked", () => {
    render(<DeleteAccount />);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("submits the form and navigates to sign in page on successful account deletion", async () => {
    axiosInstance.delete.mockResolvedValueOnce({});

    render(<DeleteAccount />);

    const continueButton = screen.getByText("Continue");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith(
        "/users/delete-account",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/auth/signin");
    });
  });

  it("handles errors during account deletion", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axiosInstance.delete.mockRejectedValueOnce(
      new Error("Delete account failed"),
    );

    render(<DeleteAccount />);

    const continueButton = screen.getByText("Continue");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith(
        "/users/delete-account",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting account:",
        expect.any(Error),
      );
      expect(mockNavigate).not.toHaveBeenCalledWith("/auth/signin");
    });

    consoleErrorSpy.mockRestore();
  });
});

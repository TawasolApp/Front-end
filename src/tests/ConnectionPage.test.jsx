import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import Connections from "../pages/MyNetwork/Connections/ConnectionPage";
import { axiosInstance } from "../apis/axios";

vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    delete: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

describe("Connections Page", () => {
  const mockConnections = [
    { userId: "1", username: "Alice Johnson", createdAt: "2024-01-01" },
    { userId: "2", username: "Zane Adams", createdAt: "2024-02-01" },
    { userId: "3", username: "Bob Smith", createdAt: "2024-03-01" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.get.mockResolvedValue({ data: [] });
  });

  it("should display connection count of 0 on mount", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockConnections });
    render(<Connections />);

    await waitFor(() => {
      expect(screen.getByText("0 Connections")).toBeTruthy();
    });
  });

  describe("Sorting functionality", () => {
    beforeEach(async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockConnections });
      render(<Connections />);
      await screen.findByText("0 Connections");
    });

    it("should show sort controls", () => {
      expect(screen.getByLabelText("Sort by:")).toBeTruthy();
      expect(screen.getByLabelText("Direction:")).toBeTruthy();
    });

    it("should change sort option", async () => {
      fireEvent.change(screen.getByLabelText("Sort by:"), { 
        target: { value: "firstName" } 
      });
    });
  });

  describe("Search functionality", () => {
    beforeEach(async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockConnections });
      render(<Connections />);
      await screen.findByText("0 Connections");
    });

    it("should have search input", () => {
      expect(screen.getByPlaceholderText("Search by name")).toBeTruthy();
    });

    it("should update search input value", () => {
      const searchInput = screen.getByPlaceholderText("Search by name");
      fireEvent.change(searchInput, { target: { value: "Alice" } });
      expect(searchInput.value).toBe("alice");
    });
  });

  describe("Error handling", () => {
    it("should handle network error when fetching connections", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      axiosInstance.get.mockRejectedValueOnce(new Error("Network error"));
      
      render(<Connections />);

      await waitFor(() => {
        expect(screen.getByText("0 Connections")).toBeTruthy();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Empty state", () => {
    it("should display empty state when no connections are found", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });
      render(<Connections />);

      await waitFor(() => {
        expect(screen.getByText("0 Connections")).toBeTruthy();
      });
    });
  });
});



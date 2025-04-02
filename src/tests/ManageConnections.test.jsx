import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import ManageConnections from "../pages/mynetworkpage/ManageConnections";
import { axiosInstance } from "../apis/axios";
import { useNavigate } from "react-router-dom";

// Mock axios and react-router
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("ManageConnections", () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    axiosInstance.get.mockImplementation(() => Promise.resolve({ data: [] }));
    axiosInstance.patch.mockImplementation(() => Promise.resolve({ status: 200 }));
    axiosInstance.delete.mockImplementation(() => Promise.resolve({ status: 200 }));
  });

  it("should render loading state initially", () => {
    render(<ManageConnections />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display received invitations when tab is active", async () => {
    const mockPendingRequests = [
      {
        userId: "1",
        username: "user1",
        headline: "Developer",
        profilePicture: "url1",
      },
    ];

    axiosInstance.get.mockImplementationOnce(() => 
      Promise.resolve({ data: mockPendingRequests })
    );

    render(<ManageConnections />);

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Ignore")).toBeInTheDocument();
      expect(screen.getByText("Accept")).toBeInTheDocument();
    });
  });

  it("should display sent invitations when tab is clicked", async () => {
    const mockSentRequests = [
      {
        userId: "2",
        username: "user2",
        headline: "Designer",
        profilePicture: "url2",
      },
    ];

    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [] }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockSentRequests }));

    render(<ManageConnections />);

    const sentTab = screen.getByText("Sent (0)");
    fireEvent.click(sentTab);

    await waitFor(() => {
      expect(screen.getByText("user2")).toBeInTheDocument();
      expect(screen.getByText("Designer")).toBeInTheDocument();
      expect(screen.getByText("Withdraw")).toBeInTheDocument();
    });
  });

  it("should handle accept connection", async () => {
    const mockPendingRequests = [
      {
        userId: "1",
        username: "user1",
        headline: "Developer",
        profilePicture: "url1",
      },
    ];

    axiosInstance.get.mockImplementationOnce(() => 
      Promise.resolve({ data: mockPendingRequests })
    );

    render(<ManageConnections />);

    const acceptButton = await screen.findByText("Accept");
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/connections/1",
        { isAccept: true }
      );
    });
  });

  it("should handle ignore connection", async () => {
    const mockPendingRequests = [
      {
        userId: "1",
        username: "user1",
        headline: "Developer",
        profilePicture: "url1",
      },
    ];

    axiosInstance.get.mockImplementationOnce(() => 
      Promise.resolve({ data: mockPendingRequests })
    );

    render(<ManageConnections />);

    const ignoreButton = await screen.findByText("Ignore");
    fireEvent.click(ignoreButton);

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/connections/1",
        { isAccept: false }
      );
    });
  });

  it("should display error message when fetch fails", async () => {
    axiosInstance.get.mockImplementationOnce(() => 
      Promise.reject(new Error("Network error"))
    );

    render(<ManageConnections />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load received requests.")).toBeInTheDocument();
    });
  });

  it("should display empty state for no pending invitations", async () => {
    axiosInstance.get.mockImplementationOnce(() => 
      Promise.resolve({ data: [] })
    );

    render(<ManageConnections />);

    await waitFor(() => {
      expect(screen.getByText("No pending invitations")).toBeInTheDocument();
    });
  });

  it("should display empty state for no sent requests", async () => {
    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [] }))
      .mockImplementationOnce(() => Promise.resolve({ data: [] }));

    render(<ManageConnections />);

    const sentTab = screen.getByText("Sent (0)");
    fireEvent.click(sentTab);

    await waitFor(() => {
      expect(screen.getByText("No sent requests")).toBeInTheDocument();
    });
  });
});
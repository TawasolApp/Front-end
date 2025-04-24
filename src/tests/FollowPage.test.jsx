import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import FollowPage from "../pages/MyNetwork/FollowPage";
import { axiosInstance } from "../apis/axios";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock axios instance
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("FollowPage", () => {
  const mockUser = {
    userId: "1",
    firstName: "John",
    lastName: "Doe",
    headline: "Software Developer",
    profilePicture: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.get.mockImplementation(() => Promise.resolve({ data: [] }));
  });

  it("should render the component with default tab", () => {
    render(<FollowPage />);
    expect(screen.getByText("My Network")).toBeInTheDocument();
    expect(screen.getByText("Following").closest('button')).toHaveClass('border-b-2');
    expect(screen.getByText("Followers").closest('button')).not.toHaveClass('border-b-2');
  });

  it("should fetch and display following users on mount", async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: [mockUser] }),
    );

    render(<FollowPage />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Developer")).toBeInTheDocument();
  });

  it("should switch between following and followers tabs", async () => {
    const mockFollowers = [{ ...mockUser, firstName: "Jane" }];
    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [mockUser] }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowers }));

    render(<FollowPage />);
    
    // Switch to followers tab
    fireEvent.click(screen.getByText("Followers"));
    
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/connections/followers", {
        params: { page: 1, limit: 10 }
      });
      expect(screen.getByText("Followers").closest('button')).toHaveClass('border-b-2');
    });
  });

  it("should show loading spinner when loading initial data", async () => {
    axiosInstance.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<FollowPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should show loading spinner when loading more items", async () => {
    axiosInstance.get.mockImplementationOnce(() => 
      Promise.resolve({ data: Array(10).fill(mockUser) })
      .mockImplementationOnce(() => new Promise(() => {})))

    render(<FollowPage />);
    await screen.findByText("John Doe");
    
    // Trigger loading more
    axiosInstance.get.mockImplementationOnce(() => new Promise(() => {}));
    setPage({ following: 2, followers: 1 });
    
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should show error message and retry button when fetch fails", async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    render(<FollowPage />);
    expect(await screen.findByText(/Failed to load following list/i)).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("should show empty state when no following users", async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: [] }),
    );

    render(<FollowPage />);
    expect(await screen.findByText(/You're not following anyone yet/i)).toBeInTheDocument();
  });

  it("should show empty state when no followers", async () => {
    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [] }))
      .mockImplementationOnce(() => Promise.resolve({ data: [] }));

    render(<FollowPage />);
    fireEvent.click(screen.getByText("Followers"));
    expect(await screen.findByText(/You don't have any followers yet/i)).toBeInTheDocument();
  });

  it("should show unfollow modal when clicking Following button", async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: [mockUser] }),
    );

    render(<FollowPage />);
    const followingButton = await screen.findByText("Following");
    fireEvent.click(followingButton);

    expect(screen.getByText(/You are about to unfollow/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Unfollow")).toBeInTheDocument();
  });


  it("should navigate to user profile when clicking user name", async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: [mockUser] }),
    );

    render(<FollowPage />);
    const userName = await screen.getByText("John Doe");
    fireEvent.click(userName);

    expect(mockNavigate).toHaveBeenCalledWith("/users/1");
  });
});
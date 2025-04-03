// Update the mock implementation at the top
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import FollowPage from "../pages/mynetworkpage/FollowPage";
import { axiosInstance } from "../apis/axios";

// Mock axios instance with proper Promise-based functions
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

describe("FollowPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display following users on mount", async () => {
    const mockFollowing = [
      { userId: "1", username: "user1", headline: "Test headline 1" },
      { userId: "2", username: "user2", headline: "Test headline 2" },
    ];

    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockFollowing }),
    );

    render(<FollowPage />);
    expect(await screen.findByText("user1")).toBeTruthy();
    expect(await screen.findByText("user2")).toBeTruthy();
  });

  it("should switch between following and followers tabs", async () => {
    const mockFollowing = [{ userId: "1", username: "user1" }];
    const mockFollowers = [{ userId: "2", username: "user2" }];

    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowing }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowers }));

    render(<FollowPage />);
    const followersTab = screen.getByText("Followers");
    fireEvent.click(followersTab);

    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/followers");
  });

  it("should handle unfollow user flow", async () => {
    const mockFollowing = [
      { userId: "1", username: "user1", headline: "Test headline" },
    ];

    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockFollowing }),
    );

    axiosInstance.delete.mockImplementationOnce(async () =>
      Promise.resolve({ status: 200 }),
    );

    render(<FollowPage />);
    const FollowingButton = await screen.findByTestId("followingButton2");
    await fireEvent.click(FollowingButton);

    expect(screen.getByText("You are about to unfollow user1")).toBeTruthy();

    const unfollowButton = await screen.findByTestId("unfollow2");
    await fireEvent.click(unfollowButton);

    expect(axiosInstance.delete).toHaveBeenCalledWith(
      "/connections/unfollow/1",
    );
  });

  it("should handle network error when fetching users", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axiosInstance.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    render(<FollowPage />);
    expect(screen.getByText("You're not following anyone yet.")).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });
  // Add these tests to your FollowPage.test.jsx

  it('should display "You\'re not following anyone yet" when following list is empty', async () => {
    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: [] }),
    );

    render(<FollowPage />);
    expect(
      await screen.findByText("You're not following anyone yet."),
    ).toBeTruthy();
  });

  it('should display "You don\'t have any followers yet" when followers list is empty', async () => {
    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [] }))
      .mockImplementationOnce(() => Promise.resolve({ data: [] }));

    render(<FollowPage />);
    fireEvent.click(screen.getByText("Followers"));
    expect(
      await screen.findByText("You don't have any followers yet."),
    ).toBeTruthy();
  });

  it("should close unfollow modal when cancel button is clicked", async () => {
    const mockFollowing = [
      { userId: "1", username: "user1", headline: "Test headline" },
    ];

    axiosInstance.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockFollowing }),
    );

    render(<FollowPage />);
    const followingButton = await screen.findByTestId("followingButton2");
    fireEvent.click(followingButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("You are about to unfollow user1")).toBeNull();
  });

  it("should handle follow user action", async () => {
    const mockFollowers = [
      { userId: "1", username: "user1", headline: "Test headline" },
    ];

    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: [] })) // Initial following
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowers })); // Followers

    const mockResponse = {
      data: { userId: "1", username: "user1", headline: "Test headline" },
      status: 201,
    };

    axiosInstance.post.mockImplementationOnce(() =>
      Promise.resolve(mockResponse),
    );

    render(<FollowPage />);
    fireEvent.click(screen.getByText("Followers"));

    const followButton = await screen.findByText("Follow");
    fireEvent.click(followButton);

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/connections/follow",
      { userId: "1" },
      { headers: { "Content-Type": "application/json" } },
    );
  });

  it("should correctly identify if a user is being followed", async () => {
    const mockFollowing = [
      { userId: "1", username: "user1", headline: "Test headline" },
    ];
    const mockFollowers = [
      { userId: "1", username: "user1", headline: "Test headline" },
      { userId: "2", username: "user2", headline: "Test headline" },
    ];

    axiosInstance.get
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowing }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockFollowers }));

    render(<FollowPage />);
    fireEvent.click(screen.getByText("Followers"));

    // Wait for the followers to load
    await screen.findByText("user1");

    // User1 should show "Following" button
    expect(screen.findByText("Following")).toBeTruthy();
    // User2 should show "Follow" button
    expect(screen.findByText("Follow")).toBeTruthy();
  });
});

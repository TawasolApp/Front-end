import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewerView from "../../../pages/UserProfile/Components/HeaderComponents/ViewerView.jsx";
import { vi } from "vitest";
import React from "react";

// Mock axios
vi.mock("../../../apis/axios.js", () => ({
  axiosInstance: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import { axiosInstance as axios } from "../../../apis/axios.js";

const mockUser = {
  _id: "user123",
  firstName: "John",
  lastName: "Doe",
};

describe("ViewerView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all action buttons", () => {
    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />,
    );

    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    expect(screen.getByLabelText("Connect")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow user")).toBeInTheDocument();
  });

  it("sends follow request and updates button", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />,
    );

    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/connections/follow", {
        userId: "user123",
      }),
    );

    expect(screen.getByText("✓ Following")).toBeInTheDocument();
  });

  it("shows unfollow modal when already following", async () => {
    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />,
    );

    fireEvent.click(screen.getByText("✓ Following"));
    expect(await screen.findByText(/Unfollow John Doe/)).toBeInTheDocument();
  });

  it("confirms unfollow request", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />,
    );

    fireEvent.click(screen.getByText("✓ Following"));
    fireEvent.click(await screen.findByText("Unfollow"));

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(
        "/connections/unfollow/user123",
      ),
    );

    expect(screen.getByText("+ Follow")).toBeInTheDocument();
  });

  it("sends connection request", async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: {} });

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />,
    );

    fireEvent.click(screen.getByLabelText("Connect"));
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/connections", {
        userId: "user123",
      }),
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("disconnects and unfollows when clicking Connected", async () => {
    axios.delete.mockResolvedValue({}); // both delete calls

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />,
    );

    fireEvent.click(screen.getByText("Connected"));
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/connections/user123");
      expect(axios.delete).toHaveBeenCalledWith(
        "/connections/unfollow/user123",
      );
    });

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("+ Follow")).toBeInTheDocument();
  });

  it("shows accept modal for incoming request", () => {
    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />,
    );

    fireEvent.click(screen.getByText("Accept"));
    expect(
      screen.getByText(/Accept Connection Request from John Doe/),
    ).toBeInTheDocument();
  });

  it("accepts incoming connection request", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200, data: {} });

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />,
    );

    fireEvent.click(screen.getByText("Accept")); // open modal
    fireEvent.click(screen.getByTestId("confirm-modal")); // confirm button

    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith("/connections/user123", {
        isAccept: true,
      }),
    );

    expect(screen.getByText("Connected")).toBeInTheDocument();
  });
});

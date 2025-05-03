import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewerView from "../../../pages/UserProfile/Components/HeaderComponents/ViewerView.jsx";
import React from "react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../apis/axios.js", () => ({
  axiosInstance: {
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock("../../../Privacy/ReportBlockModal", () => ({
  default: () => <div data-testid="report-block-modal" />,
}));

vi.mock("../../../Messaging/New Message Modal/NewMessageModal", () => ({
  default: () => <div data-testid="message-modal" />,
}));

vi.mock("../ReusableModals/ConfirmModal", () => ({
  default: ({ onConfirm, onCancel, isOpen, title }) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <div>{title}</div>
        <button onClick={onConfirm}>Accept</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

import { axiosInstance as axios } from "../../../apis/axios.js";

describe("ViewerView - Actions", () => {
  const mockUser = {
    _id: "user123",
    firstName: "Alice",
    lastName: "Doe",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders message and connect buttons", () => {
    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="No Connection"
          initialFollowStatus="Not Following"
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    expect(screen.getByLabelText("Connect")).toBeInTheDocument();
  });

  it("sends follow request on follow", async () => {
    axios.post.mockResolvedValue({ data: {}, status: 201 });

    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="No Connection"
          initialFollowStatus="Not Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByText("Follow"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/connections/follow", {
        userId: mockUser._id,
      });
    });
  });

  it("opens unfollow confirm modal", async () => {
    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="Connection"
          initialFollowStatus="Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByText("Unfollow"));

    expect(await screen.findByTestId("confirm-modal")).toBeInTheDocument();
  });

  it("confirms unfollow and calls API", async () => {
    axios.delete.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="Connection"
          initialFollowStatus="Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByText("Unfollow"));
    fireEvent.click(await screen.findByTestId("confirm-modal")); // Fixed

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/unfollow/${mockUser._id}`
      );
    });
  });

  it("sends connect request", async () => {
    axios.post.mockResolvedValue({ status: 201, data: {} });

    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="No Connection"
          initialFollowStatus="Not Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Connect"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/connections", {
        userId: mockUser._id,
      });
    });
  });

  it("handles accept connection flow", async () => {
    axios.patch.mockResolvedValue({ status: 200 });
    axios.post.mockResolvedValue({ status: 201 });

    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="Request"
          initialFollowStatus="Not Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Accept"));
    fireEvent.click(await screen.findByTestId("confirm-modal")); // Fixed

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(`/connections/${mockUser._id}`, {
        isAccept: true,
      });
      expect(axios.post).toHaveBeenCalledWith("/connections/follow", {
        userId: mockUser._id,
      });
    });
  });
});

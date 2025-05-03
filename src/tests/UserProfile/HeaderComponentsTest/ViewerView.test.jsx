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

vi.mock("../../../Privacy/ReportBlockModal", () => ({
  default: () => <div data-testid="report-block-modal" />,
}));

vi.mock("../../../Messaging/New Message Modal/NewMessageModal", () => ({
  default: () => <div data-testid="message-modal" />,
}));
vi.mock("../ReusableModals/ConfirmModal", () => ({
  default: ({ onConfirm }) => (
    <button data-testid="confirm-modal" onClick={onConfirm}>
      Confirm
    </button>
  ),
}));

import { axiosInstance as axios } from "../../../apis/axios.js";

const mockUser = {
  _id: "user123",
  firstName: "John",
  lastName: "Doe",
};
import { MemoryRouter } from "react-router-dom";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("ViewerView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });
  afterAll(() => {
    delete global.alert;
  });

  it("renderWithRouters all action buttons", () => {
    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    expect(screen.getByLabelText("Connect")).toBeInTheDocument();
    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByLabelText("Follow user"));
  });

  it("sends follow request and updates button", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/connections/follow", {
        userId: "user123",
      })
    );

    expect(screen.getByLabelText("Unfollow user")).toBeInTheDocument();
  });

  it("shows unfollow modal when already following", async () => {
    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByLabelText("Unfollow user"));
    expect(await screen.findByText(/Unfollow John Doe/)).toBeInTheDocument();
  });

  it("confirms unfollow request", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("✓ Following"));
    fireEvent.click(await screen.findByText("Unfollow"));

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith("/connections/unfollow/user123")
    );

    expect(screen.getByText("+ Follow")).toBeInTheDocument();
  });

  it("sends connection request", async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: {} });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Connect"));
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/connections", {
        userId: "user123",
      })
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("disconnects and unfollows when clicking Connected", async () => {
    axios.delete.mockResolvedValue({}); // both delete calls

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("Connected"));
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/connections/user123");
      expect(axios.delete).toHaveBeenCalledWith(
        "/connections/unfollow/user123"
      );
    });

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("+ Follow")).toBeInTheDocument();
  });

  it("shows accept modal for incoming request", () => {
    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Accept"));
    expect(
      screen.getByText(/Accept Connection Request from John Doe/)
    ).toBeInTheDocument();
  });
  // it("logs successful follow response", async () => {
  //   const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  //   axios.post.mockResolvedValueOnce({ data: { message: "Followed" } });

  //   renderWithRouter(
  //     <ViewerView
  //       user={mockUser}
  //       viewerId="viewer123"
  //       initialConnectStatus="No Connection"
  //       initialFollowStatus="None"
  //     />
  //   );

  //   fireEvent.click(screen.getByText("More"));
  //   fireEvent.click(screen.getByText("Follow"));

  //   await waitFor(() =>
  //     expect(consoleLogSpy).toHaveBeenCalledWith("Followed successfully:", {
  //       message: "Followed",
  //     })
  //   );

  //   consoleLogSpy.mockRestore();
  // });
  it("logs follow error when request fails", async () => {
    const error = { response: { data: "Follow failed" } };
    axios.post.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("More"));
    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Follow error:", "Follow failed");
    });

    consoleSpy.mockRestore();
  });
  it("opens message modal on clicking 'Message'", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Send message"));
    expect(consoleSpy).toHaveBeenCalledWith("Message clicked");

    consoleSpy.mockRestore();
  });

  it("shows alert on duplicate connection request (409)", async () => {
    const alertMock = vi.fn();
    global.alert = alertMock;

    axios.post.mockRejectedValueOnce({
      response: { status: 409, data: "Connection exists" },
    });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Connect"));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        "Connection request already exists"
      )
    );
  });
  it("handles canceling a pending request", async () => {
    axios.delete.mockResolvedValueOnce({});

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Pending"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Pending"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/connections/user123/pending");
      expect(screen.getByText("Connect")).toBeInTheDocument();
    });
  });

  it("handles accept connection follow failure gracefully", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200 });
    axios.post.mockRejectedValueOnce({ message: "Follow failed" });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Accept"));
    fireEvent.click(screen.getByTestId("confirm-modal"));

    await waitFor(() => {
      expect(screen.getByText("Connected")).toBeInTheDocument();
    });
  });

  it("handles failed connection acceptance with 409", async () => {
    const alertMock = vi.fn();
    global.alert = alertMock;

    axios.patch.mockRejectedValueOnce({ response: { status: 409 } });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Accept"));
    fireEvent.click(screen.getByTestId("confirm-modal"));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith("Connection already exists")
    );
  });

  it("handles failed connection acceptance with generic error", async () => {
    const alertMock = vi.fn();
    global.alert = alertMock;

    axios.patch.mockRejectedValueOnce({ message: "Unexpected error" });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Accept"));
    fireEvent.click(screen.getByTestId("confirm-modal"));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith("Failed to accept connection")
    );
  });
  it("updates isFollowing to false when disconnecting", async () => {
    axios.delete.mockResolvedValue({});
    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("Connected"));

    await waitFor(() =>
      expect(screen.getByText("+ Follow")).toBeInTheDocument()
    );
  });
  it("logs error if unfollow after disconnect fails with non-404", async () => {
    axios.delete
      .mockResolvedValueOnce({}) // disconnect
      .mockRejectedValueOnce({ response: { status: 500, data: "Oops" } }); // unfollow error

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("Connected"));

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith("Unfollow error:", "Oops")
    );

    consoleSpy.mockRestore();
  });
  it("opens and cancels unfollow modal", async () => {
    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("Connected"));
    expect(await screen.findByText(/Unfollow John Doe/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() =>
      expect(screen.queryByText(/Unfollow John Doe/)).not.toBeInTheDocument()
    );
  });

  it("accepts incoming connection request", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200, data: {} });

    renderWithRouter(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Request"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByText("Accept")); // open modal
    fireEvent.click(screen.getByTestId("confirm-modal")); // confirm button

    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith("/connections/user123", {
        isAccept: true,
      })
    );

    expect(screen.getByText("Connected")).toBeInTheDocument();
  });
});

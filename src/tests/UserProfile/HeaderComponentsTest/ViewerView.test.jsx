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
      />
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
      />
    );

    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/connections/follow", {
        userId: "user123",
      })
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
      />
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

    render(
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

    render(
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
    render(
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
  it("logs successful follow response", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    axios.post.mockResolvedValueOnce({ data: { message: "Followed" } });

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() =>
      expect(consoleLogSpy).toHaveBeenCalledWith("Followed successfully:", {
        message: "Followed",
      })
    );

    consoleLogSpy.mockRestore();
  });
  it("logs follow error when request fails", async () => {
    const error = { response: { data: "Follow failed" } };
    axios.post.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="No Connection"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Follow user"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Follow error:", "Follow failed");
    });

    consoleSpy.mockRestore();
  });
  it("logs message click", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(
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

    render(
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

    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Pending"
        initialFollowStatus="None"
      />
    );

    fireEvent.click(screen.getByLabelText("Pending"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/connections/user123/pending");
      expect(screen.getByText("Connect")).toBeInTheDocument();
    });
  });

  it("handles accept connection follow failure gracefully", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200 });
    axios.post.mockRejectedValueOnce({ message: "Follow failed" });

    render(
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

    render(
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

    render(
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
    render(
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

    render(
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
    render(
      <ViewerView
        user={mockUser}
        viewerId="viewer123"
        initialConnectStatus="Connection"
        initialFollowStatus="Following"
      />
    );

    fireEvent.click(screen.getByText("✓ Following"));
    expect(await screen.findByText(/Unfollow John Doe/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() =>
      expect(screen.queryByText(/Unfollow John Doe/)).not.toBeInTheDocument()
    );
  });

  it("accepts incoming connection request", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200, data: {} });

    render(
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

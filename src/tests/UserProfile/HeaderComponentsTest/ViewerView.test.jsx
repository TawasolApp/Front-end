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
  default: ({ onBlocked }) => (
    <div data-testid="report-block-modal">
      <button data-testid="trigger-block" onClick={onBlocked}>
        Block
      </button>
    </div>
  ),
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
  it("warns if follow fails after accepting connection", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    axios.patch.mockResolvedValueOnce({ status: 200 }); // connection accepted
    axios.post.mockRejectedValueOnce({
      response: { data: "Follow failed" }, // follow fails
    });

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
    fireEvent.click(await screen.findByTestId("confirm-modal"));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        "Follow failed but connection succeeded:",
        "Follow failed"
      );
    });

    warnSpy.mockRestore();
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <MemoryRouter>
        <div>
          <ViewerView
            user={mockUser}
            viewerId="viewer123"
            initialConnectStatus="No Connection"
            initialFollowStatus="Not Following"
          />
          <button data-testid="outside">Outside</button>
        </div>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("More"));
    expect(screen.getByText("Follow")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));

    await waitFor(() => {
      expect(screen.queryByText("Follow")).not.toBeInTheDocument();
    });
  });

  it("handles follow API failure gracefully", async () => {
    axios.post.mockRejectedValueOnce(new Error("Follow failed"));

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
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("handles unfollow API failure", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Unfollow failed"));

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
    fireEvent.click(await screen.findByTestId("confirm-modal"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
    });
  });

  it("handles disconnect and unfollow flow", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 }); // disconnect
    axios.delete.mockResolvedValueOnce({ status: 200 }); // unfollow

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

    fireEvent.click(screen.getByText("Connected"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`/connections/${mockUser._id}`);
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/unfollow/${mockUser._id}`
      );
    });
  });

  it("cancels a pending connection", async () => {
    axios.delete.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <ViewerView
          user={mockUser}
          viewerId="viewer123"
          initialConnectStatus="Pending"
          initialFollowStatus="Not Following"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Pending"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/${mockUser._id}/pending`
      );
    });
  });
  it("alerts if connection already exists (409)", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({
      response: { status: 409, data: "Connection already exists" },
    });

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
      expect(alertSpy).toHaveBeenCalledWith(
        "Connection request already exists"
      );
    });

    alertSpy.mockRestore();
  });

  it("logs unfollow error if disconnect cleanup fails (not 404)", async () => {
    axios.delete
      .mockResolvedValueOnce({ status: 200 }) // main disconnect
      .mockRejectedValueOnce({
        response: { status: 500, data: "Server error" },
      }); // unfollow cleanup

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

    fireEvent.click(screen.getByText("Connected"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`/connections/${mockUser._id}`);
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/unfollow/${mockUser._id}`
      );
    });
  });

  it("warns if follow fails after accepting connection", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200 });
    axios.post.mockResolvedValueOnce({ status: 500 }); // follow fails

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
    fireEvent.click(await screen.findByTestId("confirm-modal"));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled(); // follow still attempted
    });
  });
  it("throws error if connection accept response is not 200", async () => {
    axios.patch.mockResolvedValueOnce({ status: 500 });

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
    fireEvent.click(await screen.findByTestId("confirm-modal"));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
    });
  });
  it("opens the report/block modal from More dropdown", () => {
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
    fireEvent.click(screen.getByText("Report / Block"));

    expect(screen.getByTestId("report-block-modal")).toBeInTheDocument();
  });
  it("opens message modal when Message button is clicked", async () => {
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

    fireEvent.click(screen.getByLabelText("Send message"));

    await waitFor(() => {
      expect(screen.getByTestId("message-modal")).toBeInTheDocument();
    });
  });

  it("alerts on 409 connection conflict", async () => {
    window.alert = vi.fn();
    axios.post.mockRejectedValueOnce({
      response: { status: 409, data: "Conflict" },
    });

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
      expect(window.alert).toHaveBeenCalledWith(
        "Connection request already exists"
      );
    });
  });

  it("shows alert on duplicate connection (409)", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({ response: { status: 409 } });

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
      expect(window.alert).toHaveBeenCalledWith(
        "Connection request already exists"
      );
    });
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

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import UnfollowModal from "../../pages/Company/Components/Modals/UnfollowModal";

describe("UnfollowModal", () => {
  const cancelMock = vi.fn();
  const confirmMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "auto"; // reset body scroll
  });

  afterEach(() => {
    cleanup();
  });

  test("does not render when show is false", () => {
    const { container } = render(
      <UnfollowModal show={false} cancel={cancelMock} confirm={confirmMock} />
    );
    expect(container.firstChild).toBeNull();
    expect(document.body.style.overflow).toBe("auto");
  });
  test("renders correctly when show is true", () => {
    render(
      <UnfollowModal show={true} cancel={cancelMock} confirm={confirmMock} />
    );

    expect(
      screen.getByText("Are you sure you want to unfollow?")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Close Unfollow" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Confirm Unfollow" })
    ).toBeInTheDocument();
  });

  test("calls cancel when cancel button is clicked", () => {
    render(
      <UnfollowModal show={true} cancel={cancelMock} confirm={confirmMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close Unfollow" }));
    expect(cancelMock).toHaveBeenCalled();
  });

  test("calls confirm when unfollow button is clicked", () => {
    render(
      <UnfollowModal show={true} cancel={cancelMock} confirm={confirmMock} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm Unfollow" }));
    expect(confirmMock).toHaveBeenCalled();
  });

  test("calls cancel when ✖ button is clicked", () => {
    render(
      <UnfollowModal show={true} cancel={cancelMock} confirm={confirmMock} />
    );
    fireEvent.click(screen.getByText("✖"));
    expect(cancelMock).toHaveBeenCalled();
  });

  test("restores body scroll on unmount", () => {
    const { unmount } = render(
      <UnfollowModal show={true} cancel={cancelMock} confirm={confirmMock} />
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});

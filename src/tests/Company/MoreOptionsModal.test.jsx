import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import MoreOptionsModal from "../../pages/Company/Components/Modals/MoreOptionsModal";
import { waitFor } from "@testing-library/react";
describe("MoreOptionsModal", () => {
  const onCloseMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("does not render when 'show' is false", () => {
    const { container } = render(
      <MoreOptionsModal
        show={false}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders 'Share Page' and 'Create a Tawasol Page' options when 'show' is true", () => {
    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );

    expect(screen.getByTestId("send-message")).toBeInTheDocument();
    expect(screen.getByTestId("create-page")).toBeInTheDocument();
  });

  test("calls navigate and onClose when 'Create a Tawasol Page' is clicked", () => {
    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );

    fireEvent.click(screen.getByTestId("create-page"));

    expect(navigateMock).toHaveBeenCalledWith("/company/setup/new");
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("copies URL to clipboard and calls onClose when 'Share Page' is clicked", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValueOnce(),
      },
    });

    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );

    fireEvent.click(screen.getByTestId("send-message"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        window.location.href
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
  test("shows error if clipboard copy fails", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValueOnce(new Error("Copy failed")),
      },
    });

    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );

    fireEvent.click(screen.getByTestId("send-message"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});

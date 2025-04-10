import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import MoreOptionsModal from "../../pages/Company/Components/Modals/MoreOptionsModal";

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

  test("renders all options when 'show' is true", () => {
    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />
    );

    expect(screen.getByTestId("send-message")).toBeInTheDocument();
    expect(screen.getByTestId("report-abuse")).toBeInTheDocument();
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
});

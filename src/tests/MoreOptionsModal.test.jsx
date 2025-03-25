import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import MoreOptionsModal from "../pages/CompanyPage/Components/MoreOptionsModal";

describe("MoreOptionsModal", () => {
  const onCloseMock = vi.fn();
  const navigateMock = vi.fn();

  test("does not render when 'show' is false", () => {
    const { container } = render(
      <MoreOptionsModal
        show={false}
        onClose={onCloseMock}
        navigate={navigateMock}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders when 'show' is true", () => {
    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />,
    );
    expect(screen.getByText("Send in a message")).toBeInTheDocument();
    expect(screen.getByText("Report abuse")).toBeInTheDocument();
    expect(screen.getByText("Create a Tawasol Page")).toBeInTheDocument();
  });

  test("calls navigate and onClose when clicking 'Create a Tawasol Page'", () => {
    render(
      <MoreOptionsModal
        show={true}
        onClose={onCloseMock}
        navigate={navigateMock}
      />,
    );

    fireEvent.click(screen.getByText("Create a Tawasol Page"));

    expect(navigateMock).toHaveBeenCalledWith("/company/setup/new");
    expect(onCloseMock).toHaveBeenCalled();
  });
});

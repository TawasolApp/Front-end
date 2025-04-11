import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "../../../pages/UserProfile/Components/ReusableModals/ConfirmModal"; // Update path if needed

describe("ConfirmModal", () => {
  const setup = (props = {}) => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        {...props}
      />,
    );

    return { onConfirm, onCancel };
  };

  it("renders with given props", () => {
    setup();

    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const { onCancel } = setup();
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const { onConfirm } = setup();
    fireEvent.click(screen.getByTestId("confirm-modal"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when close icon is clicked", () => {
    const { onCancel } = setup();
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("renders with default title and button labels if not provided", () => {
    render(<ConfirmModal onCancel={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

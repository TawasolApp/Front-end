import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import AboutEditingModal from "../../../pages/UserProfile/Components/AboutComponents/AboutEditingModal";

describe("AboutEditingModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial bio", () => {
    render(
      <AboutEditingModal
        initialBio="This is my bio"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    expect(screen.getByText("Edit About")).toBeInTheDocument();
    expect(screen.getByDisplayValue("This is my bio")).toBeInTheDocument();
  });

  it("disables save button if no changes", () => {
    render(
      <AboutEditingModal
        initialBio="Same Bio"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();
  });

  it("enables save button if there are changes", () => {
    render(
      <AboutEditingModal
        initialBio="Old Bio"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "New Bio" },
    });
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
  });

  it("calls onSave with cleaned bio", () => {
    render(
      <AboutEditingModal
        initialBio="Old Bio"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  New Bio  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(mockOnSave).toHaveBeenCalledWith("New Bio");
  });

  it("calls onClose immediately if no unsaved changes", () => {
    render(
      <AboutEditingModal
        initialBio="Test Bio"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows confirm modal if unsaved changes exist", () => {
    render(
      <AboutEditingModal
        initialBio="Original"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Changed" },
    });
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(screen.getByText(/Discard changes/i)).toBeInTheDocument();
  });
});

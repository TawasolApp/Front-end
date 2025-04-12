import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import VisibilityModal from "../../../pages/UserProfile/Components/HeaderComponents/VisibilityModal";

describe("VisibilityModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    document.body.classList.remove("overflow-hidden");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    document.body.classList.remove("overflow-hidden");
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <VisibilityModal
        isOpen={false}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders correctly when isOpen is true", () => {
    render(
      <VisibilityModal
        isOpen={true}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText("Edit Profile Visibility")).toBeInTheDocument();
    const radio = screen.getByDisplayValue("connections_only");
    expect(radio).toBeChecked();
  });

  it("changes selected visibility when another option is clicked", () => {
    render(
      <VisibilityModal
        isOpen={true}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    const publicRadio = screen.getByDisplayValue("public");
    fireEvent.click(publicRadio);
    expect(publicRadio).toBeChecked();
  });

  it("calls onSave with selected visibility when Save is clicked", () => {
    render(
      <VisibilityModal
        isOpen={true}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    const publicRadio = screen.getByDisplayValue("public");
    fireEvent.click(publicRadio);

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith("public");
  });

  it("disables Save button when no changes are made", () => {
    render(
      <VisibilityModal
        isOpen={true}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <VisibilityModal
        isOpen={true}
        onClose={mockOnClose}
        currentVisibility="connections_only"
        onSave={mockOnSave}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

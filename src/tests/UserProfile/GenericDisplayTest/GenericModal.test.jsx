import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericModal from "../../../pages/UserProfile/Components/GenericDisplay/GenericModal";
import { vi } from "vitest";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSave: vi.fn(),
  onDelete: vi.fn(),
  type: "skills",
  initialData: {},
  editMode: true,
};

describe("GenericModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    render(<GenericModal {...defaultProps} />);
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
  });

  it("renders skill input for type=skills", () => {
    render(<GenericModal {...defaultProps} />);
    expect(screen.getByLabelText(/skill/i)).toBeInTheDocument();
  });

  it("disables save button when skill is empty and readonly", () => {
    render(<GenericModal {...defaultProps} />);
    const saveButton = screen.getByTestId("save-button");
    expect(saveButton).toBeDisabled();
  });

  it("calls onSave when valid form is submitted", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "React", name: "skillName" },
    });
    fireEvent.click(screen.getByTestId("save-button"));
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ skillName: "React" }),
    );
  });

  it("calls onClose when close button is clicked with no unsaved changes", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows discard confirmation modal if changes are made", () => {
    render(
      <GenericModal {...defaultProps} initialData={{ skillName: "React" }} />,
    );
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "Angular", name: "skillName" },
    });
    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(screen.getByText(/discard changes/i)).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByTestId("confirm-modal"));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it("closes discard modal without confirming", async () => {
    render(
      <GenericModal {...defaultProps} initialData={{ skillName: "JS" }} />,
    );
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "TS", name: "skillName" },
    });
    fireEvent.click(screen.getByLabelText("Close modal"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() =>
      expect(screen.queryByText(/discard changes/i)).not.toBeInTheDocument(),
    );
  });

  it("closes discard modal after confirming", async () => {
    render(
      <GenericModal {...defaultProps} initialData={{ skillName: "JS" }} />,
    );
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "TS", name: "skillName" },
    });
    fireEvent.click(screen.getByLabelText("Close modal"));
    fireEvent.click(screen.getByTestId("confirm-modal"));
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});

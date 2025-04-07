import { render, screen, fireEvent } from "@testing-library/react";
import GenericModal from "../pages/UserProfile/Components/GenericDisplay/GenericModal";
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

  it("validates skill field and shows error", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-button"));
    expect(screen.getByText(/please provide a skill/i)).toBeInTheDocument();
  });

  it("calls onSave when valid form is submitted", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "React", name: "skill" },
    });
    fireEvent.click(screen.getByTestId("save-button"));
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ skill: "React" }),
    );
  });

  it("calls onClose when ✖ button clicked with no unsaved changes", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByText("✖"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows discard confirmation modal if changes are made", () => {
    render(<GenericModal {...defaultProps} initialData={{ skill: "React" }} />);
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "Angular", name: "skill" },
    });
    fireEvent.click(screen.getByText("✖"));
    expect(screen.getByText(/discard changes/i)).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  // ✅ Additional tests for branches with low coverage

  it("validates that end year cannot be before start year", () => {
    render(
      <GenericModal
        {...defaultProps}
        type="education"
        initialData={{ startYear: "2022", endYear: "2020" }}
      />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    expect(
      screen.getByText(/end year can't be before the start year/i),
    ).toBeInTheDocument();
  });

  it("validates that end month cannot be before start month if same year", () => {
    render(
      <GenericModal
        {...defaultProps}
        type="experience"
        initialData={{
          startYear: "2024",
          startMonth: "October",
          endYear: "2024",
          endMonth: "January",
        }}
      />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    expect(
      screen.getByText(/end month can't be before the start month/i),
    ).toBeInTheDocument();
  });

  it("validates required fields for experience", () => {
    render(
      <GenericModal {...defaultProps} type="experience" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    expect(
      screen.getByText(/please provide a company name/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/please provide a title/i)).toBeInTheDocument();
  });

  it("validates required fields for education", () => {
    render(
      <GenericModal {...defaultProps} type="education" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    expect(
      screen.getByText(/please provide an institution/i),
    ).toBeInTheDocument();
  });

  it("validates required fields for certifications", () => {
    render(
      <GenericModal {...defaultProps} type="certifications" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    expect(
      screen.getByText(/please provide a certificate name/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please provide an issuing organization/i),
    ).toBeInTheDocument();
  });

  it("closes discard modal without confirming", () => {
    render(<GenericModal {...defaultProps} initialData={{ skill: "JS" }} />);
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "TS", name: "skill" },
    });
    fireEvent.click(screen.getByText("✖"));
    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);
    expect(screen.queryByText(/discard changes/i)).not.toBeInTheDocument();
  });

  it("closes discard modal after confirming", () => {
    render(<GenericModal {...defaultProps} initialData={{ skill: "JS" }} />);
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "TS", name: "skill" },
    });
    fireEvent.click(screen.getByText("✖"));
    const confirmBtn = screen.getByTestId("confirm-delete");
    fireEvent.click(confirmBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

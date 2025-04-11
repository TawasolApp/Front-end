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

  it("validates skill field and shows error", async () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) =>
          t.toLowerCase().includes("please provide a skill"),
        ),
      ).toBeInTheDocument();
    });
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

  it("calls onDelete when delete is confirmed", async () => {
    render(<GenericModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("delete-button"));
    const confirmButtons = await screen.findAllByTestId("confirm-modal");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it("validates that end year cannot be before start year", async () => {
    render(
      <GenericModal
        {...defaultProps}
        type="education"
        initialData={{ startYear: "2024", endYear: "2022", school: "Test" }}
      />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) =>
          t.includes("end year can't be before the start year"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("validates that end month cannot be before start month if same year", async () => {
    render(
      <GenericModal
        {...defaultProps}
        type="workExperience"
        initialData={{
          company: "Company",
          title: "Title",
          employmentType: "full_time",
          startYear: "2024",
          startMonth: "October",
          endYear: "2024",
          endMonth: "January",
        }}
      />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) =>
          t.includes("end month can't be before the start month"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("validates required fields for experience", async () => {
    render(
      <GenericModal {...defaultProps} type="workExperience" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) => t.includes("please provide a company name")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((t) => t.includes("please provide a title")),
      ).toBeInTheDocument();
    });
  });

  it("validates required fields for education", async () => {
    render(
      <GenericModal {...defaultProps} type="education" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) => t.includes("please provide a school")),
      ).toBeInTheDocument();
    });
  });

  it("validates required fields for certifications", async () => {
    render(
      <GenericModal {...defaultProps} type="certification" initialData={{}} />,
    );
    fireEvent.click(screen.getByTestId("save-button"));
    await waitFor(() => {
      expect(
        screen.getByText((t) =>
          t.includes("please provide a certificate name"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((t) =>
          t.includes("please provide an issuing organization"),
        ),
      ).toBeInTheDocument();
    });
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
    await waitFor(() => {
      expect(screen.queryByText(/discard changes/i)).not.toBeInTheDocument();
    });
  });

  it("closes discard modal after confirming", async () => {
    render(
      <GenericModal {...defaultProps} initialData={{ skillName: "JS" }} />,
    );
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "TS", name: "skillName" },
    });
    fireEvent.click(screen.getByLabelText("Close modal"));
    const confirmButtons = screen.getAllByTestId("confirm-modal");
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import GenericModal from "../pages/UserProfile/Components/GenericDisplay/GenericModal";

afterEach(cleanup);

describe("GenericModal", () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  const mockInitialData = {
    institution: "CU",
    degree: "Bachelor's Degree",
    startYear: "2018",
    startMonth: "Sep",
    endYear: "2022",
    endMonth: "Jun",
    description: "A degree in Computer Science",
  };

  it("renders correctly when open", () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    expect(screen.getByLabelText("School *")).toBeInTheDocument();
  });

  it("closes when close button is clicked without changes", () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /✖/ }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows discard modal when unsaved changes exist and close is clicked", async () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    fireEvent.change(screen.getByLabelText("School *"), {
      target: { value: "New University" },
    });

    fireEvent.click(screen.getByRole("button", { name: /✖/ }));

    await waitFor(() =>
      expect(screen.getByText("Discard changes?")).toBeInTheDocument()
    );
  });

  it("calls onSave with updated institution", async () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    fireEvent.change(screen.getByLabelText("School *"), {
      target: { value: "New University" },
    });

    const [saveButton] = screen.getAllByTestId("save-button");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockInitialData,
        institution: "New University",
      })
    );
  });

  it("shows delete modal when delete button is clicked", () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        editMode
        type="education"
        initialData={mockInitialData}
      />
    );

    const [deleteButton] = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Confirm delete")).toBeInTheDocument();
  });

  it("calls onDelete when delete is confirmed", async () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        editMode
        type="education"
        initialData={mockInitialData}
      />
    );

    const [deleteButton] = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButton);

    const confirmDelete = await screen.findByTestId("confirm-delete");
    fireEvent.click(confirmDelete);

    await waitFor(() => expect(mockOnDelete).toHaveBeenCalled());
  });

  it("validates required fields", async () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={{ ...mockInitialData, institution: "" }}
      />
    );

    const [saveButton] = screen.getAllByTestId("save-button");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(
        screen.getByText("Please provide an institution")
      ).toBeInTheDocument()
    );
  });

  it("handles month/year updates", async () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    fireEvent.change(screen.getByLabelText("School *"), {
      target: { value: "New University" },
    });

    fireEvent.change(screen.getByLabelText("Degree"), {
      target: { value: "Bachelor's Degree" },
    });

    fireEvent.change(screen.getByLabelText("Start Month"), {
      target: { value: "September" },
    });

    fireEvent.change(screen.getByLabelText("Start Year"), {
      target: { value: "2018" },
    });

    const [saveButton] = screen.getAllByTestId("save-button");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockInitialData,
        institution: "New University",
        degree: "Bachelor's Degree",
        startMonth: "September",
        startYear: "2018",
      })
    );
  });

  it("renders month dropdown correctly", () => {
    render(
      <GenericModal
        isOpen
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        type="education"
        initialData={mockInitialData}
      />
    );

    const dropdown = screen.getByLabelText("Start Month");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.children.length).toBeGreaterThan(1);
  });
});

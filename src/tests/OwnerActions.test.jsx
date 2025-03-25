import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OwnerActions from "../pages/UserProfile/Components/OwnerActions";

describe("OwnerActions Component", () => {
  it("renders nothing if no props are provided", () => {
    const { container } = render(<OwnerActions />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders only Add button and triggers callback", () => {
    const mockAdd = vi.fn();
    render(<OwnerActions onAdd={mockAdd} />);
    const addButton = screen.getByLabelText("add");
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(mockAdd).toHaveBeenCalled();
  });

  it("renders only Edit button and triggers callback", () => {
    const mockEdit = vi.fn();
    render(<OwnerActions onEdit={mockEdit} />);
    const editButton = screen.getByLabelText("edit");
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(mockEdit).toHaveBeenCalled();
  });

  it("renders only Delete button and triggers callback", () => {
    const mockDelete = vi.fn();
    render(<OwnerActions onDelete={mockDelete} />);
    const deleteButton = screen.getByLabelText("delete");
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("renders all buttons and calls each callback", () => {
    const mockAdd = vi.fn();
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();

    render(
      <OwnerActions onAdd={mockAdd} onEdit={mockEdit} onDelete={mockDelete} />
    );

    fireEvent.click(screen.getByLabelText("add"));
    fireEvent.click(screen.getByLabelText("edit"));
    fireEvent.click(screen.getByLabelText("delete"));

    expect(mockAdd).toHaveBeenCalled();
    expect(mockEdit).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalled();
  });
});

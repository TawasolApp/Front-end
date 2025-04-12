import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SkillsFields from "../../../pages/UserProfile/Components/ModalFields/SkillsFields";

describe("SkillsFields Component", () => {
  const mockHandleChange = vi.fn();

  const defaultProps = {
    formData: {
      skillName: "",
      position: "",
    },
    handleChange: mockHandleChange,
    errors: {},
    editMode: false,
  };

  it("renders skill and position input fields", () => {
    render(<SkillsFields {...defaultProps} />);
    expect(screen.getByLabelText(/skill \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position \(optional\)/i)).toBeInTheDocument();
  });

  it("renders errors if provided", () => {
    render(
      <SkillsFields
        {...defaultProps}
        errors={{ skillName: "Skill is required" }}
      />,
    );
    expect(screen.getByText("Skill is required")).toBeInTheDocument();
  });

  it("calls handleChange on skill input change if editMode is false", () => {
    render(<SkillsFields {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/skill \*/i), {
      target: { value: "React" },
    });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("sets correct values from formData", () => {
    render(
      <SkillsFields
        {...defaultProps}
        formData={{ skillName: "React", position: "Frontend Developer" }}
      />,
    );

    expect(screen.getByLabelText(/skill \*/i)).toHaveValue("React");
    expect(screen.getByLabelText(/position \(optional\)/i)).toHaveValue(
      "Frontend Developer",
    );
  });

  it("renders edit note and skill input as readOnly when editMode is true", () => {
    render(<SkillsFields {...defaultProps} editMode={true} />);
    const skillInput = screen.getByLabelText(/skill \*/i);
    expect(skillInput).toHaveAttribute("readOnly");
    expect(
      screen.getByText(/skill name cannot be edited/i),
    ).toBeInTheDocument();
  });
});

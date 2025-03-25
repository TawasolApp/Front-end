import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationFields from "../pages/UserProfile/Components/ModalFields/EducationFields";

describe("EducationFields Component", () => {
  const mockHandleChange = vi.fn();

  const defaultProps = {
    formData: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      grade: "",
      activities: "Chess Team",
      description: "Studied advanced algorithms",
    },
    handleChange: mockHandleChange,
    errors: {},
  };

  it("renders all fields", () => {
    render(<EducationFields {...defaultProps} />);

    expect(screen.getByLabelText(/school/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/degree/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/field of study/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/grade/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/activities and societies/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^description$/i)).toBeInTheDocument();
  });

  it("renders error messages if errors exist", () => {
    const errorProps = {
      ...defaultProps,
      errors: {
        institution: "School is required",
      },
    };

    render(<EducationFields {...errorProps} />);
    expect(screen.getByText("School is required")).toBeInTheDocument();
  });

  it("calls handleChange on input change", () => {
    render(<EducationFields {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/school/i), {
      target: { value: "MIT" },
    });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("displays activities and description character counts", () => {
    render(<EducationFields {...defaultProps} />);

    expect(
      screen.getByText((_, el) => el?.textContent === "10/500")
    ).toBeInTheDocument(); // "Chess Team"

    expect(
      screen.getByText((_, el) => el?.textContent === "27/1000")
    ).toBeInTheDocument(); // "Studied advanced algorithms"
  });

  it("shows 0/1000 when description is empty", () => {
    render(
      <EducationFields
        {...defaultProps}
        formData={{ ...defaultProps.formData, description: "" }}
      />
    );

    expect(
      screen.getByText((_, el) => el?.textContent === "0/1000")
    ).toBeInTheDocument();
  });

  it("shows 0/500 when activities is empty", () => {
    render(
      <EducationFields
        {...defaultProps}
        formData={{ ...defaultProps.formData, activities: "" }}
      />
    );

    expect(
      screen.getByText((_, el) => el?.textContent === "0/500")
    ).toBeInTheDocument();
  });
});

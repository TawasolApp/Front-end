import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExperienceFields from "../pages/UserProfile/Components/ModalFields/ExperienceFields";

describe("ExperienceFields Component", () => {
  const mockHandleChange = vi.fn();

  const defaultProps = {
    formData: {
      title: "",
      employmentType: "",
      company: "",
      currentlyWorking: false,
      location: "",
      locationType: "",
      description: "Some description",
    },
    handleChange: mockHandleChange,
    errors: {},
  };

  it("renders all input fields", () => {
    render(<ExperienceFields {...defaultProps} />);

    expect(screen.getByLabelText(/title\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment type/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/company or organization\*/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i am currently working in this role/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^location$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("renders errors if provided", () => {
    const errors = {
      title: "Title is required",
      company: "Company is required",
    };

    render(<ExperienceFields {...defaultProps} errors={errors} />);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Company is required")).toBeInTheDocument();
  });

  it("checkbox is checked when currentlyWorking is true", () => {
    render(
      <ExperienceFields
        {...defaultProps}
        formData={{ ...defaultProps.formData, currentlyWorking: true }}
      />,
    );

    const checkbox = screen.getByLabelText(/currently working/i);
    expect(checkbox).toBeChecked();
  });

  it("calls handleChange when input changes", () => {
    render(<ExperienceFields {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/title\*/i), {
      target: { value: "Developer" },
    });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("shows description character count correctly when non-empty", () => {
    render(<ExperienceFields {...defaultProps} />);

    const expectedLength = defaultProps.formData.description.length;
    expect(
      screen.getByText(
        (text) =>
          typeof text === "string" &&
          text.includes(`${expectedLength}`) &&
          text.includes("/1000"),
      ),
    ).toBeInTheDocument();
  });

  it("shows 0/1000 when description is empty", () => {
    render(
      <ExperienceFields
        {...defaultProps}
        formData={{ ...defaultProps.formData, description: "" }}
      />,
    );

    expect(
      screen.getByText(
        (text) => typeof text === "string" && text.includes("0/1000"),
      ),
    ).toBeInTheDocument();
  });
});

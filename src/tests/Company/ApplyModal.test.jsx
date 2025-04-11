import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ApplyModal from "../../pages/Company/Components/JobsPage/ApplyModal";

describe("ApplyModal", () => {
  const mockOnClose = vi.fn();
  const mockJob = {
    position: "Material Planner",
    location: "10th of Ramadan, Egypt",
  };
  const mockCompany = "Test Company";

  const setup = () =>
    render(
      <ApplyModal onClose={mockOnClose} job={mockJob} company={mockCompany} />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "auto";
  });

  test("renders modal with correct job and company info", () => {
    setup();
    expect(screen.getByText("Apply to Test Company")).toBeInTheDocument();
    expect(screen.getByText("Material Planner")).toBeInTheDocument();
    expect(screen.getByText("10th of Ramadan, Egypt")).toBeInTheDocument();
  });

  test("renders all required form fields", () => {
    setup();

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("phone-code-select")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-input")).toBeInTheDocument();
    expect(screen.getByTestId("experience-input")).toBeInTheDocument();
    expect(screen.getByTestId("salary-input")).toBeInTheDocument();
    expect(screen.getByTestId("agree-input")).toBeInTheDocument();
  });

  test("calls onClose when ✖ button is clicked", () => {
    setup();
    fireEvent.click(screen.getByTestId("close-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("submits the form without crashing", () => {
    setup();
    const form = screen.getByTestId("apply-form");
    fireEvent.submit(form);
    // There's no onSubmit handler yet, so we only test that it doesn't throw
  });
});

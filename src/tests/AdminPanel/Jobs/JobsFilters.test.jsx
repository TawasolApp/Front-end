import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi, describe } from "vitest";
import JobFilters from "../../../pages/AdminPanel/Jobs/JobFilters";

describe("JobFilters", () => {
  test("renders all tabs correctly", () => {
    render(<JobFilters current="All" onChange={() => {}} />);

    // Check that both "All" and "Flagged" buttons exist
    expect(screen.getByRole("button", { name: /All/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Flagged/i })
    ).toBeInTheDocument();
  });

  test("highlights the current active tab", () => {
    render(<JobFilters current="Flagged" onChange={() => {}} />);

    const flaggedButton = screen.getByRole("button", { name: /Flagged/i });

    // Check that the "Flagged" button has active styles
    expect(flaggedButton).toHaveClass("border-buttonSubmitEnable");
    expect(flaggedButton).toHaveClass("text-buttonSubmitEnable");
  });

  test("calls onChange when a tab is clicked", () => {
    const mockOnChange = vi.fn();

    render(<JobFilters current="All" onChange={mockOnChange} />);

    const flaggedButton = screen.getByRole("button", { name: /Flagged/i });

    // Simulate clicking "Flagged"
    fireEvent.click(flaggedButton);

    // It should call onChange with "Flagged"
    expect(mockOnChange).toHaveBeenCalledWith("Flagged");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});

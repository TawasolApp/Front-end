import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationePage from "../pages/UserProfile/Components/Pages/EducationPage";

// Mock GenericPage
vi.mock("../pages/UserProfile/Components/GenericDisplay/GenericPage", () => ({
  default: ({ title, type }) => (
    <div>
      <h1>{title}</h1>
      <div data-testid="type">{type}</div>
    </div>
  ),
}));

describe("EducationePage Component", () => {
  it("renders GenericPage with correct title and type", () => {
    render(<EducationePage />);
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("education");
  });
});

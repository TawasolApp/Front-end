import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExperiencePage from "../../../pages/UserProfile/Components/Pages/ExperiencePage";

// Mock GenericPage
vi.mock(
  "../../../pages/UserProfile/Components/GenericDisplay/GenericPage",
  () => ({
    default: ({ title, type }) => (
      <div>
        <h1>{title}</h1>
        <div data-testid="type">{type}</div>
      </div>
    ),
  }),
);

describe("ExperiencePage Component", () => {
  it("renders GenericPage with correct title and type", () => {
    render(<ExperiencePage />);
    expect(screen.getByText("Experiences")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("workExperience");
  });
});

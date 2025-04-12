import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SkillsPage from "../../../pages/UserProfile/Components/Pages/SkillsPage";

// ✅ Mock GenericPage
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

describe("SkillsPage Component", () => {
  it("renders GenericPage with correct title and type", () => {
    render(<SkillsPage />);
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("skills");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationPage from "../../../pages/UserProfile/Components/Pages/EducationPage";

// ✅ Mock GenericPage to avoid useNavigate/useOutletContext issues
vi.mock(
  "../../../pages/UserProfile/Components/GenericDisplay/GenericPage",
  () => ({
    default: ({ title, type }) => (
      <div>
        <h1>{title}</h1>
        <div data-testid="type">{type}</div>
      </div>
    ),
  })
);

describe("EducationPage Component", () => {
  it("renders GenericPage with correct title and type", () => {
    render(<EducationPage />);
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("education");
  });
});

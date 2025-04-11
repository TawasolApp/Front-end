import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CertificationsPage from "../../../pages/UserProfile/Components/Pages/CertificationsPage";

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

describe("CertificationsPage Component", () => {
  it("renders GenericPage with correct title and type", () => {
    render(<CertificationsPage />);
    expect(screen.getByText("Certifications")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("certification");
  });
});

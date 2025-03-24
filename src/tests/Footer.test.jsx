import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Footer from "../pages/CompanyPage/Components/Footer";

describe("Footer", () => {
  test("renders important links and help sections", () => {
    render(<Footer />);

    // General links
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Privacy & Terms")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByText("Marketing Solutions")).toBeInTheDocument();

    // Help center section
    expect(screen.getByText("Questions?")).toBeInTheDocument();
    expect(screen.getByText("Visit our Help Center.")).toBeInTheDocument();

    expect(
      screen.getByText("Manage your account & privacy")
    ).toBeInTheDocument();
    expect(screen.getByText("Go to Settings.")).toBeInTheDocument();

    expect(screen.getByText("Recommendation Transparency")).toBeInTheDocument();
    expect(
      screen.getByText("Learn more about Recommended Content.")
    ).toBeInTheDocument();
  });

  test("renders language selector with correct options", () => {
    render(<Footer />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("English (English)")).toBeInTheDocument();
    expect(screen.getByText("العربية (Arabic)")).toBeInTheDocument();
    expect(screen.getByText("Français (French)")).toBeInTheDocument();
  });

  test("shows copyright", () => {
    render(<Footer />);
    expect(screen.getByText(/LinkedIn Corporation © 2025/)).toBeInTheDocument();
  });
});

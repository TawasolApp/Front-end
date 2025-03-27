import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../../src/pages/UserProfile/Components/Footer";

describe("Footer component", () => {
  it("renders footer links", () => {
    render(<Footer />);

    // Check for some key footer links
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Community Policies")).toBeInTheDocument();
    expect(screen.getByText("Talent Solutions")).toBeInTheDocument();
    expect(screen.getByText("Visit our Help Center.")).toBeInTheDocument();
    expect(screen.getByText("Go to Settings.")).toBeInTheDocument();
    expect(
      screen.getByText("Learn more about Recommended Content."),
    ).toBeInTheDocument();
  });

  it("renders language selector with options", () => {
    render(<Footer />);

    const languageDropdown = screen.getByRole("combobox");
    expect(languageDropdown).toBeInTheDocument();

    // Optional: check for specific options
    expect(
      screen.getByRole("option", { name: /english/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /arabic/i })).toBeInTheDocument();
  });

  it("displays the copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(/linkedin corporation © 2025/i),
    ).toBeInTheDocument();
  });
});

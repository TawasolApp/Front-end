import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Footer from "../../pages/Company/Components/GenericComponents/Footer";

describe("Footer", () => {
  test("renders the footer text", () => {
    render(<Footer />);
    expect(screen.getByText("Tawasol App")).toBeInTheDocument();
  });
});

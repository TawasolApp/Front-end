import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, beforeEach } from "vitest";
import AboutLocations from "../../pages/Company/Components/AboutPage/AboutLocations";

//  Clean up mocks before each test
beforeEach(() => {
  vi.resetModules();
});

// Default mock for tests with coordinates
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: () => ({
      company: {
        location: "https://www.google.com/maps?q=30.0444,31.2357",
        address: "Cairo, Egypt",
      },
    }),
  };
});

describe("AboutLocations", () => {
  test("renders the location heading and directions link", () => {
    render(<AboutLocations />, { wrapper: MemoryRouter });

    const link = screen.getByRole("link", { name: /get directions/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=30.0444,31.2357",
    );
  });

  test("renders the Google Maps iframe with correct embed URL", () => {
    render(<AboutLocations />, { wrapper: MemoryRouter });

    const iframe = screen.getByTitle("Google Map");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.google.com/maps?q=30.0444,31.2357&z=15&output=embed",
    );
  });
});

describe("AboutLocations fallback behavior", () => {
  test("falls back to address when location URL has no coordinates", async () => {
    // Dynamically remock useOutletContext
    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useOutletContext: () => ({
          company: {
            location: "https://www.google.com/maps/place/Cairo",
            address: "Cairo, Egypt",
          },
        }),
      };
    });

    // Re-import the component after remocking
    const { default: AboutLocationsFallback } = await import(
      "../../pages/Company/Components/AboutPage/AboutLocations.jsx"
    );

    render(<AboutLocationsFallback />, { wrapper: MemoryRouter });

    const iframe = screen.getByTitle("Google Map");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.google.com/maps?q=Cairo%2C%20Egypt&z=15&output=embed",
    );
  });
});

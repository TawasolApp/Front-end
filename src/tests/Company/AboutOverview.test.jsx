import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import AboutOverview from "../../pages/Company/Components/AboutPage/AboutOverview";

// Mock useOutletContext from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

import { useOutletContext } from "react-router-dom"; // Import after mocking

describe("AboutOverview", () => {
  const mockCompany = {
    overview: "A great company with innovative products.",
    website: "https://example.com",
    contactNumber: "123-456-7890",
    isVerified: true,
    verification_date: "2022-01-01",
    industry: "Software",
    companySize: "100-200",
    address: "123 Test St, Test City",
    companyType: "Private",
    founded: "2010",
  };

  beforeEach(() => {
    useOutletContext.mockReturnValue({ company: mockCompany });
  });

  test("renders the main container and title", () => {
    render(<AboutOverview />);
    expect(screen.getByTestId("about-overview")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  test("renders overview text", () => {
    render(<AboutOverview />);
    expect(
      screen.getByText("A great company with innovative products."),
    ).toBeInTheDocument();
  });

  test("renders website with link", () => {
    render(<AboutOverview />);
    const link = screen.getByRole("link", { name: mockCompany.website });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", mockCompany.website);
  });

  test("renders all additional info using OverviewComponent", () => {
    render(<AboutOverview />);

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();

    expect(screen.getByText("Verified Page")).toBeInTheDocument();
    expect(screen.getByText("2022-01-01")).toBeInTheDocument();

    expect(screen.getByText("Industry")).toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();

    expect(screen.getByText("Company Size")).toBeInTheDocument();
    expect(screen.getByText("100-200+ employees")).toBeInTheDocument();

    expect(screen.getByText("Headquarters")).toBeInTheDocument();
    expect(screen.getByText("123 Test St, Test City")).toBeInTheDocument();

    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument();

    expect(screen.getByText("Founded")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  test("does not render fields that are missing", () => {
    useOutletContext.mockReturnValue({
      company: {
        overview: "Partial overview",
      },
    });

    render(<AboutOverview />);
    expect(screen.queryByText("Website")).not.toBeInTheDocument();
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Page")).not.toBeInTheDocument();
  });
});

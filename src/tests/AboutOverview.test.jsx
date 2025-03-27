import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Aboutoverview from "../pages/CompanyPage/Components/AboutOverview";
describe("Aboutoverview", () => {
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

  test("renders the main container and title", () => {
    render(<Aboutoverview company={mockCompany} />);
    expect(screen.getByTestId("about-overview")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  test("renders overview text", () => {
    render(<Aboutoverview company={mockCompany} />);
    expect(
      screen.getByText("A great company with innovative products."),
    ).toBeInTheDocument();
  });

  test("renders website with link", () => {
    render(<Aboutoverview company={mockCompany} />);
    const link = screen.getByRole("link", { name: mockCompany.website });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", mockCompany.website);
  });

  test("renders all additional info using Overviewcomponent", () => {
    render(<Aboutoverview company={mockCompany} />);
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
    const partialCompany = {
      overview: "Partial overview",
    };

    render(<Aboutoverview company={partialCompany} />);
    expect(screen.queryByText("Website")).not.toBeInTheDocument();
    expect(screen.queryByText("Phone")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Page")).not.toBeInTheDocument();
  });
});

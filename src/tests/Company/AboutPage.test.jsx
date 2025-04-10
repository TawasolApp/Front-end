import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import AboutPage from "../../pages/Company/Components/Pages/AboutPage";

// Mock layout providing `company` context to children via Outlet
const MockLayout = ({ company }) => <Outlet context={{ company }} />;

describe("AboutPage", () => {
  test("renders LoadingPage when company is not provided", () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/about"]}>
        <Routes>
          <Route element={<Outlet context={{ company: null }} />}>
            <Route path="/company/:companyId/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("renders AboutOverview and AboutLocations on AboutPage", async () => {
    const mockCompany = {
      name: "Test Company",
      overview: "This is a sample overview.",
      locations: ["Cairo", "Alexandria"],
      description: "Company description",
      logo: "",
      banner: "",
      followers: 1200,
      companySize: "201-500",
      website: "https://example.com",
      address: "123 Sample St.",
      location: "https://maps.google.com/?q=30.0444,31.2357", // valid mock location URL
    };

    render(
      <MemoryRouter initialEntries={["/company/test-company/about"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Wait for AboutOverview to appear
    await waitFor(() =>
      expect(screen.getByTestId("about-overview")).toBeInTheDocument()
    );

    // Assert both sections are present
    expect(screen.getByTestId("about-overview")).toBeInTheDocument();
    expect(screen.getByTestId("about-locations")).toBeInTheDocument();
  });
});

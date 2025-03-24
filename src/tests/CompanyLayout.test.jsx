import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CompanyLayout from "../pages/CompanyPage/Components/CompanyLayout";
import { axiosInstance } from "../apis/axios";

// Mock axios
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockedAxios = axiosInstance;

// Mock child components (CompanyHeader, Footer, and Outlet)
vi.mock("../pages/companypage/components/CompanyHeader", () => ({
  default: () => <div data-testid="company-header" />,
}));
vi.mock("../pages/companypage/components/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

describe("CompanyLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders layout when companyId is provided", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/*" element={<CompanyLayout />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the layout to finish loading
    await waitFor(() => {
      expect(screen.getByTestId("company-header")).toBeInTheDocument();
    });

    // Check other static layout components
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  test("redirects to first company if no companyId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          companyId: "first-company",
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/company"]}>
        <Routes>
          <Route path="/company/*" element={<CompanyLayout />} />
          <Route
            path="/company/:companyId/home"
            element={<div data-testid="redirected-home" />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/companies");
    });
  });
});

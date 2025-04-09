import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CompanyLayout from "../../pages/Company/CompanyLayout";
import { axiosInstance } from "../../apis/axios";

// Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockedAxios = axiosInstance;

// Mock CompanyHeader
vi.mock(
  "../../pages/Company/Components/GenericComponents/CompanyHeader",
  () => ({
    default: () => <div data-testid="company-header" />,
  })
);

// Mock Footer
vi.mock("../../pages/Company/Components/GenericComponents/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

// Mock LoadingPage
vi.mock("../../pages/LoadingScreen/LoadingPage", () => ({
  default: () => <div data-testid="loading-page" />,
}));

// Mock react-router-dom Outlet
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
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        companyId: "test-company",
        name: "Test Company",
        isManager: true,
      },
    });

    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/*" element={<CompanyLayout />} />
        </Routes>
      </MemoryRouter>
    );

    // Should show loading first
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    // Then render components
    await waitFor(() => {
      expect(screen.getByTestId("company-header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });

  test("redirects to first company if no companyId is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          companyId: "first-company",
          name: "First Co",
          isManager: true,
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
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/companies?page=1&limit=1&name=y"
      );
    });
  });
});

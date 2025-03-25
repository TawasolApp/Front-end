import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { axiosInstance as axios } from "../apis/axios";
import Aboutpage from "../pages/companypage/components/AboutPage";

// Mock axios
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));
const mockedAxios = axios;

test("renders Aboutoverview and AboutLocations on Aboutpage", async () => {
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
  };

  mockedAxios.get.mockResolvedValueOnce({ data: mockCompany });

  render(
    <MemoryRouter initialEntries={["/company/test-company/about"]}>
      <Routes>
        <Route path="/company/:companyId/about" element={<Aboutpage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for async loading
  await waitFor(() =>
    expect(screen.getByTestId("about-overview")).toBeInTheDocument()
  );

  // Assertions
  expect(screen.getByTestId("about-overview")).toBeInTheDocument();
  expect(screen.getByTestId("about-locations")).toBeInTheDocument();
});

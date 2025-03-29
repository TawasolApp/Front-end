import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Homepage from "../pages/Company/Components/Pages/HomePage";
import { vi } from "vitest";
import { axiosInstance } from "../apis/axios";

vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockedAxios = axiosInstance;

test("renders Overviewbox, PostsSlider, and JobOpenings on Homepage", async () => {
  const mockCompany = {
    name: "Test Company",
    overview: "This is a short overview of the company.",
    banner: "",
    logo: "",
    description: "A test company",
    address: "Test Address",
    followers: 1000,
    companySize: "201-500 employees",
    website: "https://testcompany.com",
  };

  mockedAxios.get.mockResolvedValueOnce({ data: mockCompany });

  render(
    <MemoryRouter initialEntries={["/company/test-company/home"]}>
      <Routes>
        <Route path="/company/:companyId/home" element={<Homepage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for company data to load
  await waitFor(() =>
    expect(screen.getByTestId("overview-box")).toBeInTheDocument()
  );

  // Check all 3 components are rendered
  expect(screen.getByTestId("overview-box")).toBeInTheDocument();
  expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
  expect(screen.getByTestId("job-openings")).toBeInTheDocument();
});
test("does not render Overviewbox when overview is empty", async () => {
  const mockCompanyWithoutOverview = {
    name: "Test Company",
    overview: "", // Empty overview
    banner: "",
    logo: "",
    description: "A test company",
    address: "Test Address",
    followers: 1000,
    companySize: "201-500 employees",
    website: "https://testcompany.com",
  };

  mockedAxios.get.mockResolvedValueOnce({ data: mockCompanyWithoutOverview });

  render(
    <MemoryRouter initialEntries={["/company/test-company/home"]}>
      <Routes>
        <Route path="/company/:companyId/home" element={<Homepage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for API call to complete
  await waitFor(() => {
    expect(mockedAxios.get).toHaveBeenCalledWith("/companies/test-company");
  });

  // Ensure Overviewbox is NOT rendered
  expect(screen.queryByTestId("overview-box")).not.toBeInTheDocument();

  // Ensure other components are still rendered
  await waitFor(() => {
    expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
  });
  expect(screen.getByTestId("job-openings")).toBeInTheDocument();
});

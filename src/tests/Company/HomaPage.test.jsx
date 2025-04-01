import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Homepage from "../../pages/Company/Components/Pages/HomePage";
import { vi } from "vitest";
import { axiosInstance } from "../../apis/axios";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockedAxios = axiosInstance;

function setup(companyData) {
  mockedAxios.get.mockImplementation((url) => {
    if (url === "/companies/test-company") {
      return Promise.resolve({ data: companyData });
    }
    if (url === "/companies/test-company/posts") {
      return Promise.resolve({
        data: [
          {
            id: 1,
            content: "Sample Post",
            media: [],
            reactions: {},
            comments: [],
            companyId: "test-company",
          },
        ],
      });
    }
    if (url === "/companies/test-company/jobs") {
      return Promise.resolve({
        data: [
          {
            id: 1,
            title: "Frontend Developer",
            description: "Build UIs",
            location: "Remote",
            type: "Full-Time",
          },
        ],
      });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });

  render(
    <MemoryRouter initialEntries={["/company/test-company/home"]}>
      <Routes>
        <Route path="/company/:companyId/home" element={<Homepage />} />
      </Routes>
    </MemoryRouter>
  );
}

test("Homepage > renders Overviewbox, PostsSlider, and JobOpenings on Homepage", async () => {
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

  setup(mockCompany);

  await waitFor(() => {
    expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
    expect(screen.getByTestId("job-openings")).toBeInTheDocument();
  });
});

test("Homepage > does not render Overviewbox when overview is empty", async () => {
  const mockCompanyWithoutOverview = {
    name: "Test Company",
    overview: "", // empty
    banner: "",
    logo: "",
    description: "A test company",
    address: "Test Address",
    followers: 1000,
    companySize: "201-500 employees",
    website: "https://testcompany.com",
  };

  setup(mockCompanyWithoutOverview);

  await waitFor(() => {
    expect(screen.queryByTestId("overview-box")).not.toBeInTheDocument();
    expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
    expect(screen.getByTestId("job-openings")).toBeInTheDocument();
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import JobOpenings from "../../pages/Company/Components/HomePage/JobOpenings";
import { axiosInstance } from "../../apis/axios";

// ✅ Mock navigate and params
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ companyId: "123" }),
  };
});

// ✅ Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockCompany = {
  name: "TestCompany",
  logo: "logo.png",
};

const mockJobs = [
  {
    id: 1,
    position: "Software Engineer",
    location: "Cairo, Egypt",
  },
  {
    id: 2,
    position: "Frontend Developer",
    location: "Giza, Egypt",
  },
];

describe("JobOpenings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.get.mockResolvedValue({ data: mockJobs });
  });

  test("renders job openings with header and jobs", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route
            path="/company/:companyId"
            element={<JobOpenings company={mockCompany} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("job-openings")).toBeInTheDocument();
    expect(screen.getByText("Recent Job Openings")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Show all jobs →")).toBeInTheDocument();
  });

  test("navigates to 'Show all jobs' when button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route
            path="/company/:companyId"
            element={<JobOpenings company={mockCompany} />}
          />
        </Routes>
      </MemoryRouter>
    );

    const button = await screen.findByText("Show all jobs →");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/company/123/jobs");
  });
});

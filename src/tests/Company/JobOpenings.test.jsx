import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import JobOpenings from "../../pages/Company/Components/HomePage/JobOpenings";
import { axiosInstance } from "../../apis/axios";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ companyId: "123" }),
    useOutletContext: () => ({ company: mockCompany }),
  };
});

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
    jobId: 1,
    position: "Software Engineer",
    location: "Cairo, Egypt",
  },
  {
    jobId: 2,
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
          <Route path="/company/:companyId" element={<JobOpenings />} />
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
  test("scrolls right when right arrow is clicked", async () => {
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

    const container = await screen.findByTestId("job-openings");
    const scrollableDiv = container.querySelector(".overflow-x-scroll");

    // Add scrollBy mock
    scrollableDiv.scrollBy = vi.fn();

    const rightButton = screen.getByLabelText("scroll-right");
    fireEvent.click(rightButton);

    expect(scrollableDiv.scrollBy).toHaveBeenCalledWith({
      left: 350,
      behavior: "smooth",
    });
  });

  test("scrolls left when left arrow is clicked", async () => {
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

    const container = await screen.findByTestId("job-openings");
    const scrollableDiv = container.querySelector(".overflow-x-scroll");

    //  Add scrollBy mock
    scrollableDiv.scrollBy = vi.fn();

    const leftButton = screen.getByLabelText("scroll-left");
    fireEvent.click(leftButton);

    expect(scrollableDiv.scrollBy).toHaveBeenCalledWith({
      left: -350,
      behavior: "smooth",
    });
  });
  test("logs error when job fetching fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axiosInstance.get.mockRejectedValueOnce(new Error("Fetch failed"));

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for useEffect to run
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch job openings:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});

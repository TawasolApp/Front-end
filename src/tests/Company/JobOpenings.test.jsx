import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

// More than 6 jobs to test slicing
const mockJobs = Array.from({ length: 10 }, (_, i) => ({
  jobId: i + 1,
  position: `Job Position ${i + 1}`,
  location: `Location ${i + 1}`,
}));

describe("JobOpenings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.get.mockResolvedValue({ data: mockJobs });
  });

  test("renders up to 6 job openings with header and jobs", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("job-openings")).toBeInTheDocument();
    expect(screen.getByText("Recent Job Openings")).toBeInTheDocument();

    // Should only show 6 jobs max
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Job Position ${i}`)).toBeInTheDocument();
    }

    expect(screen.getByText("Show all jobs →")).toBeInTheDocument();
  });

  test("navigates to 'Show all jobs' when button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    const button = await screen.findByText("Show all jobs →");
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/company/123/jobs");
  });

  test("scrolls right when right arrow is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    const container = await screen.findByTestId("job-openings");
    const scrollableDiv = container.querySelector(".overflow-x-scroll");

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
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    const container = await screen.findByTestId("job-openings");
    const scrollableDiv = container.querySelector(".overflow-x-scroll");

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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch job openings:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
  test("shows loading page when loading is true", async () => {
    const promise = Promise.resolve({ data: mockJobs });
    axiosInstance.get.mockImplementation(() => promise);

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    // LoadingPage should be present before promise resolves
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await act(() => promise);
  });
  test("renders nothing when no jobs are returned", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    const { container } = render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
  test("does not show scroll arrows when jobs are 3 or fewer", async () => {
    const shortJobs = mockJobs.slice(0, 3);
    axiosInstance.get.mockResolvedValueOnce({ data: shortJobs });

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route path="/company/:companyId" element={<JobOpenings />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByTestId("job-openings");

    // Arrows should not be in the document
    expect(screen.queryByLabelText("scroll-left")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("scroll-right")).not.toBeInTheDocument();
  });
});

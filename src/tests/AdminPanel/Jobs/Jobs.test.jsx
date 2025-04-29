import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect, vi, describe, beforeEach } from "vitest";
import Jobs from "../../../pages/AdminPanel/Jobs/Jobs";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Jobs", () => {
  const mockJobs = [
    {
      jobId: "1",
      position: "Software Engineer",
      location: "Remote",
      isFlagged: false,
    },
    {
      jobId: "2",
      position: "Project Manager",
      location: "On-site",
      isFlagged: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading page initially", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: [], totalPages: 1, totalItems: 0 },
    });

    render(<Jobs />);

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-page")).not.toBeInTheDocument();
    });
  });

  test("displays jobs after loading", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 1, totalItems: 2 },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Project Manager/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Showing 2 of 2 jobs/i)).toBeInTheDocument();
  });

  test("filters jobs when typing in search", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 1, totalItems: 2 },
    });

    axios.get.mockResolvedValueOnce({
      data: {
        jobs: [
          {
            jobId: "2",
            position: "Project Manager",
            location: "On-site",
            isFlagged: true,
          },
        ],
        totalPages: 1,
        totalItems: 1,
      },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search jobs.../i);
    fireEvent.change(searchInput, { target: { value: "Project" } });

    await waitFor(() => {
      expect(screen.getByText(/Project Manager/i)).toBeInTheDocument();
      expect(screen.queryByText(/Software Engineer/i)).not.toBeInTheDocument();
    });
  });

  test("deletes a job and updates the count", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 1, totalItems: 2 },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText(/Software Engineer/i)).not.toBeInTheDocument();
    });
  });

  test("shows no jobs found when search returns nothing", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 1, totalItems: 2 },
    });

    axios.get.mockResolvedValueOnce({
      data: { jobs: [], totalPages: 1, totalItems: 0 },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search jobs.../i);
    fireEvent.change(searchInput, { target: { value: "NonExistingJob" } });

    await waitFor(() => {
      expect(screen.getByText(/No jobs found/i)).toBeInTheDocument();
    });
  });

  test("loads more jobs when clicking 'See More'", async () => {
    // First load
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 2, totalItems: 20 },
    });

    // Second load (new page)
    axios.get.mockResolvedValueOnce({
      data: {
        jobs: [
          {
            jobId: "3",
            position: "Backend Developer",
            location: "Remote",
            isFlagged: false,
          },
        ],
        totalPages: 2,
        totalItems: 20,
      },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    });

    const seeMoreButton = screen.getByRole("button", { name: /see more/i });
    fireEvent.click(seeMoreButton);

    await waitFor(() => {
      expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
    });
  });

  test("filters jobs by 'Flagged' tab", async () => {
    axios.get.mockResolvedValueOnce({
      data: { jobs: mockJobs, totalPages: 1, totalItems: 2 },
    });

    render(<Jobs />);

    await waitFor(() => {
      expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Project Manager/i)).toBeInTheDocument();
    });

    const flaggedTab = screen.getByRole("button", { name: /flagged/i });
    fireEvent.click(flaggedTab);

    await waitFor(() => {
      expect(screen.getByText(/Project Manager/i)).toBeInTheDocument();
      expect(screen.queryByText(/Software Engineer/i)).not.toBeInTheDocument();
    });
  });

  // test("shows loading spinner when loading more jobs", async () => {
  //   // First fetch
  //   axios.get.mockResolvedValueOnce({
  //     data: { jobs: mockJobs, totalPages: 2, totalItems: 20 },
  //   });

  //   let resolver;
  //   // Create a pending Promise for second fetch
  //   const secondFetch = new Promise((resolve) => {
  //     resolver = resolve;
  //   });

  //   // Second fetch (delayed manually)
  //   axios.get.mockImplementationOnce(() => secondFetch);

  //   render(<Jobs />);

  //   // Wait for first jobs to load
  //   await waitFor(() => {
  //     expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
  //   });

  //   // Click 'See More'
  //   const seeMoreButton = screen.getByRole("button", { name: /see more/i });
  //   fireEvent.click(seeMoreButton);

  //   // ✅ Now spinner should appear because axios is still pending
  //   await waitFor(() => {
  //     expect(
  //       screen.getByTestId("spinner", { hidden: true })
  //     ).toBeInTheDocument();
  //   });

  //   // Now resolve the delayed axios call
  //   resolver({
  //     data: {
  //       jobs: [
  //         {
  //           jobId: "3",
  //           position: "QA Engineer",
  //           location: "Remote",
  //           isFlagged: false,
  //         },
  //       ],
  //       totalPages: 2,
  //       totalItems: 20,
  //     },
  //   });

  //   // New job appears after spinner disappears
  //   await waitFor(() => {
  //     expect(screen.getByText(/QA Engineer/i)).toBeInTheDocument();
  //   });
  // });
});

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Outlet } from "react-router-dom";
import { vi } from "vitest";
import JobsPage from "../../../src/pages/Company/Components/Pages/JobsPage";
import * as axiosModule from "../../../src/apis/axios";

// Mock axios
vi.mock("../../../src/apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock child components
vi.mock("../../../src/pages/LoadingScreen/LoadingPage", () => ({
  default: () => <div data-testid="loading-page">Loading...</div>,
}));
vi.mock("../../../src/pages/Company/Components/JobsPage/JobsList", () => ({
  default: () => <div data-testid="jobs-list">JobsList</div>,
}));
vi.mock("../../../src/pages/Company/Components/JobsPage/JobDetails", () => ({
  default: () => <div data-testid="job-details">JobDetails</div>,
}));
vi.mock(
  "../../../src/pages/Company/Components/JobsPage/JobApplications",
  () => ({
    default: () => <div data-testid="job-applications">JobApplications</div>,
  })
);
vi.mock("../../../src/pages/Company/Components/JobsPage/AddJobModal", () => ({
  default: ({ onClose, onJobAdded }) => (
    <div data-testid="add-job-modal">
      AddJobModal
      <button
        onClick={() => {
          onJobAdded();
          onClose();
        }}
      >
        Add Job
      </button>
    </div>
  ),
}));

vi.mock("../../../src/pages/Company/Components/JobsPage/Analytics", () => ({
  default: () => <div data-testid="analytics">Analytics</div>,
}));

const mockCompany = {
  name: "Test Company",
  logo: "/logo.png",
};

const mockJobs = [
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Data Scientist" },
];

const MockLayout = ({ company, showAdminIcons = false }) => (
  <Outlet context={{ company, showAdminIcons, setShowAdminIcons: vi.fn() }} />
);

describe("JobsPage", () => {
  beforeEach(() => {
    axiosModule.axiosInstance.get.mockResolvedValue({ data: mockJobs });
  });

  test("renders loading screen initially", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("jobs-list")).toBeInTheDocument()
    );
  });

  test("renders job list and job details for non-admins", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("jobs-list")).toBeInTheDocument();
      expect(screen.getByTestId("job-details")).toBeInTheDocument();
    });
  });

  test("renders job applications and analytics for admins", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route
            element={<MockLayout company={mockCompany} showAdminIcons={true} />}
          >
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("job-applications")).toBeInTheDocument();
      expect(screen.getByTestId("analytics")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /post a job opening/i })
    ).toBeInTheDocument();
  });

  test("opens and closes the AddJobModal when admin clicks the button", async () => {
    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route
            element={<MockLayout company={mockCompany} showAdminIcons={true} />}
          >
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId("job-applications")).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByRole("button", { name: /post a job opening/i })
    );
    expect(screen.getByTestId("add-job-modal")).toBeInTheDocument();

    // Click the button that triggers onClose (inside mock)
    fireEvent.click(screen.getByText("Add Job"));

    await waitFor(() =>
      expect(screen.queryByTestId("add-job-modal")).not.toBeInTheDocument()
    );
  });

  test("handles job fetch failure", async () => {
    axiosModule.axiosInstance.get.mockRejectedValue(new Error("Fetch error"));

    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByTestId("jobs-list")).not.toBeInTheDocument()
    );
  });
  test("calls handleJobAdded when a job is added in the modal", async () => {
    vi.clearAllMocks();

    // First fetch when component mounts
    axiosModule.axiosInstance.get.mockResolvedValueOnce({ data: mockJobs });

    // Second fetch after job is added
    axiosModule.axiosInstance.get.mockResolvedValueOnce({ data: mockJobs });

    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route
            element={<MockLayout company={mockCompany} showAdminIcons={true} />}
          >
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Wait for first fetch to finish
    await waitFor(() =>
      expect(screen.getByTestId("job-applications")).toBeInTheDocument()
    );

    // Open modal
    fireEvent.click(
      screen.getByRole("button", { name: /post a job opening/i })
    );

    // Trigger job add (calls handleJobAdded -> second fetch)
    fireEvent.click(screen.getByText("Add Job"));

    await waitFor(() => {
      expect(axiosModule.axiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });
  test("logs an error if job refetch fails after adding a job", async () => {
    vi.clearAllMocks();

    // First successful fetch (initial load)
    axiosModule.axiosInstance.get.mockResolvedValueOnce({ data: mockJobs });

    // Second fetch fails (after job add)
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axiosModule.axiosInstance.get.mockRejectedValueOnce(
      new Error("Refetch failed")
    );

    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route
            element={<MockLayout company={mockCompany} showAdminIcons={true} />}
          >
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Wait for first job fetch
    await waitFor(() =>
      expect(screen.getByTestId("job-applications")).toBeInTheDocument()
    );

    // Open modal
    fireEvent.click(
      screen.getByRole("button", { name: /post a job opening/i })
    );

    // Click Add Job → triggers handleJobAdded which will now fail
    fireEvent.click(screen.getByText("Add Job"));

    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to refetch jobs after add",
        expect.any(Error)
      )
    );

    consoleErrorSpy.mockRestore(); // Cleanup
  });
  test("does not crash when company is null", async () => {
    vi.clearAllMocks();

    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route element={<MockLayout company={null} />}>
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });
  test("does not render job list when jobs array is empty", async () => {
    vi.clearAllMocks();
    axiosModule.axiosInstance.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={["/company/123/jobs"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId/jobs" element={<JobsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("jobs-list")).not.toBeInTheDocument();
      expect(screen.queryByTestId("job-applications")).not.toBeInTheDocument();
      expect(screen.queryByTestId("analytics")).not.toBeInTheDocument();
    });
  });
});

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import JobsPage from "../../pages/Company/Components/Pages/JobsPage";
import * as axiosModule from "../../apis/axios";
import { useParams, useOutletContext } from "react-router-dom";

// Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn()
  }
}));

// Mock react-router hooks directly
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({ companyId: "123" }),
    useOutletContext: vi.fn().mockReturnValue({ 
      company: { name: "Test Company", logo: "/test-logo.png" }, 
      showAdminIcons: false 
    })
  };
});

// Mock child components
vi.mock("../../pages/LoadingScreen/LoadingPage", () => ({
  default: () => <div data-testid="loading-page">Loading...</div>
}));

vi.mock("../../pages/Company/Components/JobsPage/JobsList", () => ({
  default: ({ jobs }) => (
    <div data-testid="jobs-list">
      {jobs.map(job => (
        <div key={job.id} data-testid={`job-item-${job.id}`}>{job.title}</div>
      ))}
    </div>
  )
}));

vi.mock("../../pages/Company/Components/JobsPage/Analytics", () => ({
  default: () => <div data-testid="analytics">Analytics</div>
}));

vi.mock("../../pages/Company/Components/JobsPage/AddJobModal", () => ({
  default: ({ onClose, onJobAdded, companyId }) => (
    <div data-testid="add-job-modal">
      <p>Company ID: {companyId}</p>
      <button onClick={() => {
        onJobAdded();
        onClose();
      }} data-testid="add-job-button">
        Add Job
      </button>
      <button onClick={onClose} data-testid="close-modal">
        Close
      </button>
    </div>
  )
}));

describe("JobsPage Component", () => {
  const mockJobs = [
    { id: 1, title: "Frontend Developer" },
    { id: 2, title: "Backend Engineer" }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axiosModule.axiosInstance.get.mockResolvedValue({ data: mockJobs });
    // Reset the default mock implementation for useOutletContext
    useOutletContext.mockReturnValue({ 
      company: { name: "Test Company", logo: "/test-logo.png" }, 
      showAdminIcons: false 
    });
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("fetches and displays jobs successfully", async () => {
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    // Should show loading initially
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByTestId("jobs-list")).toBeInTheDocument();
    });
    
    expect(axiosModule.axiosInstance.get).toHaveBeenCalledWith(
      "/companies/123/jobs?page=1&limit=3"
    );
  });

  test("handles API error gracefully", async () => {
    // Mock API call to reject
    axiosModule.axiosInstance.get.mockRejectedValueOnce(new Error("API Error"));
    
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch jobs", 
        expect.any(Error)
      );
    });
    
    consoleSpy.mockRestore();
  });

  test("doesn't fetch jobs if companyId is missing", async () => {
    useParams.mockReturnValue({ companyId: undefined });
    
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(axiosModule.axiosInstance.get).not.toHaveBeenCalled();
  });

  test("doesn't fetch jobs if company is missing", async () => {
    useOutletContext.mockReturnValue({ 
      company: null,
      showAdminIcons: false 
    });
    
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(axiosModule.axiosInstance.get).not.toHaveBeenCalled();
  });

  test("does not render JobsList when jobs array is empty", async () => {
    axiosModule.axiosInstance.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId("jobs-list")).not.toBeInTheDocument();
    });
  });

  test("opens and closes Add Job Modal", async () => {
    // Set showAdminIcons to true BEFORE rendering
    useOutletContext.mockReturnValue({ 
      company: { name: "Test Company" },
      showAdminIcons: true
    });
    
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
    
    // Wait for component to finish loading and render the button
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /post a job/i })).toBeInTheDocument();
    });
    
    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /post a job/i }));
    expect(screen.getByTestId("add-job-modal")).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByTestId("close-modal"));
    await waitFor(() => {
      expect(screen.queryByTestId("add-job-modal")).not.toBeInTheDocument();
    });
  });
});

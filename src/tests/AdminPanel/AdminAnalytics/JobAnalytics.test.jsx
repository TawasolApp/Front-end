import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, beforeAll } from "vitest";
import JobAnalytics from "../../../pages/AdminPanel/AdminAnalytics/JobAnalytics";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Silence console errors and mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("JobAnalytics", () => {
  const mockJobAnalytics = {
    totalJobs: 80,
    jobReportedCount: 6,
    mostAppliedCompany: {
      _id: "company123",
      applicationCount: 150,
    },
    mostAppliedJob: {
      position: "Frontend Developer",
      description: "Build cool UIs",
      experience_level: "Mid",
      employment_type: "Full-Time",
      posted_at: "2024-04-01T00:00:00.000Z",
      applicants: 120,
      company_id: "company123",
    },
  };

  const mockCompanyData = {
    name: "Tech Corp",
    logo: "/logo.png",
    description: "We build technology.",
  };

  test("renders full analytics section with company and job", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockCompanyData }) // Most applied company
      .mockResolvedValueOnce({ data: mockCompanyData }); // Most applied job's company

    render(<JobAnalytics jobAnalytics={mockJobAnalytics} />);

    await waitFor(() => {
      expect(screen.getByText("80 Jobs")).toBeInTheDocument();
      expect(screen.getByText("Most Applied Company")).toBeInTheDocument();
      expect(screen.getByText("Most Applied Job")).toBeInTheDocument();

      const companySection = screen
        .getByText("Most Applied Company")
        .closest("div");
      const jobSection = screen.getByText("Most Applied Job").closest("div");

      expect(within(companySection).getByText("Tech Corp")).toBeInTheDocument();
      expect(within(jobSection).getByText("Tech Corp")).toBeInTheDocument();

      expect(screen.getByText("Applications Received:")).toBeInTheDocument();
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Developer • Mid • Full-Time")
      ).toBeInTheDocument();
      expect(screen.getByText("Applications: 120")).toBeInTheDocument();
      expect(screen.getByText("Jobs Reported: 6")).toBeInTheDocument();
    });
  });

  test("shows fallback if company details fail", async () => {
    axios.get
      .mockRejectedValueOnce(new Error("Company not found")) // Most applied company
      .mockResolvedValueOnce({ data: mockCompanyData }); // Most applied job's company

    render(<JobAnalytics jobAnalytics={mockJobAnalytics} />);

    await waitFor(() => {
      expect(screen.getByText("Loading company info...")).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Developer • Mid • Full-Time")
      ).toBeInTheDocument();
    });
  });

  test("shows fallback if job company fails", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockCompanyData }) // Most applied company
      .mockRejectedValueOnce(new Error("Company not found")); // Most applied job's company

    render(<JobAnalytics jobAnalytics={mockJobAnalytics} />);

    await waitFor(() => {
      expect(
        screen.getByText("Loading job company info...")
      ).toBeInTheDocument();
      expect(screen.getByText("Applications: 120")).toBeInTheDocument();
    });
  });

  test("renders fallback when no job is available", async () => {
    render(
      <JobAnalytics
        jobAnalytics={{
          ...mockJobAnalytics,
          mostAppliedJob: null,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("No job data available.")).toBeInTheDocument();
    });
  });
});

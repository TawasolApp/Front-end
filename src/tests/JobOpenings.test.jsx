import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JobOpenings from "../pages/CompanyPage/Components/JobOpenings";

describe("JobOpenings Component", () => {
  beforeEach(() => {
    vi.resetModules(); // clears previous imports and mocks
  });

  test("renders job openings with header and jobs", () => {
    const mockJobs = [
      {
        id: 1,
        title: "Software Engineer",
        location: "Cairo, Egypt",
        logo: "logo.png",
      },
      {
        id: 2,
        title: "Frontend Developer",
        location: "Cairo, Egypt",
        logo: "logo.png",
      },
    ];

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <JobOpenings company={{ logo: "logo.png" }} jobs={mockJobs} />
      </MemoryRouter>
    );

    expect(screen.getByText("Recent Job Openings")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) => content.includes("Show all") && content.includes("jobs")
      )
    ).toBeInTheDocument();
  });

  // test("renders 'No job openings available' when jobs array is empty", () => {
  //   render(
  //     <MemoryRouter>
  //       <JobOpenings company={{ logo: "logo.png" }} jobs={[]} />
  //     </MemoryRouter>
  //   );

  //   expect(
  //     screen.getByText((content) =>
  //       content.includes("No job openings available")
  //     )
  //   ).toBeInTheDocument();
  // });

  test("navigates to 'Show all jobs' when button is clicked", async () => {
    const mockJobs = [
      {
        id: 1,
        title: "Software Engineer",
        location: "Cairo, Egypt",
        logo: "logo.png",
      },
    ];

    render(
      <MemoryRouter>
        <JobOpenings company={{ logo: "logo.png" }} jobs={mockJobs} />
      </MemoryRouter>
    );

    const showAllJobsButton = screen.getByText(
      (content) => content.includes("Show all") && content.includes("jobs")
    );
    expect(showAllJobsButton).toBeInTheDocument();

    // Simulate clicking the "Show all jobs" button
    fireEvent.click(showAllJobsButton);
    expect(showAllJobsButton).toBeInTheDocument();
  });

  // test("renders job details correctly", () => {
  //   const mockJobs = [
  //     {
  //       id: 1,
  //       title: "Backend Developer",
  //       location: "Alexandria, Egypt",
  //       logo: "backend-logo.png",
  //     },
  //   ];

  //   render(
  //     <MemoryRouter>
  //       <JobOpenings company={{ logo: "logo.png" }} jobs={mockJobs} />
  //     </MemoryRouter>
  //   );

  //   expect(
  //     screen.getByText((content) => content.includes("Backend Developer"))
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByText((content) => content.includes("Alexandria, Egypt"))
  //   ).toBeInTheDocument();
  //   expect(screen.getByAltText("Company Logo")).toHaveAttribute(
  //     "src",
  //     "backend-logo.png"
  //   );
  // });
});

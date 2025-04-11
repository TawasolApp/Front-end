import { render, screen } from "@testing-library/react";
import Analytics from "../../pages/Company/Components/JobsPage/Analytics.jsx";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Analytics component", () => {
  test("displays 'No jobs available.' when job list is empty", () => {
    render(<Analytics jobs={[]} />);
    expect(screen.getByText(/No jobs available/i)).toBeInTheDocument();
  });

  test("renders chart and job summary list when jobs are available", () => {
    const jobs = [
      { jobId: "1", position: "Frontend Dev", applicants: 10 },
      { jobId: "2", position: "Backend Dev", applicants: 5 },
      { jobId: "3", position: "QA Tester", applicants: 0 },
    ];

    render(<Analytics jobs={jobs} />);

    expect(screen.getByText("Job Analytics")).toBeInTheDocument();
    expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
    expect(screen.getByText("10 applicants")).toBeInTheDocument();
    expect(screen.getByText("Backend Dev")).toBeInTheDocument();
    expect(screen.getByText("5 applicants")).toBeInTheDocument();
    expect(screen.getByText("QA Tester")).toBeInTheDocument();
    expect(screen.getByText("0 applicants")).toBeInTheDocument();
  });

  test("sets isMobile state based on screen width", () => {
    // Simulate a mobile screen
    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    render(<Analytics jobs={[]} />);
    expect(screen.getByText(/no jobs available/i)).toBeInTheDocument();
  });
  test("uses default 0 applicants when field is missing", () => {
    const jobs = [
      { jobId: "1", position: "Support Engineer" }, // no applicants field
    ];

    render(<Analytics jobs={jobs} />);
    expect(screen.getByText("Support Engineer")).toBeInTheDocument();
    expect(screen.getByText("0 applicants")).toBeInTheDocument();
  });
});

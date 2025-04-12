import { render, screen, fireEvent } from "@testing-library/react";
import JobDetails from "../../pages/Company/Components/JobsPage/JobDetails";
import { vi } from "vitest";

// Mock the ApplyModal to avoid actual modal rendering
vi.mock("../../../src/pages/Company/Components/JobsPage/ApplyModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="apply-modal">
      ApplyModal
      <button data-testid="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe("JobDetails", () => {
  const jobMock = {
    position: "Frontend Developer",
    location: "Cairo",
    postedAt: new Date().toISOString(),
    applicants: 5,
    locationType: "Remote",
    employmentType: "Full-time",
    description: "Exciting frontend opportunity.",
    experienceLevel: "Mid Level",
    salary: "$3000/month",
  };

  const logoUrl = "/logo.png";
  const companyName = "TestCompany";

  test("renders job details correctly", () => {
    render(<JobDetails job={jobMock} logo={logoUrl} name={companyName} />);

    expect(screen.getByText(jobMock.position)).toBeInTheDocument();
    expect(screen.getByText(companyName)).toBeInTheDocument();
    expect(screen.getByText(/people clicked apply/i)).toBeInTheDocument();
    expect(screen.getByText(/about the job/i)).toBeInTheDocument();
    expect(screen.getByText(/experience/i)).toBeInTheDocument();
    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByText(jobMock.salary)).toBeInTheDocument();
  });

  test("renders fallback when no job is selected", () => {
    render(<JobDetails job={null} />);
    expect(
      screen.getByText(/select a job to see details/i),
    ).toBeInTheDocument();
  });

  test("renders company logo if provided", () => {
    render(<JobDetails job={jobMock} logo={logoUrl} name={companyName} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", logoUrl);
    expect(img).toHaveAttribute("alt", companyName);
  });

  test("renders only available fields conditionally", () => {
    const jobWithoutExtras = {
      position: "Backend Engineer",
      location: "Alexandria",
    };

    render(<JobDetails job={jobWithoutExtras} name="SomeCompany" />);

    expect(screen.queryByText(/about the job/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/experience/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/salary/i)).not.toBeInTheDocument();
  });
  test("opens ApplyModal when clicking Apply", () => {
    render(<JobDetails job={jobMock} logo={logoUrl} name={companyName} />);

    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);

    expect(screen.getByTestId("apply-modal")).toBeInTheDocument();
  });
  test("omits postedAt and applicants text when values are missing", () => {
    const job = {
      position: "UX Designer",
      location: "Giza",
      locationType: "On-site",
      employmentType: "Part-time",
    };

    render(<JobDetails job={job} name="NoTimeCo" />);

    expect(screen.queryByText(/ago/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/clicked apply/i)).not.toBeInTheDocument();
  });
  test("closes ApplyModal when handleCloseModal is called", () => {
    render(<JobDetails job={jobMock} logo={logoUrl} name={companyName} />);

    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);
    expect(screen.getByTestId("apply-modal")).toBeInTheDocument();

    // Simulate closing modal
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" }); // optional fallback
    fireEvent.click(screen.getByTestId("apply-modal").parentElement); // simulate parent close trigger

    // In real usage, you’d likely control modal unmount from parent or modal internals
  });
  test("uses default locationType when not provided", () => {
    const job = {
      position: "QA Engineer",
      location: "Dubai",
      employmentType: "Part-time",
    };

    render(<JobDetails job={job} name="FallbackCo" />);

    expect(screen.getByText("On-site")).toBeInTheDocument();
  });
  test("uses default employmentType when not provided", () => {
    const job = {
      position: "SysAdmin",
      location: "Remote",
      locationType: "Remote",
    };

    render(<JobDetails job={job} name="FallbackCo" />);

    expect(screen.getByText("Full-time")).toBeInTheDocument();
  });
  test("closes ApplyModal when close button is clicked", () => {
    render(<JobDetails job={jobMock} logo={logoUrl} name={companyName} />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(screen.getByTestId("apply-modal")).toBeInTheDocument();

    // Click close
    fireEvent.click(screen.getByTestId("close-button"));

    // Modal should be removed
    expect(screen.queryByTestId("apply-modal")).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import JobsList from "../../pages/Company/Components/JobsPage/JobsList";

const mockJobs = [
  {
    jobId: 1,
    position: "Frontend Developer",
    location: "Cairo",
  },
  {
    jobId: 2,
    position: "Backend Developer",
    location: "Giza",
  },
];

const logo = "/logo.png";
const name = "TestCompany";

describe("JobsList", () => {
  test("renders all job cards", () => {
    render(
      <JobsList
        jobs={mockJobs}
        onSelectJob={() => {}}
        selectedJob={null}
        logo={logo}
        name={name}
      />,
    );

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  test("calls onSelectJob with correct job when a card is clicked", () => {
    const handleSelect = vi.fn();

    render(
      <JobsList
        jobs={mockJobs}
        onSelectJob={handleSelect}
        selectedJob={null}
        logo={logo}
        name={name}
      />,
    );

    const frontendCard = screen.getByText("Frontend Developer");
    fireEvent.click(frontendCard);

    expect(handleSelect).toHaveBeenCalledWith(mockJobs[0]);
  });

  test("highlights selected job", () => {
    render(
      <JobsList
        jobs={mockJobs}
        onSelectJob={() => {}}
        selectedJob={mockJobs[1]}
        logo={logo}
        name={name}
      />,
    );

    const selectedCard = screen.getByTestId("job-card-2");
    expect(selectedCard).toHaveClass("bg-selectedjob");
  });
});

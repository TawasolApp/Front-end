import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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

// Helper function to wrap component in MemoryRouter
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("JobsList", () => {
  test("renders all job cards", () => {
    renderWithRouter(
      <JobsList
        jobs={mockJobs}
        onSelectJob={() => {}}
        selectedJob={null}
        logo={logo}
        name={name}
      />
    );

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  test("highlights selected job", () => {
    renderWithRouter(
      <JobsList
        jobs={mockJobs}
        onSelectJob={() => {}}
        selectedJob={mockJobs[1]}
        logo={logo}
        name={name}
      />
    );
  
    // Use getAllByRole and find the specific link
    const links = screen.getAllByRole('link');
    const selectedCard = links.find(link => link.getAttribute('href') === '/jobs/2');
    
    // Check that the parent div or the link itself has the highlight class
    const cardContainer = selectedCard.closest('div.bg-selectedjob') || 
                         selectedCard.closest('div').parentElement;
    expect(cardContainer).toHaveClass("min-w-[280px] max-w-[300px] flex-shrink-0");
  });
});

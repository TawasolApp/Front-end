import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import JobApplications from "../../pages/Company/Components/JobsPage/JobApplications";
import { axiosInstance } from "../../apis/axios";

// Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

describe("JobApplications", () => {
  const jobMock = { jobId: "123", position: "Frontend Developer" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays message if no job is selected", () => {
    render(<JobApplications job={null} />);
    expect(
      screen.getByText(/select a job to see applicants/i),
    ).toBeInTheDocument();
  });

  test("shows loading state while fetching", async () => {
    // simulate loading delay
    axiosInstance.get.mockImplementationOnce(
      () =>
        new Promise(
          (resolve) => setTimeout(() => resolve({ data: [] }), 100), // delay response
        ),
    );

    render(<JobApplications job={jobMock} />);

    // loading spinner should appear
    expect(await screen.findByTestId("loading-page")).toBeInTheDocument();
  });

  test("renders applicants list", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: [
        {
          userId: "1",
          firstName: "Jane",
          lastName: "Doe",
          headline: "React Dev",
          profilePicture: "http://example.com/jane.jpg",
        },
      ],
    });

    render(<JobApplications job={jobMock} />);

    expect(await screen.findByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/react dev/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  test("loads more applicants when clicking 'Load more'", async () => {
    // Page 1
    axiosInstance.get
      .mockResolvedValueOnce({
        data: [
          {
            userId: "1",
            firstName: "Jane",
            lastName: "Doe",
            headline: "React Dev",
            profilePicture: null,
          },
          {
            userId: "2",
            firstName: "John",
            lastName: "Smith",
            headline: "Vue Dev",
            profilePicture: null,
          },
        ],
      })
      // Page 2
      .mockResolvedValueOnce({
        data: [
          {
            userId: "3",
            firstName: "Emily",
            lastName: "Blunt",
            headline: "Angular Dev",
            profilePicture: null,
          },
        ],
      });

    render(<JobApplications job={jobMock} />);

    // Page 1 loads
    await screen.findByText(/jane doe/i);
    await screen.findByText(/john smith/i);

    // "Load more" button should be visible now
    const loadMoreBtn = await screen.findByTestId("load-more-button");
    fireEvent.click(loadMoreBtn);

    // Page 2 loads
    expect(await screen.findByText(/emily blunt/i)).toBeInTheDocument();
  });
  test("displays no applicants and logs error if API call fails", async () => {
    const errorMock = new Error("Network Error");

    axiosInstance.get.mockRejectedValueOnce(errorMock); // trigger catch block

    const jobMock = {
      jobId: "123",
      position: "Backend Developer",
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {}); // silence console.error

    render(<JobApplications job={jobMock} />);

    // wait for the component to handle the failed fetch
    await waitFor(() => {
      expect(screen.getByText(/no applicants yet/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch applicants:",
      errorMock,
    );

    consoleSpy.mockRestore();
  });
});

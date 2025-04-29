import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi, describe, beforeEach } from "vitest";
import JobCard from "../../../pages/AdminPanel/Jobs/JobCard";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    delete: vi.fn(),
  },
}));

describe("JobCard", () => {
  const mockJob = {
    jobId: "123",
    position: "Frontend Developer",
    companyName: "Awesome Co.",
    companyLogo: "https://example.com/logo.png",
    location: "Remote",
    postedAt: new Date().toISOString(),
    isFlagged: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders job details correctly", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Awesome Co. • Remote/i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /awesome co. logo/i })
    ).toBeInTheDocument();
  });

  test("calls onDelete when Delete button is clicked", async () => {
    const mockOnDelete = vi.fn();
    axios.delete.mockResolvedValueOnce({}); // mock success delete

    render(<JobCard job={mockJob} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    fireEvent.click(deleteButton);

    // Wait for axios call and onDelete to be called
    await screen.findByRole("button", { name: /delete/i });

    expect(axios.delete).toHaveBeenCalledWith("/jobs/123");
    expect(mockOnDelete).toHaveBeenCalledWith("123");
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect, vi, describe, beforeEach } from "vitest";
import JobCard from "../../../pages/AdminPanel/Jobs/JobCard";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("JobCard", () => {
  const baseJob = {
    jobId: "123",
    position: "Frontend Developer",
    companyName: "Awesome Co.",
    companyLogo: "https://example.com/logo.png",
    location: "Remote",
    postedAt: new Date("2024-01-01").toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders job details correctly", () => {
    render(<JobCard job={{ ...baseJob, isFlagged: false }} />);
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Awesome Co. • Remote/i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /awesome co. logo/i })
    ).toBeInTheDocument();
    expect(screen.getByText("1/1/2024")).toBeInTheDocument(); // Adjust date format if needed
  });

  test("calls onDelete when Delete button is clicked", async () => {
    const mockOnDelete = vi.fn();
    axios.delete.mockResolvedValueOnce({});

    render(
      <JobCard job={{ ...baseJob, isFlagged: false }} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith("/jobs/123"));
    expect(mockOnDelete).toHaveBeenCalledWith("123");
  });

  test("shows 'Deleting...' when delete is in progress", async () => {
    axios.delete.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    render(<JobCard job={{ ...baseJob, isFlagged: false }} />);
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    fireEvent.click(deleteButton);
    expect(deleteButton).toHaveTextContent("Deleting...");
  });

  test("renders ignore button and handles ignore click", async () => {
    axios.patch.mockResolvedValueOnce({});
    render(<JobCard job={{ ...baseJob, isFlagged: true }} />);

    const ignoreButton = screen.getByRole("button", { name: /ignore/i });
    expect(ignoreButton).toBeInTheDocument();
    fireEvent.click(ignoreButton);

    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith("/admin/123/ignore")
    );
  });

  test("shows 'Ignoring...' when ignore is in progress", async () => {
    axios.patch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    render(<JobCard job={{ ...baseJob, isFlagged: true }} />);
    const ignoreButton = screen.getByRole("button", { name: /ignore/i });

    fireEvent.click(ignoreButton);
    expect(ignoreButton).toHaveTextContent("Ignoring...");
  });

  test("shows 'Flagged' label if job is flagged", () => {
    render(<JobCard job={{ ...baseJob, isFlagged: true }} />);
    const flaggedTexts = screen.getAllByText(/Flagged/i);
    // Find the visible <p> element
    const visibleFlaggedText = flaggedTexts.find((el) => el.tagName === "P");
    expect(visibleFlaggedText).toBeInTheDocument();
  });
  test("does not render Ignore button if job is not flagged", () => {
    render(<JobCard job={{ ...baseJob, isFlagged: false }} />);
    expect(
      screen.queryByRole("button", { name: /ignore/i })
    ).not.toBeInTheDocument();
  });

  test("delete button is disabled when loading", async () => {
    axios.delete.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<JobCard job={{ ...baseJob, isFlagged: false }} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(deleteButton).toBeDisabled();
  });

  test("ignore button is disabled when loading", async () => {
    axios.patch.mockImplementation(() => new Promise(() => {}));
    render(<JobCard job={{ ...baseJob, isFlagged: true }} />);

    const ignoreButton = screen.getByRole("button", { name: /ignore/i });
    fireEvent.click(ignoreButton);
    expect(ignoreButton).toBeDisabled();
  });

  test("handles delete error without crashing", async () => {
    const mockOnDelete = vi.fn();
    axios.delete.mockRejectedValueOnce(new Error("Delete failed"));

    render(
      <JobCard job={{ ...baseJob, isFlagged: false }} onDelete={mockOnDelete} />
    );
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled(); // it shouldn't call onDelete on failure
    });
  });

  test("handles ignore error without crashing", async () => {
    axios.patch.mockRejectedValueOnce(new Error("Ignore failed"));
    render(<JobCard job={{ ...baseJob, isFlagged: true }} />);

    const ignoreButton = screen.getByRole("button", { name: /ignore/i });
    fireEvent.click(ignoreButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(ignoreButton).not.toBeDisabled(); // should re-enable after failure
    });
  });

  test("does not crash if onDelete is not provided", async () => {
    axios.delete.mockResolvedValueOnce({});
    render(<JobCard job={{ ...baseJob, isFlagged: false }} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
    });
  });
});

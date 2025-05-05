import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddJobModal from "../../pages/Company/Components/JobsPage/AddJobModal";
import { axiosInstance } from "../../apis/axios";

// Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe("AddJobModal", () => {
  const mockOnClose = vi.fn();
  const mockOnJobAdded = vi.fn();

  const setup = () => {
    render(
      <AddJobModal
        onClose={mockOnClose}
        onJobAdded={mockOnJobAdded}
        companyId="company123"
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders all form fields", () => {
    setup();

    // Find inputs by their placeholders or attributes instead of test IDs
    expect(screen.getByPlaceholderText("Senior Software Engineer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Annual salary in USD")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Describe the role, responsibilities, and requirements...")).toBeInTheDocument();
    
    // Find select elements
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument(); // Employment Type select
    expect(screen.getByTestId("location-type-select")).toBeInTheDocument();
    expect(screen.getByTestId("experience-level-select")).toBeInTheDocument();
    
    // Find the submit button by text
    expect(screen.getByRole("button", { name: /post job opening/i })).toBeInTheDocument();
  });

  test("updates form values correctly", () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Senior Software Engineer"), {
      target: { value: "Frontend Developer" },
    });
    fireEvent.change(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)"), {
      target: { value: "Cairo, Egypt" },
    });

    expect(screen.getByPlaceholderText("Senior Software Engineer").value).toBe(
      "Frontend Developer",
    );
    expect(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)").value).toBe("Cairo, Egypt");
  });

  test("submits form and calls axios + callbacks", async () => {
    const mockResponse = { data: { id: "job123" } };
    axiosInstance.post.mockResolvedValueOnce(mockResponse);

    setup();

    fireEvent.change(screen.getByPlaceholderText("Senior Software Engineer"), {
      target: { value: "Backend Developer" },
    });
    fireEvent.change(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)"), {
      target: { value: "Alexandria" },
    });

    const form = screen.getByText(/post job opening/i).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/companies/company123/jobs",
        expect.objectContaining({
          position: "Backend Developer",
          location: "Alexandria",
        }),
      );
      expect(mockOnJobAdded).toHaveBeenCalledWith(mockResponse.data);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("displays error when axios fails", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { error: "Failed to create job" } },
    });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    setup();

    fireEvent.change(screen.getByPlaceholderText("Senior Software Engineer"), {
      target: { value: "QA Engineer" },
    });
    fireEvent.change(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)"), {
      target: { value: "Giza" },
    });

    const form = screen.getByText(/post job opening/i).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to create job");
    });

    alertMock.mockRestore();
  });

  test("submits without onJobAdded callback", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { id: "job456" } });

    render(<AddJobModal onClose={vi.fn()} companyId="company123" />); // no onJobAdded

    fireEvent.change(screen.getByPlaceholderText("Senior Software Engineer"), {
      target: { value: "DevOps Engineer" },
    });
    fireEvent.change(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)"), {
      target: { value: "Luxor" },
    });

    const form = screen.getByText(/post job opening/i).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
    });
  });

  test("shows default error message when no error from backend", async () => {
    axiosInstance.post.mockRejectedValueOnce({});

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<AddJobModal onClose={vi.fn()} companyId="company123" />);

    fireEvent.change(screen.getByPlaceholderText("Senior Software Engineer"), {
      target: { value: "UI/UX Designer" },
    });
    fireEvent.change(screen.getByPlaceholderText("City, Country (e.g., Cairo, Egypt)"), {
      target: { value: "Aswan" },
    });

    const form = screen.getByText(/post job opening/i).closest('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to post job. Try again.");
    });

    alertMock.mockRestore();
  });

  test("calls onClose when close button is clicked", () => {
    setup();
    // Find the close button by the CloseIcon
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

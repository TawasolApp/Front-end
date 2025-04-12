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
  test("submits without onJobAdded callback", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { id: "job456" } });

    render(<AddJobModal onClose={vi.fn()} companyId="company123" />); // no onJobAdded

    fireEvent.change(screen.getByTestId("position-input"), {
      target: { value: "DevOps Engineer" },
    });
    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Luxor" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
    });
  });
  test("shows default error message when no error from backend", async () => {
    axiosInstance.post.mockRejectedValueOnce({});

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<AddJobModal onClose={vi.fn()} companyId="company123" />);

    fireEvent.change(screen.getByTestId("position-input"), {
      target: { value: "UI/UX Designer" },
    });
    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Aswan" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to post job. Try again.");
    });

    alertMock.mockRestore();
  });
  test("renders all form fields", () => {
    setup();

    expect(screen.getByTestId("position-input")).toBeInTheDocument();
    expect(screen.getByTestId("industry-input")).toBeInTheDocument();
    expect(screen.getByTestId("location-input")).toBeInTheDocument();
    expect(screen.getByTestId("salary-input")).toBeInTheDocument();
    expect(screen.getByTestId("employment-type-select")).toBeInTheDocument();
    expect(screen.getByTestId("location-type-select")).toBeInTheDocument();
    expect(screen.getByTestId("experience-level-select")).toBeInTheDocument();
    expect(screen.getByTestId("description-textarea")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  test("updates form values correctly", () => {
    setup();

    fireEvent.change(screen.getByTestId("position-input"), {
      target: { value: "Frontend Developer" },
    });
    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Cairo, Egypt" },
    });

    expect(screen.getByTestId("position-input").value).toBe(
      "Frontend Developer",
    );
    expect(screen.getByTestId("location-input").value).toBe("Cairo, Egypt");
  });

  test("submits form and calls axios + callbacks", async () => {
    const mockResponse = { data: { id: "job123" } };
    axiosInstance.post.mockResolvedValueOnce(mockResponse);

    setup();

    fireEvent.change(screen.getByTestId("position-input"), {
      target: { value: "Backend Developer" },
    });
    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Alexandria" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

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

    fireEvent.change(screen.getByTestId("position-input"), {
      target: { value: "QA Engineer" },
    });
    fireEvent.change(screen.getByTestId("location-input"), {
      target: { value: "Giza" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to create job");
    });

    alertMock.mockRestore();
  });

  test("calls onClose when ✖ button is clicked", () => {
    setup();
    fireEvent.click(screen.getByText("✖"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

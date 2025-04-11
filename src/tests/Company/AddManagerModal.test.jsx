import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import AddManagerModal from "../../pages/Company/Components/Modals/AddManagerModal";
import { axiosInstance } from "../../apis/axios";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("AddManagerModal", () => {
  const mockOnClose = vi.fn();
  const mockCompanyId = "test-company";

  const typeInSearch = async (value) => {
    const input = screen.getByPlaceholderText("Enter name");
    fireEvent.change(input, { target: { value } });
    return input;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("does not render when show is false", () => {
    const { container } = render(
      <AddManagerModal
        show={false}
        onClose={mockOnClose}
        companyId={mockCompanyId}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders when show is true", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    expect(screen.getByText("Add Manager")).toBeInTheDocument();
  });

  test("searches and displays user suggestions", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // managers
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "2", firstName: "Jane", lastName: "Smith" }],
    }); // search result

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    await typeInSearch("Jane");

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("adds manager successfully", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // managers
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "1", firstName: "Alice", lastName: "Johnson" }],
    }); // search
    axiosInstance.post.mockResolvedValueOnce({}); // post
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // managers after adding

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    await typeInSearch("Alice");

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Alice Johnson"));
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(
        screen.getByText("Manager added successfully."),
      ).toBeInTheDocument();
      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/companies/${mockCompanyId}/managers`,
        { newUserId: "1" },
      );
    });
  });

  test("resets and closes modal on Cancel", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("shows no suggestions when search result is empty", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // managers
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // search

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    await typeInSearch("NoMatch");

    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });

  test("does not show Load more when no more managers", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "1", firstName: "Only", lastName: "One" }],
    });

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />,
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Load more")).not.toBeInTheDocument();
    });
  });
});

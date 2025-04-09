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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("does not render when show is false", () => {
    const { container } = render(
      <AddManagerModal
        show={false}
        onClose={mockOnClose}
        companyId={mockCompanyId}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders when show is true", async () => {
    axiosInstance.get.mockResolvedValueOnce([]); // managers

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />
      );
    });

    expect(screen.getByText("Add Manager")).toBeInTheDocument();
  });

  test("searches and displays user suggestions", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // initial managers
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "2", firstName: "Jane", lastName: "Smith" }],
    }); // search result

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />
      );
    });

    const input = screen.getByPlaceholderText("Enter name");
    fireEvent.change(input, { target: { value: "Jane" } });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("adds manager on Add button click", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // initial managers
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "1", firstName: "Alice", lastName: "Johnson" }],
    }); // search

    axiosInstance.post.mockResolvedValueOnce({}); // add manager

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />
      );
    });

    const input = screen.getByPlaceholderText("Enter name");
    fireEvent.change(input, { target: { value: "Alice" } });

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    // Simulate selecting user
    fireEvent.click(screen.getByText("Alice Johnson"));

    // Add button should now be enabled
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/companies/${mockCompanyId}/managers`,
        { newUserId: "1" }
      );
    });
  });

  test("displays error message on failure", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // initial managers
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "3", firstName: "Bob", lastName: "Marley" }],
    }); // search results
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: "Failed to add manager" } },
    });

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />
      );
    });

    // Simulate search
    const input = screen.getByPlaceholderText("Enter name");
    fireEvent.change(input, { target: { value: "Bob" } });

    await waitFor(() => {
      expect(screen.getByText("Bob Marley")).toBeInTheDocument();
    });

    // Simulate selecting user
    fireEvent.click(screen.getByText("Bob Marley"));

    // Trigger Add
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(screen.getByText("Failed to add manager")).toBeInTheDocument();
    });
  });
  test("resets state and closes modal on Cancel click", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    render(
      <AddManagerModal
        show={true}
        onClose={mockOnClose}
        companyId={mockCompanyId}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });
  test("shows no suggestions when search returns empty", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // managers
    axiosInstance.get.mockResolvedValueOnce({ data: [] }); // user search

    render(
      <AddManagerModal
        show={true}
        onClose={mockOnClose}
        companyId={mockCompanyId}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "NoMatch" },
    });

    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });
  // test("fetches more managers when Load more is clicked", async () => {
  //   const mockFirstPage = [
  //     { userId: "1", firstName: "Alpha", lastName: "One" },
  //     { userId: "2", firstName: "Beta", lastName: "Two" },
  //   ];

  //   const mockSecondPage = [
  //     { userId: "3", firstName: "Gamma", lastName: "Three" },
  //   ];

  //   axiosInstance.get
  //     .mockResolvedValueOnce({ data: mockFirstPage }) // page 1
  //     .mockResolvedValueOnce({ data: mockSecondPage }); // page 2

  //   await act(async () => {
  //     render(
  //       <AddManagerModal
  //         show={true}
  //         onClose={vi.fn()}
  //         companyId="test-company"
  //       />
  //     );
  //   });

  //   // Wait for "Alpha One" to ensure managers are rendered
  //   await waitFor(() => {
  //     expect(screen.getByText("Alpha One")).toBeInTheDocument();
  //   });

  //   // Now "Load more" button should be in the DOM
  //   const loadMoreBtn = screen.getByText("Load more");
  //   expect(loadMoreBtn).toBeInTheDocument();

  //   fireEvent.click(loadMoreBtn);

  //   await waitFor(() => {
  //     expect(screen.getByText("Gamma Three")).toBeInTheDocument();
  //   });
  // });
  test("does not show Load more button when no more data", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ userId: "1", firstName: "Only", lastName: "One" }],
    });

    await act(async () => {
      render(
        <AddManagerModal
          show={true}
          onClose={mockOnClose}
          companyId={mockCompanyId}
        />
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Load more")).not.toBeInTheDocument();
    });
  });
  // test("Add button is disabled while loading", async () => {
  //   vi.useFakeTimers();

  //   axiosInstance.get
  //     .mockResolvedValueOnce({ data: [] }) // Initial fetch of managers
  //     .mockResolvedValueOnce({
  //       data: [{ userId: "99", firstName: "Loading", lastName: "Manager" }],
  //     }); // Search response

  //   axiosInstance.post.mockImplementation(
  //     () => new Promise((resolve) => setTimeout(() => resolve({}), 500))
  //   );

  //   await act(async () => {
  //     render(
  //       <AddManagerModal
  //         show={true}
  //         onClose={mockOnClose}
  //         companyId={mockCompanyId}
  //       />
  //     );
  //   });

  //   const input = screen.getByPlaceholderText("Enter name");
  //   fireEvent.change(input, { target: { value: "Loading" } });

  //   // Fast-forward debounce timer
  //   act(() => {
  //     vi.advanceTimersByTime(300);
  //   });

  //   // Wait for the dropdown to show the search result
  //   await waitFor(() =>
  //     expect(screen.getByText("Loading Manager")).toBeInTheDocument()
  //   );

  //   // Select the user and click Add
  //   fireEvent.click(screen.getByText("Loading Manager"));
  //   fireEvent.click(screen.getByTestId("add-button"));

  //   // Add button should show "Adding..."
  //   expect(screen.getByTestId("add-button")).toHaveTextContent("Adding...");

  //   // Fast-forward the POST delay
  //   act(() => {
  //     vi.advanceTimersByTime(500);
  //   });

  //   // Wait for button text to go back to "Add" after async post resolves
  //   await waitFor(() =>
  //     expect(screen.getByTestId("add-button")).toHaveTextContent("Add")
  //   );

  //   vi.useRealTimers(); // Cleanup
  // }, 10000); // extend timeout if needed
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import DropdownUsers from "../../../pages/Feed/GenericComponents/DropdownUsers";
import { axiosInstance } from "../../../apis/axios";
import { BrowserRouter } from "react-router-dom";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock ActorHeader component
vi.mock("../../../pages/Feed/GenericComponents/ActorHeader", () => ({
  default: ({
    authorId,
    authorName,
    authorBio,
    authorPicture,
    iconSize,
    enableLink,
  }) => (
    <div data-testid="actor-header">
      <div data-testid="author-id">{authorId}</div>
      <div data-testid="author-name">{authorName}</div>
      <div data-testid="author-bio">{authorBio}</div>
      <div data-testid="author-picture">{authorPicture}</div>
      <div data-testid="icon-size">{iconSize}</div>
      <div data-testid="enable-link">{String(enableLink)}</div>
    </div>
  ),
}));

// Sample user data for tests
const mockUsers = [
  {
    userId: "1",
    id: "user1",
    firstName: "John",
    lastName: "Doe",
    headline: "Software Engineer",
    profilePicture: "john.jpg",
  },
  {
    userId: "2",
    id: "user2",
    firstName: "Jane",
    lastName: "Smith",
    headline: "Product Manager",
    profilePicture: "jane.jpg",
  },
  {
    userId: "3",
    id: "user3",
    firstName: "Bob",
    lastName: "Johnson",
    headline: "UI/UX Designer with very long headline that will be truncated",
    profilePicture: "bob.jpg",
  },
];

// Helper to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("DropdownUsers Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render anything when users array is empty", () => {
    // Mock axios to return empty array
    axiosInstance.get.mockResolvedValue({ data: [] });

    const { container } = renderWithRouter(
      <DropdownUsers name="test" onSelect={() => {}} />,
    );

    // The component should not render any visible elements
    expect(container.firstChild).toBeNull();
  });

  it("fetches and renders users when name prop has value", async () => {
    // Mock axios to return our test users
    axiosInstance.get.mockResolvedValue({ data: mockUsers });

    renderWithRouter(<DropdownUsers name="jo" onSelect={() => {}} />);

    // Check that axios was called with correct parameters
    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/users", {
      params: {
        name: "jo",
        page: 1,
        limit: 3,
      },
    });

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("actor-header")).toHaveLength(3);
    });

    // Verify the first user's details
    expect(screen.getAllByTestId("author-name")[0]).toHaveTextContent(
      "John Doe",
    );
    expect(screen.getAllByTestId("author-bio")[0]).toHaveTextContent(
      "Software Engineer",
    );
  });

  it("clears users when name prop is empty", async () => {
    // Initially mock axios with users
    axiosInstance.get.mockResolvedValue({ data: mockUsers });

    const { rerender } = renderWithRouter(
      <DropdownUsers name="jo" onSelect={() => {}} />,
    );

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("actor-header")).toHaveLength(3);
    });

    // Now rerender with empty name
    rerender(
      <BrowserRouter>
        <DropdownUsers name="" onSelect={() => {}} />
      </BrowserRouter>,
    );

    // Users should be cleared
    expect(screen.queryByTestId("actor-header")).not.toBeInTheDocument();
  });

  it("calls onSelect with correct parameters when user is clicked", async () => {
    // Mock the onSelect function
    const mockOnSelect = vi.fn();

    // Mock axios to return our test users
    axiosInstance.get.mockResolvedValue({ data: mockUsers });

    renderWithRouter(<DropdownUsers name="jo" onSelect={mockOnSelect} />);

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("actor-header")).toHaveLength(3);
    });

    // Find all buttons
    const buttons = screen.getAllByRole("button");

    // Click the first button (John Doe)
    buttons[0].click();

    // Check that onSelect was called with correct parameters
    expect(mockOnSelect).toHaveBeenCalledWith("1", "John", "Doe");
  });

  it("truncates long headlines in user bios", async () => {
    // Mock axios to return our test users
    axiosInstance.get.mockResolvedValue({ data: mockUsers });

    renderWithRouter(<DropdownUsers name="bo" onSelect={() => {}} />);

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("actor-header")).toHaveLength(3);
    });

    // Check that the third user's headline is truncated
    const bobBio = screen.getAllByTestId("author-bio")[2];
    expect(bobBio).toHaveTextContent("UI/UX Designer with very ...");
  });

  it("handles API error gracefully", async () => {
    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock axios to reject with an error
    axiosInstance.get.mockRejectedValue(new Error("Network error"));

    renderWithRouter(<DropdownUsers name="error" onSelect={() => {}} />);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Check that error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching users:",
      expect.any(Error),
    );

    // The component should not render any users
    expect(screen.queryByTestId("actor-header")).not.toBeInTheDocument();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("passes correct props to ActorHeader", async () => {
    // Mock axios to return our test users
    axiosInstance.get.mockResolvedValue({ data: mockUsers });

    renderWithRouter(<DropdownUsers name="jo" onSelect={() => {}} />);

    // Wait for users to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("actor-header")).toHaveLength(3);
    });

    // Check props passed to first ActorHeader
    expect(screen.getAllByTestId("author-id")[0]).toHaveTextContent("user1");
    expect(screen.getAllByTestId("author-name")[0]).toHaveTextContent(
      "John Doe",
    );
    expect(screen.getAllByTestId("author-bio")[0]).toHaveTextContent(
      "Software Engineer",
    );
    expect(screen.getAllByTestId("author-picture")[0]).toHaveTextContent(
      "john.jpg",
    );
    expect(screen.getAllByTestId("icon-size")[0]).toHaveTextContent("32");
    expect(screen.getAllByTestId("enable-link")[0]).toHaveTextContent("false");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PeopleSearch from "../../pages/Search/SearchPeople";
import { axiosInstance } from "../../apis/axios";

// Mock dependencies
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Avatar component from MUI
vi.mock("@mui/material", () => ({
  Avatar: ({ children, src, alt, sx }) => (
    <div
      className="mock-avatar"
      data-testid="profile-avatar"
      data-src={src}
      data-alt={alt}
    >
      {children}
    </div>
  ),
}));

describe("PeopleSearch", () => {
  const mockPeople = [
    {
      userId: "user1",
      firstName: "John",
      lastName: "Doe",
      profilePicture: "john-profile.jpg",
      headline: "Software Engineer at Google",
    },
    {
      userId: "user2",
      firstName: "Jane",
      lastName: "Smith",
      profilePicture: "jane-profile.jpg",
      headline: "Product Manager at Microsoft",
    },
    {
      userId: "user3",
      firstName: "Alex",
      lastName: "Johnson",
      profilePicture: null, // Test the fallback case
      headline: "Frontend Developer at LinkedIn",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful response
    axiosInstance.get.mockResolvedValue({ data: mockPeople });
  });

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <PeopleSearch searchText="developer" company="" {...props} />
      </MemoryRouter>,
    );
  };

  it("renders the component and fetches people on mount", async () => {
    renderComponent();

    // Should show loading initially
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for people to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check API call parameters
    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/users", {
      params: {
        page: 1,
        limit: 10,
        name: "developer",
      },
    });

    // Verify people are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();

    // Check results count
    expect(screen.getByText("Showing 3 results")).toBeInTheDocument();
  });

  it("displays headline information correctly", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check the displayed headlines
    expect(screen.getByText("Software Engineer at Google")).toBeInTheDocument();
    expect(
      screen.getByText("Product Manager at Microsoft"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Developer at LinkedIn"),
    ).toBeInTheDocument();
  });

  it("navigates to user profile when clicking on a person", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click on a person
    fireEvent.click(screen.getByText("John Doe"));
    expect(mockNavigate).toHaveBeenCalledWith("/users/user1");

    // Click on another person
    fireEvent.click(screen.getByText("Jane Smith"));
    expect(mockNavigate).toHaveBeenCalledWith("/users/user2");
  });

  it("includes company filter when provided", async () => {
    renderComponent({ company: "Google" });

    // Check API call includes company parameter
    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/users", {
      params: {
        page: 1,
        limit: 10,
        name: "developer",
        company: "Google",
      },
    });
  });

  it("shows empty state when no people are found", async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Load more")).not.toBeInTheDocument();
    expect(screen.queryByText("No more results")).not.toBeInTheDocument();
  });

  it("handles API error correctly", async () => {
    // Mock error response
    axiosInstance.get.mockRejectedValue(new Error("API error"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load people. Please try again."),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("handles load more functionality", async () => {
    // First page has full results (limit reached)
    const fullLimitResults = Array(10)
      .fill(null)
      .map((_, i) => ({
        userId: `user${i}`,
        firstName: `User`,
        lastName: `${i}`,
        profilePicture: `profile-${i}.jpg`,
        headline: `Headline for User ${i}`,
      }));

    axiosInstance.get.mockResolvedValueOnce({ data: fullLimitResults });

    // Second page has fewer results (no more pages)
    const secondPageResults = [mockPeople[0]];
    axiosInstance.get.mockResolvedValueOnce({ data: secondPageResults });

    renderComponent();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("User 0")).toBeInTheDocument();
    });

    // Should display "Load more" button
    const loadMoreButton = screen.getByRole("button", { name: /load more/i });
    expect(loadMoreButton).toBeInTheDocument();

    // Click load more
    fireEvent.click(loadMoreButton);

    // Should call API with page 2
    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/users", {
      params: {
        page: 2,
        limit: 10,
        name: "developer",
      },
    });

    // Wait for second page to load
    await waitFor(() => {
      // Now we should see "No more results" instead of "Load more"
      expect(screen.getByText("No more results")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  it("resets and fetches new data when search params change", async () => {
    const { rerender } = renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Clear previous API calls
    axiosInstance.get.mockClear();

    // Change props to trigger re-fetch
    rerender(
      <MemoryRouter>
        <PeopleSearch searchText="engineer" company="Microsoft" />
      </MemoryRouter>,
    );

    // Should show loading again
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Check API call was made with new params
    expect(axiosInstance.get).toHaveBeenCalledWith("/connections/users", {
      params: {
        page: 1,
        limit: 10,
        name: "engineer",
        company: "Microsoft",
      },
    });
  });

  it("uses placeholder for missing profile pictures", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });

    // Find all avatars
    const avatars = screen.getAllByTestId("profile-avatar");

    // First two should have profile picture URLs
    expect(avatars[0].getAttribute("data-src")).toBe("john-profile.jpg");
    expect(avatars[1].getAttribute("data-src")).toBe("jane-profile.jpg");

    // Alex should use placeholder
    expect(avatars[2].getAttribute("data-src")).toBe("/placeholder.svg");
  });

  it("properly combines first and last names", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check that full names are displayed correctly
    const johnAvatar = screen.getAllByTestId("profile-avatar")[0];
    expect(johnAvatar.getAttribute("data-alt")).toBe("John Doe");

    const janeAvatar = screen.getAllByTestId("profile-avatar")[1];
    expect(janeAvatar.getAttribute("data-alt")).toBe("Jane Smith");
  });

  it("loads more people when page changes", async () => {
    // Generate exactly 10 people for the first page to ensure hasMore = true
    const firstPagePeople = Array(10)
      .fill(null)
      .map((_, i) => ({
        userId: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        profilePicture: `profile-${i}.jpg`,
        headline: `Headline ${i}`,
      }));

    const secondPagePeople = [mockPeople[2]]; // Just Alex for the second page

    // First API call returns exactly 10 results to trigger hasMore = true
    axiosInstance.get.mockResolvedValueOnce({ data: firstPagePeople });
    // Second API call returns just one result
    axiosInstance.get.mockResolvedValueOnce({ data: secondPagePeople });

    renderComponent();

    // Wait for first page to load
    await waitFor(() => {
      expect(screen.getByText("First0 Last0")).toBeInTheDocument();
    });

    // Verify that we have results from the first page
    expect(screen.getByText("First9 Last9")).toBeInTheDocument();
    expect(screen.queryByText("Alex Johnson")).not.toBeInTheDocument();

    // The "Load more" button should now be visible since we have exactly 10 results
    const loadMoreButton = await screen.findByText("Load more");
    expect(loadMoreButton).toBeInTheDocument();

    // Click the load more button
    fireEvent.click(loadMoreButton);

    // Wait for Alex to appear after second page loads
    await waitFor(() => {
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });

    // Make sure we still have the original people too
    expect(screen.getByText("First0 Last0")).toBeInTheDocument();
    expect(screen.getByText("First9 Last9")).toBeInTheDocument();
  });
});

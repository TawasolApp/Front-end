import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import ReactionsModal from "../../../../../pages/Feed/MainFeed/FeedPosts/ReactionModal/ReactionsModal";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("@mui/icons-material/Close", () => ({
  default: (props) => (
    <span
      data-testid="close-icon"
      onClick={props.onClick}
      className={props.className}
    >
      CloseIcon
    </span>
  ),
}));

vi.mock("@mui/icons-material/ArrowDropDown", () => ({
  default: () => (
    <span data-testid="arrow-dropdown-icon">ArrowDropDownIcon</span>
  ),
}));

// Mock reactionIcons
vi.mock("../../../../../pages/Feed/GenericComponents/reactionIcons", () => ({
  default: {
    Like: {
      Icon: (props) => {
        // Use different testIds depending on the icon size
        // Icons in tabs use w-6 h-6, reaction indicators use w-4 h-4
        const isTabIcon = props.className?.includes("w-6");
        return (
          <span
            data-testid={isTabIcon ? "tab-like-icon" : "reaction-like-icon"}
            className={props.className}
            style={props.style}
          >
            LikeIcon
          </span>
        );
      },
      color: "blue",
      label: "Like",
    },
    Love: {
      Icon: (props) => {
        const isTabIcon = props.className?.includes("w-6");
        return (
          <span
            data-testid={isTabIcon ? "tab-love-icon" : "reaction-love-icon"}
            className={props.className}
            style={props.style}
          >
            LoveIcon
          </span>
        );
      },
      color: "red",
      label: "Love",
    },
    Insightful: {
      Icon: (props) => {
        const isTabIcon = props.className?.includes("w-6");
        return (
          <span
            data-testid={
              isTabIcon ? "tab-insightful-icon" : "reaction-insightful-icon"
            }
            className={props.className}
            style={props.style}
          >
            InsightfulIcon
          </span>
        );
      },
      color: "green",
      label: "Insightful",
    },
    Celebrate: {
      Icon: (props) => {
        const isTabIcon = props.className?.includes("w-6");
        return (
          <span
            data-testid={
              isTabIcon ? "tab-celebrate-icon" : "reaction-celebrate-icon"
            }
            className={props.className}
            style={props.style}
          >
            CelebrateIcon
          </span>
        );
      },
      color: "yellow",
      label: "Celebrate",
    },
  },
}));

// Mock DropdownMenu
vi.mock("../../../../../pages/Feed/GenericComponents/DropdownMenu", () => ({
  default: ({ children, menuItems, position }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      {children}
      <div data-testid="dropdown-menu-items">
        {menuItems.map((item, index) => (
          <button
            key={index}
            data-testid={`dropdown-item-${index}`}
            onClick={item.onClick}
          >
            {item.text}
            {item.icon && <item.icon />}
          </button>
        ))}
      </div>
    </div>
  ),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock axios
vi.mock("../../../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

import { axiosInstance } from "../../../../../apis/axios";

// Helper function to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ReactionsModal Component", () => {
  const mockSetShowLikes = vi.fn();
  const defaultProps = {
    API_URL: "/api/reactions",
    setShowLikes: mockSetShowLikes,
    reactCounts: {
      Like: 5,
      Love: 3,
      Insightful: 2,
      Celebrate: 1,
    },
  };

  // Mock reaction data
  const mockReactions = [
    {
      likeId: "1",
      authorId: "user1",
      authorName: "John Doe",
      authorBio: "Software Engineer",
      authorPicture: "/john.jpg",
      type: "Like",
    },
    {
      likeId: "2",
      authorId: "user2",
      authorName: "Jane Smith",
      authorBio: "Product Manager",
      authorPicture: "/jane.jpg",
      type: "Love",
    },
    {
      likeId: "3",
      authorId: "user3",
      authorName: "Bob Johnson",
      authorBio: "Designer",
      authorPicture: "/bob.jpg",
      type: "Insightful",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for axios
    axiosInstance.get.mockResolvedValue({ data: mockReactions });
  });

  it("renders the modal with correct title and structure", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Check the title
    expect(screen.getByText("Reactions")).toBeInTheDocument();

    // Check the close button
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });
  });

  it("displays the correct tabs based on reactCounts", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Check "All" tab exists with correct count (11)
    const allTab = screen.getByText("All");
    expect(allTab).toBeInTheDocument();
    expect(allTab.closest("button").textContent).toContain("11");

    // Check at least one reaction type tab exists
    expect(screen.getByText("5")).toBeInTheDocument(); // Like count

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });
  });

  it("closes the modal when clicking close button", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Click the close icon
    fireEvent.click(screen.getByTestId("close-icon"));

    // Verify setShowLikes was called
    expect(mockSetShowLikes).toHaveBeenCalled();
  });

  it("renders reaction items correctly when data is loaded", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Wait for the data to load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/api/reactions", {
        params: {
          page: 1,
          type: "All",
        },
      });
    });

    // Check the first user is displayed
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();

      // Check the correct icon is shown for the Like reaction
      // Now using the reaction-specific testId
      expect(screen.getByTestId("reaction-like-icon")).toBeInTheDocument();
    });
  });

  it("changes tab when clicking on a reaction type tab", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Wait for initial data load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Reset axios mock to return filtered data for "Like" reactions
    axiosInstance.get.mockResolvedValue({
      data: mockReactions.filter((r) => r.type === "Like"),
    });

    // Click on the Like tab (identified by its count "5")
    const likeTab = screen.getByText("5").closest("button");
    fireEvent.click(likeTab);

    // Verify the API was called with the correct type
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/api/reactions", {
        params: {
          page: 1,
          type: "Like",
        },
      });
    });
  });

  it("handles pagination through intersection observer", async () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Wait for initial data load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/api/reactions", {
        params: {
          page: 1,
          type: "All",
        },
      });
    });

    // Get the mock implementation of IntersectionObserver
    const [observerCallback] = mockIntersectionObserver.mock.calls[0];

    // Simulate the intersection observer firing (element becomes visible)
    observerCallback([{ isIntersecting: true }]);

    // Verify the API was called for page 2
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/api/reactions", {
        params: {
          page: 2,
          type: "All",
        },
      });
    });
  });

  it("shows empty state when no reactions are returned", async () => {
    // Mock empty response
    axiosInstance.get.mockResolvedValue({ data: [] });

    renderWithRouter(<ReactionsModal {...defaultProps} />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Check for the empty state message
    await waitFor(() => {
      expect(screen.getByText("No reactions found")).toBeInTheDocument();
    });
  });

  it('shows "More" dropdown when there are more than 4 reaction types', async () => {
    // Create props with many reaction types
    const manyReactionsProps = {
      ...defaultProps,
      reactCounts: {
        Like: 10,
        Love: 8,
        Insightful: 6,
        Celebrate: 5,
        Support: 4,
        Curious: 3,
      },
    };

    renderWithRouter(<ReactionsModal {...manyReactionsProps} />);

    // Verify "More" dropdown is displayed
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("processes reactCounts correctly and calculates total", () => {
    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // The "All" tab should show the total count (5+3+2+1=11)
    const allTabCount = screen.getAllByText("11")[0];
    expect(allTabCount).toBeInTheDocument();
  });

  it("handles error when fetching reactions", async () => {
    // Mock a rejected promise to simulate an error
    axiosInstance.get.mockRejectedValue(new Error("Network error"));

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(<ReactionsModal {...defaultProps} />);

    // Wait for the API call to complete (and error)
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching reactions:",
      expect.any(Error),
    );

    // Restore console.error
    consoleSpy.mockRestore();
  });
});

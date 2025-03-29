import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import LeftSideBar from "../pages/Feed/LeftSideBar/LeftSideBar";

// Mock the Material-UI icons
vi.mock("@mui/icons-material/Bookmark", () => ({
  default: () => <div data-testid="bookmark-icon">BookmarkIcon</div>,
}));

vi.mock("@mui/icons-material/Work", () => ({
  default: () => <div data-testid="work-icon">WorkIcon</div>,
}));

vi.mock("@mui/icons-material/KeyboardArrowDown", () => ({
  default: ({ className }) => (
    <div data-testid="arrow-down-icon" className={className}>
      KeyboardArrowDownIcon
    </div>
  ),
}));

vi.mock("@mui/icons-material/KeyboardArrowUp", () => ({
  default: ({ className }) => (
    <div data-testid="arrow-up-icon" className={className}>
      KeyboardArrowUpIcon
    </div>
  ),
}));

// Helper function to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("LeftSideBar Component", () => {
  // Mock window.innerWidth for responsive tests
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });

    vi.restoreAllMocks();
  });

  // Set window size before component renders
  const mockWindowSize = (width) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it("renders user profile information correctly", () => {
    renderWithRouter(<LeftSideBar />);

    expect(screen.getByText("Mohamed Sobh")).toBeInTheDocument();
    expect(
      screen.getByText("Computer Engineering Student at Cairo University"),
    ).toBeInTheDocument();

    const profileImage = screen.getByAltText("Mohamed Sobh");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage.tagName).toBe("IMG");
  });

  it("contains links to user profile and saved items", () => {
    const { container } = renderWithRouter(<LeftSideBar />);

    // Check for profile link
    const profileLink = container.querySelector('a[href="/users/mohsobh"]');
    expect(profileLink).toBeInTheDocument();

    // Check for saved items link
    const savedItemsLink = container.querySelector(
      'a[href="/my-items/saved-posts"]',
    );
    expect(savedItemsLink).toBeInTheDocument();
  });

  it("shows all menu items in desktop mode (width >= 768px)", () => {
    mockWindowSize(1024); // Desktop width
    renderWithRouter(<LeftSideBar />);

    expect(screen.getByText("Try Premium for EGP0")).toBeInTheDocument();
    expect(screen.getByText("Saved items")).toBeInTheDocument();

    // Show more/less button should not be visible in desktop mode
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
    expect(screen.queryByText("Show less")).not.toBeInTheDocument();
  });

  it("hides additional items by default in mobile mode (width < 768px)", () => {
    // Set mobile width before rendering component
    mockWindowSize(500);

    const { container } = renderWithRouter(<LeftSideBar />);

    // Get the container div that holds the menu items
    const menuItemsContainer = container.querySelector('div[class*="py-2"]');

    // It should have the "hidden" class when in mobile mode
    expect(menuItemsContainer.className).toContain("hidden");
    expect(menuItemsContainer.className).not.toContain("block");

    // Show more button should be visible
    expect(screen.getByText("Show more")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-down-icon")).toBeInTheDocument();
  });

  it('toggles additional items when "Show more" is clicked in mobile mode', () => {
    // Set mobile width before rendering component
    mockWindowSize(500);

    const { container } = renderWithRouter(<LeftSideBar />);

    // Get the container div that holds the menu items
    const menuItemsContainer = container.querySelector('div[class*="py-2"]');

    // Initially it should have the "hidden" class when in mobile mode
    expect(menuItemsContainer.className).toContain("hidden");

    // Click "Show more"
    fireEvent.click(screen.getByText("Show more").closest("button"));

    // Now it should have "block" class and not "hidden"
    expect(menuItemsContainer.className).toContain("block");
    expect(menuItemsContainer.className).not.toContain("hidden");

    // Items should be visible
    expect(screen.getByText("Try Premium for EGP0")).toBeInTheDocument();
    expect(screen.getByText("Saved items")).toBeInTheDocument();

    // Button should now say "Show less"
    expect(screen.getByText("Show less")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-up-icon")).toBeInTheDocument();

    // Click "Show less"
    fireEvent.click(screen.getByText("Show less").closest("button"));

    // Container should have "hidden" class again
    expect(menuItemsContainer.className).toContain("hidden");
    expect(menuItemsContainer.className).not.toContain("block");
  });

  it("registers resize event listener on mount and removes on unmount", () => {
    const { unmount } = renderWithRouter(<LeftSideBar />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("displays the correct background image", () => {
    const { container } = renderWithRouter(<LeftSideBar />);

    const backgroundDiv = container.querySelector(".h-20.bg-cover");
    expect(backgroundDiv).toBeInTheDocument();
    expect(backgroundDiv.style.backgroundImage).toContain(
      "profile-displaybackgroundimage-shrink",
    );
  });
});

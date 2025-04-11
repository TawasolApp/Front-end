import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import RepostButton from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Activities/RepostButton";

// Mock dependencies
vi.mock("@mui/icons-material/Repeat", () => ({
  default: (props) => (
    <span data-testid="repeat-icon" className={props.className}>
      RepeatIcon
    </span>
  ),
}));

vi.mock("@mui/icons-material/BorderColor", () => ({
  default: () => <span data-testid="border-color-icon">BorderColorIcon</span>,
}));

vi.mock("../../../../../../pages/Feed/GenericComponents/DropdownMenu", () => ({
  default: ({ children, menuItems, position }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      {children}
      <div data-testid="dropdown-menu-items">
        {menuItems.map((item, index) => (
          <button
            key={index}
            data-testid={`menu-item-${index}`}
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

vi.mock("../../../../../../pages/Feed/MainFeed/SharePost/TextModal", () => ({
  default: (props) => (
    <div data-testid="text-modal">
      <button data-testid="close-modal" onClick={() => props.setIsModalOpen()}>
        Close
      </button>
      <button
        data-testid="submit-modal"
        onClick={() =>
          props.handleSubmitFunction("test text", [], "public", [])
        }
      >
        Submit
      </button>
    </div>
  ),
}));

vi.mock("@mui/icons-material/Repeat", () => ({
  default: (props) => (
    <span data-testid="main-repeat-icon" className={props.className}>
      RepeatIcon
    </span>
  ),
}));

// Mock the PostContext
const mockHandleSharePost = vi.fn();

// Follow the same pattern as in Comment.test.jsx
vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => {
  // Create an actual context object to use in tests
  const React = require("react");
  const actualContext = React.createContext(null);

  return {
    PostContext: actualContext,
    usePost: () => ({
      currentAuthorName: "Test User",
      currentAuthorPicture: "test-pic.jpg",
      post: {
        id: "post123",
        visibility: "public",
      },
      handleSharePost: mockHandleSharePost,
    }),
    PostProvider: ({ children }) => {
      return (
        <actualContext.Provider
          value={{
            currentAuthorName: "Test User",
            currentAuthorPicture: "test-pic.jpg",
            post: {
              id: "post123",
              visibility: "public",
            },
            handleSharePost: mockHandleSharePost,
          }}
        >
          {children}
        </actualContext.Provider>
      );
    },
  };
});

// Import PostProvider after mocking
import { PostProvider } from "../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Custom render function that wraps components with PostProvider
const customRender = (ui, options) => {
  return render(<PostProvider>{ui}</PostProvider>, options);
};

describe("RepostButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dropdown menu", () => {
    customRender(<RepostButton />);

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-menu-items")).toBeInTheDocument();

    // Verify both menu items are rendered
    expect(screen.getByTestId("menu-item-0")).toHaveTextContent(
      "Repost with your thoughts",
    );
    expect(screen.getByTestId("menu-item-1")).toHaveTextContent("Repost");
  });

  it("does not show TextModal by default", () => {
    customRender(<RepostButton />);

    expect(screen.queryByTestId("text-modal")).not.toBeInTheDocument();
  });

  it('opens TextModal when "Repost with your thoughts" is clicked', () => {
    customRender(<RepostButton />);

    // Click the "Repost with your thoughts" option
    fireEvent.click(screen.getByTestId("menu-item-0"));

    // TextModal should now be visible
    expect(screen.getByTestId("text-modal")).toBeInTheDocument();
  });

  it('calls handleSharePost directly when "Repost" is clicked', () => {
    customRender(<RepostButton />);

    // Click the "Repost" option
    fireEvent.click(screen.getByTestId("menu-item-1"));

    // Check that handleSharePost was called with the correct parameters
    expect(mockHandleSharePost).toHaveBeenCalledWith(
      "dummy data",
      [],
      "public",
      [],
      "post123",
      true,
    );
  });

  it("closes the TextModal when close button is clicked", () => {
    customRender(<RepostButton />);

    // Open the modal first
    fireEvent.click(screen.getByTestId("menu-item-0"));
    expect(screen.getByTestId("text-modal")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByTestId("close-modal"));

    // TextModal should no longer be visible
    expect(screen.queryByTestId("text-modal")).not.toBeInTheDocument();
  });

  it("calls handleSharePost with correct parameters when submitting the modal", () => {
    customRender(<RepostButton />);

    // Open the modal first
    fireEvent.click(screen.getByTestId("menu-item-0"));

    // Submit the modal
    fireEvent.click(screen.getByTestId("submit-modal"));

    // Check that handleSharePost was called with the correct parameters
    expect(mockHandleSharePost).toHaveBeenCalledWith(
      "test text",
      [],
      "public",
      [],
      "post123",
      false,
    );
  });
});

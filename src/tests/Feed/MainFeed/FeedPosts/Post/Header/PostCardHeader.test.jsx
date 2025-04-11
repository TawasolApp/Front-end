import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostCardHeader from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Header/PostCardHeader";
import { usePost } from "../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Mock dependencies
vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => ({
  usePost: vi.fn(),
}));

// Mock MUI components
vi.mock("@mui/icons-material/MoreHoriz", () => ({
  default: () => <div data-testid="more-icon">More Icon</div>,
}));

vi.mock("@mui/icons-material/Close", () => ({
  default: ({ onClick, className, sx }) => (
    <div data-testid="close-icon" onClick={onClick} className={className}>
      Close Icon
    </div>
  ),
}));

// Mock the ActorHeader component
vi.mock("../../../../../../pages/Feed/GenericComponents/ActorHeader", () => ({
  default: ({
    authorId,
    authorName,
    authorPicture,
    authorBio,
    authorType,
    timestamp,
    visibility,
    isEdited,
  }) => (
    <div data-testid="actor-header">
      <div data-testid="author-name">{authorName}</div>
      <div data-testid="author-id">{authorId}</div>
      <div data-testid="author-type">{authorType}</div>
      {isEdited && <div data-testid="is-edited">Edited</div>}
    </div>
  ),
}));

// Mock the DropdownMenu component
vi.mock("../../../../../../pages/Feed/GenericComponents/DropdownMenu", () => ({
  default: ({ menuItems, position, children }) => (
    <div data-testid="dropdown-menu" data-position={position}>
      {children}
      <div data-testid="menu-items">
        {menuItems &&
          menuItems.map((item, index) => (
            <button
              key={index}
              data-testid={`menu-item-${index}`}
              onClick={item.onClick}
            >
              {item.text}
            </button>
          ))}
      </div>
    </div>
  ),
}));

describe("PostCardHeader Component", () => {
  const mockHandleClosePostModal = vi.fn();
  const mockMenuItems = [
    { text: "Edit Post", onClick: vi.fn() },
    { text: "Delete Post", onClick: vi.fn() },
  ];

  const defaultPost = {
    authorId: "user123",
    authorName: "John Doe",
    authorPicture: "profile.jpg",
    authorBio: "Software Engineer",
    authorType: "Individual",
    timestamp: "2023-01-01",
    visibility: "public",
    isEdited: false,
    repostedComponents: {
      authorId: "repost123",
      authorName: "Jane Smith",
      authorPicture: "repost-profile.jpg",
      authorBio: "Designer",
      authorType: "Company",
      timestamp: "2023-01-02",
      visibility: "network",
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    usePost.mockReturnValue({ post: defaultPost });
  });

  it("renders regular post header with ActorHeader", () => {
    render(<PostCardHeader menuItems={mockMenuItems} />);

    const actorHeader = screen.getByTestId("actor-header");
    expect(actorHeader).toBeInTheDocument();

    const authorName = screen.getByTestId("author-name");
    expect(authorName).toHaveTextContent(defaultPost.authorName);

    const authorId = screen.getByTestId("author-id");
    expect(authorId).toHaveTextContent(defaultPost.authorId);

    expect(screen.queryByTestId("is-edited")).not.toBeInTheDocument();
  });

  it("renders reposted content header when noRightItems is true", () => {
    render(<PostCardHeader noRightItems={true} />);

    const actorHeader = screen.getByTestId("actor-header");
    expect(actorHeader).toBeInTheDocument();

    const authorName = screen.getByTestId("author-name");
    expect(authorName).toHaveTextContent(
      defaultPost.repostedComponents.authorName,
    );

    const authorId = screen.getByTestId("author-id");
    expect(authorId).toHaveTextContent(defaultPost.repostedComponents.authorId);
  });

  it("renders edited indicator when post is edited", () => {
    usePost.mockReturnValue({
      post: { ...defaultPost, isEdited: true },
    });

    render(<PostCardHeader menuItems={mockMenuItems} />);

    const editedIndicator = screen.getByTestId("is-edited");
    expect(editedIndicator).toBeInTheDocument();
  });

  it("renders the close icon in modal mode", () => {
    render(
      <PostCardHeader
        menuItems={mockMenuItems}
        modal={true}
        handleClosePostModal={mockHandleClosePostModal}
      />,
    );

    const closeIcon = screen.getByTestId("close-icon");
    expect(closeIcon).toBeInTheDocument();

    fireEvent.click(closeIcon);
    expect(mockHandleClosePostModal).toHaveBeenCalledTimes(1);
  });

  it("renders the dropdown menu when not in modal mode", () => {
    render(<PostCardHeader menuItems={mockMenuItems} />);

    const dropdownMenu = screen.getByTestId("dropdown-menu");
    expect(dropdownMenu).toBeInTheDocument();
    expect(dropdownMenu).toHaveAttribute("data-position", "right-0");

    const menuItems = screen.getByTestId("menu-items");
    expect(menuItems).toBeInTheDocument();
  });

  it("clicking menu items triggers corresponding handlers", () => {
    render(<PostCardHeader menuItems={mockMenuItems} />);

    const editMenuItem = screen.getByTestId("menu-item-0");
    const deleteMenuItem = screen.getByTestId("menu-item-1");

    fireEvent.click(editMenuItem);
    expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteMenuItem);
    expect(mockMenuItems[1].onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render menu items when noRightItems is true", () => {
    render(<PostCardHeader noRightItems={true} />);

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
  });

  it("passes correct props to ActorHeader for regular post", () => {
    render(<PostCardHeader menuItems={mockMenuItems} />);

    const authorType = screen.getByTestId("author-type");
    expect(authorType).toHaveTextContent(defaultPost.authorType);
  });

  it("passes correct props to ActorHeader for reposted content", () => {
    render(<PostCardHeader noRightItems={true} />);

    const authorType = screen.getByTestId("author-type");
    expect(authorType).toHaveTextContent(
      defaultPost.repostedComponents.authorType,
    );
  });
});

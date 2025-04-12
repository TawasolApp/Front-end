import { render, screen, fireEvent } from "@testing-library/react";
import ConnectionCard from "../pages/MyNetwork/Connections/ConnectionCard";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("ConnectionCard", () => {
  const mockProps = {
    imageUrl: "https://via.placeholder.com/150",
    firstName: "John",
    lastName: "Doe",
    experience: "Software Engineer at Google",
    connectionDate: "Connected 2 weeks ago",
    onRemove: vi.fn(),
    userId: "user123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with props", () => {
    render(<ConnectionCard {...mockProps} />);

    // Check if all content is rendered
    expect(
      screen.getByText(`${mockProps.firstName} ${mockProps.lastName}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockProps.experience)).toBeInTheDocument();
    expect(screen.getByText(mockProps.connectionDate)).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByTestId("menu-button")).toBeInTheDocument();
  });

  it("uses default profile picture when imageUrl is not provided", () => {
    const propsWithoutImage = { ...mockProps, imageUrl: null };
    render(<ConnectionCard {...propsWithoutImage} />);

    // Check if image element exists with alt text
    const image = screen.getByAltText(
      `${mockProps.firstName} ${mockProps.lastName}`,
    );
    expect(image).toBeInTheDocument();
    // The default image URL is imported from a local file so we can't check the exact src value
    expect(image.src).not.toContain("https://via.placeholder.com/150");
  });

  it("navigates to user profile when name is clicked", () => {
    render(<ConnectionCard {...mockProps} />);

    // Find and click on the name
    const nameElement = screen.getByText(
      `${mockProps.firstName} ${mockProps.lastName}`,
    );
    fireEvent.click(nameElement);

    // Check if navigation was triggered with correct route
    expect(mockNavigate).toHaveBeenCalledWith(`/users/${mockProps.userId}`);
  });

  it("opens and closes the menu on click", () => {
    render(<ConnectionCard {...mockProps} />);

    // Check menu is initially closed
    expect(screen.queryByText(/remove connection/i)).not.toBeInTheDocument();

    // Open menu
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Check menu is open
    expect(screen.getByText(/remove connection/i)).toBeInTheDocument();

    // Close menu
    fireEvent.click(menuButton);

    // Check menu is closed
    expect(screen.queryByText(/remove connection/i)).not.toBeInTheDocument();
  });

  it("closes menu when clicking outside", () => {
    // Create a container div to simulate outside clicks
    const { container } = render(
      <div data-testid="outside-area">
        <ConnectionCard {...mockProps} />
      </div>,
    );

    // Open menu
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Check menu is open
    expect(screen.getByText(/remove connection/i)).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside-area"));

    // Check menu closed
    expect(screen.queryByText(/remove connection/i)).not.toBeInTheDocument();
  });

  it("opens and closes the confirmation modal", () => {
    render(<ConnectionCard {...mockProps} />);

    // Open menu first
    fireEvent.click(screen.getByTestId("menu-button"));

    // Click on Remove Connection
    const removeOption = screen.getByText(/remove connection/i);
    fireEvent.click(removeOption);

    // Verify confirmation modal is open
    const modalText = screen.getByText(/Are you sure you want to remove/i);
    expect(modalText).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove$/i }),
    ).toBeInTheDocument();

    // Close modal using cancel button
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Verify modal is closed
    expect(
      screen.queryByText(/Are you sure you want to remove/i),
    ).not.toBeInTheDocument();
  });

  it("closes confirmation modal with X button", () => {
    render(<ConnectionCard {...mockProps} />);

    // Open menu and confirmation
    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));

    // Find and click X button (it's an SVG, so we use the parent button)
    const xButton = screen
      .getByText(/Remove Connection/)
      .parentElement.querySelector("button");
    fireEvent.click(xButton);

    // Verify modal is closed
    expect(
      screen.queryByText(/Are you sure you want to remove/i),
    ).not.toBeInTheDocument();
  });

  it("triggers onRemove when 'Remove' button is clicked in the modal", () => {
    render(<ConnectionCard {...mockProps} />);

    // Open menu and confirmation
    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));

    // Click Remove button
    fireEvent.click(screen.getByRole("button", { name: /remove$/i }));

    // Check if onRemove was called
    expect(mockProps.onRemove).toHaveBeenCalledTimes(1);

    // Check if modal was closed
    expect(
      screen.queryByText(/Are you sure you want to remove/i),
    ).not.toBeInTheDocument();
  });

  it("correctly displays full name in confirmation modal", () => {
    render(<ConnectionCard {...mockProps} />);

    // Open menu and confirmation
    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));

    // Check if the full name is in the confirmation text
    const modalText = screen.getByText(
      new RegExp(
        `Are you sure you want to remove ${mockProps.firstName} ${mockProps.lastName} as a connection`,
        "i",
      ),
    );
    expect(modalText).toBeInTheDocument();
  });
});

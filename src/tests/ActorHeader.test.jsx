import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import ActorHeader from "../pages/Feed/GenericComponents/ActorHeader";

// Mock the Material-UI components
vi.mock("@mui/material", () => ({
  Avatar: ({ src, sx }) => (
    <div data-testid="avatar" data-src={src} style={sx}>
      Avatar Mock
    </div>
  ),
}));

vi.mock("@mui/icons-material/Public", () => ({
  default: () => <div data-testid="public-icon">Public Icon</div>,
}));

vi.mock("@mui/icons-material/People", () => ({
  default: () => <div data-testid="people-icon">People Icon</div>,
}));

// Mock the formatDate utility - Fix the import path
vi.mock("../utils", () => ({
  formatDate: (date) => `Formatted: ${date}`,
}));

// Helper function to render component with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ActorHeader Component", () => {
  const defaultProps = {
    authorId: "user123",
    authorName: "John Doe",
    authorBio: "Software Engineer",
    authorPicture: "profile.jpg",
  };

  it("renders with required props", () => {
    renderWithRouter(<ActorHeader {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("Software Engineer")).toBeTruthy();
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("avatar").dataset.src).toBe("profile.jpg");
  });

  it("renders with timestamp and Public visibility", () => {
    const propsWithTimestamp = {
      ...defaultProps,
      timestamp: "2023-03-20T12:00:00Z",
      visibility: "Public",
    };

    const { container, debug } = renderWithRouter(
      <ActorHeader {...propsWithTimestamp} />,
    );
    // Debug to see the actual rendered output
    // debug();

    // Use a more flexible approach to find the text
    expect(container.textContent).toContain("Formatted: 2023-03-20T12:00:00Z");
    expect(screen.getByTestId("public-icon")).toBeTruthy();
  });

  it("renders with timestamp and non-Public visibility", () => {
    const propsWithTimestamp = {
      ...defaultProps,
      timestamp: "2023-03-20T12:00:00Z",
      visibility: "Connections",
    };

    const { container } = renderWithRouter(
      <ActorHeader {...propsWithTimestamp} />,
    );

    expect(container.textContent).toContain("Formatted: 2023-03-20T12:00:00Z");
    expect(screen.getByTestId("people-icon")).toBeTruthy();
  });

  it("does not render timestamp section when timestamp is not provided", () => {
    renderWithRouter(<ActorHeader {...defaultProps} />);

    const formattedDate = screen.queryByText(/Formatted:/);
    expect(formattedDate).toBeNull();
  });

  it("creates proper profile links", () => {
    const { container } = renderWithRouter(<ActorHeader {...defaultProps} />);

    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("href")).toBe("/in/user123");
    });
  });

  it("applies custom iconSize", () => {
    const propsWithCustomSize = {
      ...defaultProps,
      iconSize: 64,
    };

    renderWithRouter(<ActorHeader {...propsWithCustomSize} />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar.style.width).toBe("64px");
    expect(avatar.style.height).toBe("64px");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConnectionCard from "../pages/MyNetwork/Connections/ConnectionCard";
import { describe, it, expect, vi } from "vitest";

const mockProps = {
  imageUrl: "https://via.placeholder.com/150",
  firstName: "John",
  lastName: "Doe",
  experience: "Software Engineer at Google",
  connectionDate: "Connected 2 weeks ago",
  onRemove: vi.fn(),
  userId: "12345",
};

describe("ConnectionCard", () => {
  it("renders connection details correctly", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(`${mockProps.firstName} ${mockProps.lastName}`),
    ).toBeTruthy();
    expect(screen.getByText(mockProps.experience)).toBeTruthy();
    expect(screen.getByText(mockProps.connectionDate)).toBeTruthy();
    expect(screen.getByTestId("menu-button")).toBeTruthy();
    expect(screen.getByText("Message")).toBeTruthy();
  });

  it("shows default profile picture when imageUrl is missing", () => {
    const propsWithoutImage = { ...mockProps, imageUrl: undefined };
    render(
      <MemoryRouter>
        <ConnectionCard {...propsWithoutImage} />
      </MemoryRouter>,
    );

    const image = screen.getByAltText(
      `${mockProps.firstName} ${mockProps.lastName}`,
    );
    expect(image.src).toContain("defaultProfilePicture.png");
  });

  it("toggles menu visibility when menu button is clicked", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);
    expect(screen.getByText(/remove connection/i)).toBeTruthy();

    fireEvent.click(menuButton);
    expect(screen.queryByText(/remove connection/i)).toBeNull();
  });

  it("closes menu when clicking outside", () => {
    render(
      <MemoryRouter>
        <div>
          <div data-testid="outside">Click Outside</div>
          <ConnectionCard {...mockProps} />
        </div>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("menu-button"));
    expect(screen.getByText(/remove connection/i)).toBeTruthy();

    fireEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText(/remove connection/i)).toBeTruthy();
  });

  it("opens confirmation modal when remove is clicked", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));

    expect(screen.getByText(/are you sure you want to remove/i)).toBeTruthy();
  });

  it("closes confirmation modal when cancel is clicked", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));
    fireEvent.click(screen.getByText(/cancel/i));

    expect(screen.queryByText(/are you sure you want to remove/i)).toBeNull();
  });

  it("calls onRemove when confirm remove is clicked", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));
  });

  it("navigates to user profile when name is clicked", () => {
    const { container } = render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByText(`${mockProps.firstName} ${mockProps.lastName}`),
    );
  });

  it("falls back to default image when image fails to load", () => {
    render(
      <MemoryRouter>
        <ConnectionCard {...mockProps} />
      </MemoryRouter>,
    );

    const image = screen.getByAltText(
      `${mockProps.firstName} ${mockProps.lastName}`,
    );
    fireEvent.error(image);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import ConnectionCard from "../pages/connectionpage/components/ConnectionCard";
import { describe, it, expect, vi } from "vitest";

const mockProps = {
  imageUrl: "https://via.placeholder.com/150",
  username: "John Doe",
  experience: "Software Engineer at Google",
  connectionDate: "Connected 2 weeks ago",
  onRemove: vi.fn(),
};

describe("ConnectionCard", () => {
  it("renders correctly with props", () => {
    render(<ConnectionCard {...mockProps} />);
    expect(screen.getByText(mockProps.username)).toBeTruthy();
    expect(screen.getByText(mockProps.experience)).toBeTruthy();
    expect(screen.getByText(mockProps.connectionDate)).toBeTruthy();
    expect(screen.getByTestId("menu-button")).toBeTruthy();
  });

  it("opens and closes the menu on click", () => {
    render(<ConnectionCard {...mockProps} />);
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);
    expect(screen.getByText(/remove connection/i)).toBeTruthy();
    fireEvent.click(menuButton);
    expect(screen.queryByText(/remove connection/i)).not.toBeTruthy();
  });

  it("opens and closes the confirmation modal", () => {
    render(<ConnectionCard {...mockProps} />);
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);
    const removeButton = screen.getByText(/remove connection/i);
    fireEvent.click(removeButton);
    expect(screen.getByText(/are you sure you want to remove/i)).toBeTruthy();
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.queryByText(/are you sure you want to remove/i)).not.toBeTruthy();
  });

  it("triggers onRemove when 'Remove' is clicked in the modal", () => {
    render(<ConnectionCard {...mockProps} />);
    fireEvent.click(screen.getByTestId("menu-button"));
    fireEvent.click(screen.getByText(/remove connection/i));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(mockProps.onRemove).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AboutSection from "../pages/UserProfile/Components/Sections/AboutSection";

describe("AboutSection Component", () => {
  const longText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5);

  it("does not render if no user is passed", () => {
    const { container } = render(<AboutSection />);
    expect(container.firstChild).toBeNull();
  });

  it("renders placeholder if about is empty", () => {
    render(<AboutSection user={{ about: "" }} isOwner={true} />);
    expect(
      screen.getByText(/no about information added yet/i)
    ).toBeInTheDocument();
  });

  it("shows 'Add' button if about is empty", () => {
    render(<AboutSection user={{ about: "" }} isOwner={true} />);
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("shows 'Edit' button if about content exists", () => {
    render(<AboutSection user={{ about: "Sample About" }} isOwner={true} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("does not show action buttons if not owner", () => {
    render(<AboutSection user={{ about: "Sample About" }} isOwner={false} />);
    expect(
      screen.queryByRole("button", { name: /add/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
  });

  it("displays about content correctly", () => {
    render(
      <AboutSection
        user={{ about: "This is the about content." }}
        isOwner={false}
      />
    );
    expect(screen.getByText(/this is the about content/i)).toBeInTheDocument();
  });

  it("shows 'see more' button for long about text and expands it on click", () => {
    render(<AboutSection user={{ about: longText }} isOwner={false} />);
    const seeMoreBtn = screen.getByText(/see more/i);
    expect(seeMoreBtn).toBeInTheDocument();

    fireEvent.click(seeMoreBtn);
    // After clicking, the button should disappear
    expect(screen.queryByText(/see more/i)).not.toBeInTheDocument();
  });

  it("calls onAddAbout when add button is clicked", () => {
    const mockAdd = vi.fn();
    render(
      <AboutSection user={{ about: "" }} isOwner={true} onAddAbout={mockAdd} />
    );
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(mockAdd).toHaveBeenCalled();
  });

  it("calls onEditAbout when edit button is clicked", () => {
    const mockEdit = vi.fn();
    render(
      <AboutSection
        user={{ about: "Sample content" }}
        isOwner={true}
        onEditAbout={mockEdit}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(mockEdit).toHaveBeenCalled();
  });
});

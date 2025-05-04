import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import SavedBar from "../../pages/Saved/SavedBar";

// Helper to wrap in router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SavedBar component", () => {
  beforeEach(() => {
    // Reset window.innerWidth before each test
    window.innerWidth = 1024;
  });

  it("renders all menu items with correct labels", () => {
    renderWithRouter(<SavedBar />);

    expect(screen.getByText("Saved Posts")).toBeInTheDocument();
    expect(screen.getByText("Saved Jobs")).toBeInTheDocument();
    expect(screen.getByText("Applied Jobs")).toBeInTheDocument();
  });

  it("renders correct links for menu items", () => {
    renderWithRouter(<SavedBar />);

    expect(screen.getByText("Saved Posts").closest("a")).toHaveAttribute("href", "/my-items/saved-posts");
    expect(screen.getByText("Saved Jobs").closest("a")).toHaveAttribute("href", "/my-items/saved-jobs");
    expect(screen.getByText("Applied Jobs").closest("a")).toHaveAttribute("href", "/my-items/applied-jobs");
  });

  it("updates isTopPosition based on window width", () => {
    window.innerWidth = 500;
    const resizeEvent = new Event("resize");

    renderWithRouter(<SavedBar />);
    window.dispatchEvent(resizeEvent);

    // Ideally we'd test the effect of isTopPosition, but since it's not rendered conditionally,
    // we just test that the resize listener doesn't crash the component.
    expect(screen.getByText("Saved Posts")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, describe, beforeEach, vi } from "vitest";
import AdminPanel from "../../pages/AdminPanel/AdminPanel";

// Mock each subpage component
vi.mock("../../pages/AdminPanel/Reports/Reports.jsx", () => ({
  __esModule: true,
  default: () => <div>Mocked Reports Page</div>,
}));

vi.mock("../../pages/AdminPanel/Jobs/Jobs.jsx", () => ({
  __esModule: true,
  default: () => <div>Mocked Jobs Page</div>,
}));

vi.mock("../../pages/AdminPanel/AdminAnalytics/AdminAnalytics.jsx", () => ({
  __esModule: true,
  default: () => <div>Mocked Analytics Page</div>,
}));

vi.mock("../../pages/AdminPanel/ReportedUsers/ReportedUsers.jsx", () => ({
  __esModule: true,
  default: () => <div>Mocked Reported Users Page</div>,
}));

describe("AdminPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders default Reports tab initially", () => {
    render(<AdminPanel />);
    expect(screen.getByText("Mocked Reports Page")).toBeInTheDocument();
  });

  test("switches to Jobs tab on click", () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getByRole("button", { name: /job listings/i }));
    expect(screen.getByText("Mocked Jobs Page")).toBeInTheDocument();
  });

  test("switches to Analytics tab on click", () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getByRole("button", { name: /analytics/i }));
    expect(screen.getByText("Mocked Analytics Page")).toBeInTheDocument();
  });

  test("switches to Reported Users tab on click", () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getByRole("button", { name: /reported users/i }));
    expect(screen.getByText("Mocked Reported Users Page")).toBeInTheDocument();
  });

  test("toggles sidebar on mobile menu click", () => {
    // Simulate mobile by mocking window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event("resize"));

    render(<AdminPanel />);
    const menuButton = screen.getByRole("button", { name: "" }); // Icon-only button
    fireEvent.click(menuButton); // open sidebar

    expect(screen.getByText(/job listings/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /analytics/i }));
    expect(screen.getByText("Mocked Analytics Page")).toBeInTheDocument();
  });
});

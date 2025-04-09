import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Overviewbox from "../../pages/Company/Components/HomePage/OverviewBox";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate and useParams globally
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ companyId: "test-company" }),
  };
});

// Get useOutletContext for spying
import * as router from "react-router-dom";

describe("Overviewbox", () => {
  const longOverview = "This is a long overview ".repeat(10);
  const shortOverview = "Short overview";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders overview box with title and content", () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({
      company: { overview: shortOverview },
    });

    render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText(shortOverview)).toBeInTheDocument();
    expect(screen.queryByText("See More")).not.toBeInTheDocument();
  });

  test('shows "See More" button for overflowing content', () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({
      company: { overview: longOverview },
    });

    // 👉 Add this BEFORE render
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 300;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get() {
        return 100;
      },
    });

    render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    expect(screen.getByText("See More")).toBeInTheDocument();
  });

  test("expands text on 'See More' click", () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({
      company: { overview: longOverview },
    });

    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 300;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get() {
        return 100;
      },
    });

    render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    const btn = screen.getByText("See More");
    fireEvent.click(btn);
    expect(screen.queryByText("See More")).not.toBeInTheDocument();
  });

  test('navigates to "about" page on button click', () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({
      company: { overview: shortOverview },
    });

    render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    const btn = screen.getByText("Show all details →");
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/about");
  });

  test("does not render if company is null", () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({ company: null });

    const { container } = render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders safely when overview is undefined", () => {
    vi.spyOn(router, "useOutletContext").mockReturnValue({ company: {} });

    render(
      <MemoryRouter>
        <Overviewbox />
      </MemoryRouter>
    );

    expect(screen.getByText("Show all details →")).toBeInTheDocument();
  });
});

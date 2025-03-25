import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Overviewbox from "../pages/CompanyPage/Components/Overviewbox";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate and useParams
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ companyId: "test-company" }),
  };
});

describe("Overviewbox", () => {
  const longOverview = "This is a long overview ".repeat(10); // >100 chars
  const shortOverview = "Short overview";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders overview box with title and content", () => {
    render(
      <MemoryRouter>
        <Overviewbox company={{ overview: shortOverview }} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText(shortOverview)).toBeInTheDocument();
    expect(screen.queryByText("See More")).not.toBeInTheDocument(); // Should not show for short text
  });

  test('shows "See More" button for long overview', () => {
    render(
      <MemoryRouter>
        <Overviewbox company={{ overview: longOverview }} />
      </MemoryRouter>,
    );

    expect(screen.getByText("See More")).toBeInTheDocument();
  });

  test("expands text on 'See More' click", () => {
    render(
      <MemoryRouter>
        <Overviewbox company={{ overview: longOverview }} />
      </MemoryRouter>,
    );

    const seeMoreBtn = screen.getByText("See More");
    fireEvent.click(seeMoreBtn);

    // Button disappears after expanding
    expect(screen.queryByText("See More")).not.toBeInTheDocument();
  });

  test('navigates to "about" page on button click', () => {
    render(
      <MemoryRouter>
        <Overviewbox company={{ overview: shortOverview }} />
      </MemoryRouter>,
    );

    const btn = screen.getByText("Show all details →");
    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/about");
  });
  test("does not render if company is null", () => {
    const { container } = render(
      <MemoryRouter>
        <Overviewbox company={null} />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  // test("does not show 'See More' if overview is exactly 100 chars", () => {
  //   const exact100 = "a".repeat(100);
  //   render(
  //     <MemoryRouter>
  //       <Overviewbox company={{ overview: exact100 }} />
  //     </MemoryRouter>
  //   );

  //   expect(screen.queryByText("See More")).not.toBeInTheDocument();
  //   expect(screen.getByText(exact100)).toBeInTheDocument();
  // });

  test("renders safely when overview is undefined", () => {
    render(
      <MemoryRouter>
        <Overviewbox company={{}} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("See More")).not.toBeInTheDocument();
    expect(screen.getByText("Show all details →")).toBeInTheDocument();
  });
});

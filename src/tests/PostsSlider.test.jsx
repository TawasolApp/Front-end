import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostsSlider from "../pages/companypage/components/PostsSlider";
import { describe, test, vi, beforeEach, expect } from "vitest";

// Mock posts array to prevent real import
vi.mock("../pages/companypage/components/../poststest", () => ({
  default: [
    { id: 1, content: "Post 1" },
    { id: 2, content: "Post 2" },
    { id: 3, content: "Post 3" },
    { id: 4, content: "Post 4" },
  ],
}));

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

describe("PostsSlider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders slider and posts", () => {
    render(
      <MemoryRouter>
        <PostsSlider />
      </MemoryRouter>,
    );

    // Main wrapper
    expect(screen.getByTestId("posts-slider")).toBeInTheDocument();

    // Show all button at the bottom
    expect(screen.getByText("Show all posts →")).toBeInTheDocument();

    // Title
    expect(screen.getByText("Page Posts")).toBeInTheDocument();
  });

  test("navigates to posts page when button is clicked", () => {
    render(
      <MemoryRouter>
        <PostsSlider />
      </MemoryRouter>,
    );

    const button = screen.getByText("Show all posts →");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/posts");
  });

  test("navigates to posts page from last slide button", () => {
    render(
      <MemoryRouter>
        <PostsSlider />
      </MemoryRouter>,
    );

    const lastButton = screen.getByText("Show all →");
    fireEvent.click(lastButton);

    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/posts");
  });
});
describe("PostsSlider scroll functionality", () => {
  let scrollByMock;

  beforeEach(() => {
    scrollByMock = vi.fn();
    // 🧪 Mock scrollBy on HTMLElement prototype so it works on the div
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollByMock,
    });
  });

  test("calls scrollBy with negative value when clicking left", () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>,
    );

    const leftBtn = screen.getByLabelText("scroll-left");
    fireEvent.click(leftBtn);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -350,
      behavior: "smooth",
    });
  });

  test("calls scrollBy with positive value when clicking right", () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>,
    );

    const rightBtn = screen.getByLabelText("scroll-right");
    fireEvent.click(rightBtn);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: 350,
      behavior: "smooth",
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostsSlider from "../../pages/Company/Components/Slider/PostsSlider";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { axiosInstance } from "../../apis/axios";

// Mock posts array to prevent real import
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          { id: 1, content: "Post 1", reactions: {} },
          { id: 2, content: "Post 2", reactions: {} },
          { id: 3, content: "Post 3", reactions: {} },
          { id: 4, content: "Post 4", reactions: {} },
        ],
      })
    ),
  },
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

  test("renders posts and main layout", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("posts-slider")).toBeInTheDocument();
    expect(await screen.findByText("Page Posts")).toBeInTheDocument();
    expect(await screen.findByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Show all posts →")).toBeInTheDocument();
  });

  test("navigates when footer button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>
    );

    const footerBtn = await screen.findByText("Show all posts →");
    fireEvent.click(footerBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/posts");
  });

  test("navigates when 'Show all →' inside slider is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>
    );

    const lastBtn = await screen.findByText("Show all →");
    fireEvent.click(lastBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/company/test-company/posts");
  });
});

describe("PostsSlider scrolling", () => {
  let scrollByMock;

  beforeEach(() => {
    scrollByMock = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollByMock,
    });
  });

  test("scrolls left", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>
    );

    const leftBtn = await screen.findByLabelText("scroll-left");
    fireEvent.click(leftBtn);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -350,
      behavior: "smooth",
    });
  });

  test("scrolls right", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/home"]}>
        <Routes>
          <Route path="/company/:companyId/home" element={<PostsSlider />} />
        </Routes>
      </MemoryRouter>
    );

    const rightBtn = await screen.findByLabelText("scroll-right");
    fireEvent.click(rightBtn);

    expect(scrollByMock).toHaveBeenCalledWith({
      left: 350,
      behavior: "smooth",
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import PostsPage from "../../pages/Company/Components/Pages/PostsPage";
import { axiosInstance } from "../../apis/axios";

// Mock axios
vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockCompany = {
  companyId: "test-company",
  name: "Test Co",
  logo: "https://example.com/logo.png",
};

const mockPosts = [
  {
    id: 1,
    text: "Sample post",
    mediaType: "image",
    media: "https://example.com/image.jpg",
    companyName: "Test Co",
    followers: 200,
    timeAgo: "1h",
    edited: false,
    logo: "https://example.com/logo.png",
    reactions: {},
  },
];

function TestWrapper() {
  const location = useLocation();
  return (
    <>
      <PostsPage />
      <div data-testid="current-url">{location.search}</div>
    </>
  );
}

describe("PostsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.get
      .mockResolvedValueOnce({ data: mockCompany }) // get company
      .mockResolvedValueOnce({ data: mockPosts }); // get posts
  });

  test("renders posts and company data", async () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/posts"]}>
        <Routes>
          <Route path="/company/:companyId/posts" element={<TestWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for a known button that only exists in PostCard (engagement section)
    await waitFor(() => {
      expect(screen.getByText("Like")).toBeInTheDocument();
    });

    // Also check one of the filter buttons
    expect(screen.getByRole("button", { name: "Images" })).toBeInTheDocument();
  });

  // test("updates URL query on filter click", async () => {
  //   render(
  //     <MemoryRouter initialEntries={["/company/test-company/posts"]}>
  //       <Routes>
  //         <Route path="/company/:companyId/posts" element={<TestWrapper />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   // More flexible matcher to find post text even if split
  //   await screen.findByText((text, node) =>
  //     node?.textContent?.includes("Sample post")
  //   );

  //   const filters = ["All", "Images", "Videos", "Articles", "Documents"];
  //   for (const filter of filters) {
  //     const button = screen.getByRole("button", { name: filter });
  //     fireEvent.click(button);
  //     await waitFor(() => {
  //       const currentUrl = screen.getByTestId("current-url");
  //       expect(currentUrl.textContent).toContain(`feedView=${filter}`);
  //     });
  //   }
  // });
});

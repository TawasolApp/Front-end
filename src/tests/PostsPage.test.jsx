import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import PostsPage from "../pages/CompanyPage/Components/PostsPage";
import { describe, test, expect } from "vitest";

// Wrapper to expose the URL search params
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
  test("updates URL query on filter click", () => {
    render(
      <MemoryRouter initialEntries={["/company/test-company/posts"]}>
        <Routes>
          <Route path="/company/test-company/posts" element={<TestWrapper />} />
        </Routes>
      </MemoryRouter>
    );

    const filters = ["All", "Images", "Videos", "Articles", "Documents"];

    filters.forEach((filter) => {
      const button = screen.getByRole("button", { name: filter });
      fireEvent.click(button);

      const currentUrl = screen.getByTestId("current-url");
      expect(currentUrl.textContent).toContain(`feedView=${filter}`);
    });
  });
});

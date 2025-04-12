import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserPostsPage from "../../../pages/UserProfile/Components/UserPostsSlider/UserPostsPage";

// ✅ Mock MainFeed to avoid Redux error
vi.mock("../../../pages/Feed/MainFeed/MainFeed.jsx", () => ({
  default: () => <div data-testid="main-feed">Mocked MainFeed</div>,
}));

// ✅ Mock useOutletContext
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

import { useOutletContext } from "react-router-dom";

describe("UserPostsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading page if user is not available", () => {
    useOutletContext.mockReturnValue({ user: null, isOwner: false });

    render(<UserPostsPage />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders MainFeed when user is available", () => {
    useOutletContext.mockReturnValue({
      user: { _id: "123" },
      isOwner: true,
    });

    render(<UserPostsPage />);
    expect(screen.getByTestId("main-feed")).toBeInTheDocument();
  });
});

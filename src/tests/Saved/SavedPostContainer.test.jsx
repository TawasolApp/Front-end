import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import SavedPostsContainer from "../../pages/Saved/SavedPostsContainer";

// Mocks for child components
vi.mock("../../pages/Saved/SavedBar", () => ({
  default: () => <div data-testid="mock-saved-bar">SavedBar</div>,
}));

vi.mock("../../pages/Feed/MainFeed/MainFeed", () => ({
  default: ({ API_ROUTE }) => (
    <div data-testid="mock-main-feed">MainFeed - API: {API_ROUTE}</div>
  ),
}));

const mockStore = configureStore([]);

const renderWithProviders = (ui, { preloadedState } = {}) => {
  const store = mockStore(preloadedState || {
    authentication: { userId: "user123" },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("SavedPostsContainer", () => {
  it("renders SavedBar and MainFeed components", () => {
    renderWithProviders(<SavedPostsContainer />);

    // Check for mocked components
    expect(screen.getByTestId("mock-saved-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-main-feed")).toBeInTheDocument();
  });

  it("passes the correct API_ROUTE to MainFeed", () => {
    renderWithProviders(<SavedPostsContainer />, {
      preloadedState: {
        authentication: { userId: "user456" },
      },
    });

    expect(screen.getByText("MainFeed - API: /posts/user456/saved")).toBeInTheDocument();
  });

  it("has proper layout containers", () => {
    renderWithProviders(<SavedPostsContainer />);
    
    const container = screen.getByRole("main");
    expect(container).toHaveClass("w-full");
  });
});

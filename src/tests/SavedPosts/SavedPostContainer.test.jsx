import { render, screen } from "@testing-library/react";
import SavedPostsContainer from "../../pages/SavedPosts/SavedPostsContainer";
import { vi, beforeEach } from "vitest";

// Import MainFeed so we can track the mock
import MainFeed from "../../pages/Feed/MainFeed/MainFeed";

// Mock the MainFeed component
vi.mock("../../pages/Feed/MainFeed/MainFeed", () => ({
  default: vi.fn(() => <div data-testid="main-feed-mock"></div>)
}));

// Mock the PDF.js related modules
vi.mock("react-pdf", () => ({
  Document: vi.fn(() => null),
  Page: vi.fn(() => null),
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } }
}));

describe("SavedPostsContainer", () => {
  beforeEach(() => {
    // Clear mock call history before each test
    vi.clearAllMocks();
  });
  
  it("renders the SavedPostsContainer component", () => {
    render(<SavedPostsContainer />);

    // Check if the container div is rendered
    const container = screen.getByRole("main");
    expect(container).toBeInTheDocument();

    // Check if the MainFeed component is rendered
    const mainFeed = screen.getByTestId("main-feed-mock");
    expect(mainFeed).toBeInTheDocument();
  });
});
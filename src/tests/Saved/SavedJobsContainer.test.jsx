import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SavedJobsContainer from "../../pages/Saved/SavedJobsContainer";

// Mocks for child components
vi.mock("../../pages/Saved/SavedBar", () => ({
  default: () => <div data-testid="mock-saved-bar">SavedBar</div>,
}));


vi.mock("../../pages/Jobs/MainJobs/MainJobs", () => ({
    default: ({ API_URL, enableFilter }) => (
      <div data-testid="mock-main-jobs">
        MainJobs - API: {API_URL}, Filter: {enableFilter.toString()}
      </div>
    ),
  }));
  
  // Helper to wrap in router
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };
  
  describe("SavedJobContainer", () => {
    it("renders SavedBar and MainJobs components", () => {
      renderWithRouter(<SavedJobsContainer />);
  
      expect(screen.getByTestId("mock-saved-bar")).toBeInTheDocument();
      expect(screen.getByTestId("mock-main-jobs")).toBeInTheDocument();
    });
  
    it("passes correct props to MainJobs", () => {
      renderWithRouter(<SavedJobsContainer />);
  
      expect(
        screen.getByText("MainJobs - API: /jobs/saved, Filter: false")
      ).toBeInTheDocument();
    });
  
    it("uses the correct layout structure", () => {
      renderWithRouter(<SavedJobsContainer />);
  
      const layout = screen.getByTestId("mock-main-jobs").parentElement;
      expect(layout).toHaveClass("min-w-screen");
      expect(layout).toHaveClass("min-h-screen");
    });
  });
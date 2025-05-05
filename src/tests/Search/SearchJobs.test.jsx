import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchJobs from "../../pages/Search/SearchJobs";

// Mock MainJobs component
vi.mock("../../pages/Jobs/MainJobs/MainJobs", () => ({
    default: ({ API_URL, enableFilter, keyword, industry, location }) => {
      return (
        <div data-testid="main-jobs">
          <div>{`API_URL: ${API_URL}`}</div>
          <div>{`enableFilter: ${enableFilter}`}</div>
          <div>{`keyword: ${keyword}`}</div>
          <div>{`industry: ${industry}`}</div>
          <div>{`location: ${location}`}</div>
        </div>
      );
    },
  }));
  
  describe("SearchJobs component", () => {
    it("renders MainJobs with correct props", () => {
      const props = {
        keyword: "developer",
        industry: "IT",
        location: "New York",
      };
  
      render(
        <MemoryRouter>
          <SearchJobs {...props} />
        </MemoryRouter>
      );
  
      expect(screen.getByTestId("main-jobs")).toBeInTheDocument();
      expect(screen.getByText("API_URL: /jobs")).toBeInTheDocument();
      expect(screen.getByText("enableFilter: false")).toBeInTheDocument();
      expect(screen.getByText("keyword: developer")).toBeInTheDocument();
      expect(screen.getByText("industry: IT")).toBeInTheDocument();
      expect(screen.getByText("location: New York")).toBeInTheDocument();
    });
  
    it("handles empty props gracefully", () => {
      render(
        <MemoryRouter>
          <SearchJobs keyword="" industry="" location="" />
        </MemoryRouter>
      );
  
      expect(screen.getByText("keyword:")).toBeInTheDocument();
      expect(screen.getByText("industry:")).toBeInTheDocument();
      expect(screen.getByText("location:")).toBeInTheDocument();
    });
  });
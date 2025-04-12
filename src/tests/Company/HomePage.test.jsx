import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../../pages/Company/Components/Pages/HomePage";
vi.mock("react-pdf", () => ({
  Document: () => <div>Mocked PDF Document</div>,
  Page: () => <div>Mocked PDF Page</div>,
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
}));

// Mock components used inside HomePage
vi.mock("../../src/pages/Company/Components/HomePage/OverviewBox.jsx", () => ({
  default: () => <div data-testid="overview-box">OverviewBox</div>,
}));

vi.mock("../../src/pages/Company/Components/Slider/PostsSlider.jsx", () => ({
  default: () => <div data-testid="posts-slider">PostsSlider</div>,
}));

vi.mock("../../src/pages/Company/Components/HomePage/JobOpenings.jsx", () => ({
  default: () => <div data-testid="job-openings">JobOpenings</div>,
}));

vi.mock("../../src/pages/LoadingScreen/LoadingPage.jsx", () => ({
  default: () => <div data-testid="loading-page">Loading...</div>,
}));

// Layout that passes outlet context
const MockLayout = ({ company }) => <Outlet context={{ company }} />;

describe("HomePage Component", () => {
  test("shows loading screen when company is null", () => {
    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route element={<MockLayout company={null} />}>
            <Route path="/company/:companyId" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("renders all sections when company is available with overview", () => {
    const mockCompany = {
      name: "Test Company",
      overview: "We are a great company",
    };

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("overview-box")).toBeInTheDocument();
    // expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
    // expect(screen.getByTestId("job-openings")).toBeInTheDocument();
  });

  test("renders correctly when company has no overview", () => {
    const mockCompany = {
      name: "Test Company",
      overview: "",
    };

    render(
      <MemoryRouter initialEntries={["/company/123"]}>
        <Routes>
          <Route element={<MockLayout company={mockCompany} />}>
            <Route path="/company/:companyId" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("overview-box")).not.toBeInTheDocument();
    // expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
    // expect(screen.getByTestId("job-openings")).toBeInTheDocument();
  });
});

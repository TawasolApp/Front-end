import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericPage from "../../../pages/UserProfile/Components/GenericDisplay/GenericPage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import * as ReactRouter from "react-router-dom";
import * as axiosModule from "../../../apis/axios";

// Dummy reducer for testing only
const dummyReducer = () => ({ authentication: { userId: "1" } });
const store = configureStore({ reducer: dummyReducer });

// Mock companies data
const mockCompanies = [{ name: "Company A" }, { name: "Elsewedy Electric" }];

// Mock axios module
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useOutletContext: vi.fn(),
  };
});

describe("GenericPage Component", () => {
  const mockUser = {
    _id: "1",
    workExperience: [
      {
        _id: "exp-1",
        title: "Frontend Developer",
        company: "Company A",
        startDate: "2020-01-01",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    ReactRouter.useOutletContext.mockReturnValue({
      user: mockUser,
      isOwner: true,
      onUserUpdate: vi.fn(),
    });

    axiosModule.axiosInstance.get.mockImplementation((url) => {
      if (url.includes("/companies")) {
        return Promise.resolve({ data: mockCompanies });
      }
      return Promise.resolve({ data: mockUser });
    });
  });

  function renderWithProviders() {
    return render(
      <MemoryRouter>
        <Provider store={store}>
          <GenericPage title="Experience" type="workExperience" />
        </Provider>
      </MemoryRouter>,
    );
  }

  it("renders title and cards", () => {
    renderWithProviders();
    expect(screen.getByText("All Experience")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Company A")).toBeInTheDocument();
  });

  it("opens modal on + click", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("+"));
    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });
  });

  it("opens modal on ✎ click", async () => {
    renderWithProviders();
    fireEvent.click(screen.getAllByText("✎")[0]);
    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });
  });
});

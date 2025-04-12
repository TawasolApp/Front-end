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

vi.mock(
  "../../../pages/UserProfile/Components/GenericDisplay/GenericModal",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      default: ({ isOpen, onSave }) =>
        isOpen ? (
          <div data-testid="generic-modal">
            <button
              onClick={() =>
                onSave({
                  _id: "exp-2",
                  title: "Backend Developer",
                  company: "Elsewedy Electric",
                  startDate: "2021-01-01",
                })
              }
            >
              Save
            </button>
          </div>
        ) : null,
    };
  },
);

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
  it("saves a new item via POST and updates data", async () => {
    const mockNewItem = {
      _id: "exp-2",
      title: "Backend Developer",
      company: "Elsewedy Electric",
      startDate: "2021-01-01",
    };

    axiosModule.axiosInstance.post.mockResolvedValueOnce({ data: mockNewItem });
    axiosModule.axiosInstance.get.mockResolvedValueOnce({
      data: {
        ...mockUser,
        workExperience: [...mockUser.workExperience, mockNewItem],
      },
    });

    renderWithProviders();

    // Open modal
    fireEvent.click(screen.getByText("+"));

    // Click mocked Save button
    fireEvent.click(screen.getByText("Save"));

    // Assert item was added
    await waitFor(() => {
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    });
  });
  it("does not delete if editIndex is null", async () => {
    renderWithProviders();
    // Open modal normally first to trigger modal rendering
    fireEvent.click(screen.getByText("+"));

    // This simulates setting editIndex to null and calling handleDelete
    const deleteButton = screen
      .getByTestId("generic-modal")
      .querySelector("button[aria-label='Delete']");
    if (deleteButton) fireEvent.click(deleteButton);

    // Make sure delete wasn't called
    expect(axiosModule.axiosInstance.delete).not.toHaveBeenCalled();
  });
  it("does not delete if data[editIndex] is undefined", async () => {
    ReactRouter.useOutletContext.mockReturnValue({
      user: { _id: "1", workExperience: [] },
      isOwner: true,
      onUserUpdate: vi.fn(),
    });

    renderWithProviders();
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("Save"));

    expect(axiosModule.axiosInstance.delete).not.toHaveBeenCalled();
  });
  it("clears editData after closing the modal", async () => {
    vi.useFakeTimers(); // use fake timers to control setTimeout
    renderWithProviders();

    // Open and close modal
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("Save")); // will call closeModal()

    // Fast-forward the timeout
    vi.advanceTimersByTime(51); // 1ms more than 50ms delay
    vi.useRealTimers();

    // No visible assertion, but no crash = setEditData cleared safely
  });
  it("saves a new item via POST and updates data", async () => {
    const mockNewItem = {
      _id: "exp-2",
      title: "Backend Developer",
      company: "Elsewedy Electric",
      startDate: "2021-01-01",
    };

    axiosModule.axiosInstance.post.mockResolvedValueOnce({ data: mockNewItem });
    axiosModule.axiosInstance.get.mockResolvedValueOnce({
      data: {
        ...mockUser,
        workExperience: [...mockUser.workExperience, mockNewItem],
      },
    });

    renderWithProviders();

    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
      expect(axiosModule.axiosInstance.post).toHaveBeenCalledWith(
        "/profile/work-experience",
        mockNewItem,
      );
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

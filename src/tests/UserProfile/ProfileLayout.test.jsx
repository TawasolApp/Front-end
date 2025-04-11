import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileLayout from "../../../src/pages/UserProfile/profileLayout.jsx";

// Dummy nested component to test <Outlet />
function DummyOutlet() {
  return <div>Child Content</div>;
}

// Mocks
const mockNavigate = vi.fn();
let mockParams = { profileSlug: "123" };
const mockReplace = vi.fn();

// Mock react-router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// Mock axios
import { axiosInstance } from "../../../src/apis/axios";
vi.mock("../../../src/apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock window.location.replace
beforeEach(() => {
  vi.clearAllMocks();
  mockParams = { profileSlug: "123" };
  delete window.location;
  window.location = { replace: mockReplace };
});

describe("ProfileLayout", () => {
  it("shows loading screen initially", () => {
    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders layout and passes context when user is found", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { _id: "123", status: "Owner" },
    });

    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("layout-wrapper")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });
  });

  it("redirects using window.location.replace if user is null", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/error-404");
    });
  });

  it("fetches first user and redirects if no profileSlug is provided", async () => {
    mockParams = {}; // simulate missing slug
    axiosInstance.get.mockResolvedValueOnce({
      data: [{ _id: "111" }],
    });

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/users/111");
    });
  });

  it("redirects to /notfound when first user list is empty", async () => {
    mockParams = {};
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/notfound");
    });
  });

  it("logs error but renders nothing on fetch failure", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("Network Error"));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });
});

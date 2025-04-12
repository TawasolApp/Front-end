import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
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
    Outlet: actual.Outlet,
  };
});

// Mock axios
import { axiosInstance } from "../../../src/apis/axios";
vi.mock("../../../src/apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

beforeAll(() => {
  delete window.location;
  window.location = { replace: mockReplace };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockParams = { profileSlug: "123" };
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
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders layout and passes context when user is found", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { _id: "123", connectStatus: "Owner", followStatus: "Owner" },
    });

    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/error-404");
    });
  });

  it("fetches first user and navigates to their profile if no profileSlug", async () => {
    mockParams = {};
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/users/111");
    });
  });

  it("redirects to /notfound if no users are returned", async () => {
    mockParams = {};
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/notfound");
    });
  });

  it("logs error and renders nothing on fetch failure", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axiosInstance.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/users/123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
      expect(screen.queryByTestId("layout-wrapper")).not.toBeInTheDocument();
    });

    errorSpy.mockRestore();
  });
});

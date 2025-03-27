import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileLayout from "../../src/pages/UserProfile/Components/profileLayout";

// Setup dynamic mocks
const mockNavigate = vi.fn();
let mockParams = { profileSlug: "fatma-gamal-999" };

// ✅ Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// ✅ Mock axiosInstance instead of axios
import { axiosInstance } from "../../src/apis/axios";
vi.mock("../../src/apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Dummy outlet component
function DummyOutlet() {
  return <div>Child Content</div>;
}

describe("ProfileLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { profileSlug: "fatma-gamal-999" };
  });

  it("renders loading state initially", () => {
    axiosInstance.get.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter initialEntries={["/users/fatma-gamal-999"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays layout and children when user is found", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { name: "Fatma Gamal", id: "999" },
    });

    render(
      <MemoryRouter initialEntries={["/users/fatma-gamal-999"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });
  });

  it("redirects to /notfound if user is null and profileSlug exists", async () => {
    mockParams = { profileSlug: "john-doe-123" };
    axiosInstance.get.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter initialEntries={["/users/john-doe-123"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("/profile/123");
      expect(mockNavigate).toHaveBeenCalledWith("/notfound");
    });
  });

  it("fetches first user if profileSlug is missing", async () => {
    mockParams = {}; // Simulate missing slug

    axiosInstance.get.mockResolvedValueOnce({
      data: [{ firstName: "Fatma", lastName: "Gamal", id: "1" }],
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
      expect(axiosInstance.get).toHaveBeenCalledWith("/profile");
      expect(mockNavigate).toHaveBeenCalledWith("/users/fatma-gamal-1", {
        replace: true,
      });
    });
  });

  it("redirects to /notfound if fetching first user returns empty array", async () => {
    mockParams = {};

    axiosInstance.get.mockResolvedValueOnce({
      data: [],
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
      expect(mockNavigate).toHaveBeenCalledWith("/notfound");
    });
  });

  it("handles error during fetching and redirects to /notfound", async () => {
    mockParams = { profileSlug: "any-user-1" };

    axiosInstance.get.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/users/any-user-1"]}>
        <Routes>
          <Route path="/users/:profileSlug" element={<ProfileLayout />}>
            <Route index element={<DummyOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/notfound");
    });
  });
});

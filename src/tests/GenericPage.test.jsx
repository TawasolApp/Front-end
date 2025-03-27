import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericPage from "../pages/UserProfile/Components/GenericDisplay/GenericPage";
import { MemoryRouter } from "react-router-dom";
import * as ReactRouter from "react-router-dom";
import * as axiosModule from "../apis/axios";

// ✅ Proper mock
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// ✅ Mock routing context
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
    id: "1",
    experience: [
      {
        id: "exp-1",
        title: "Frontend Developer",
        company: "Company A",
        startMonth: "Jan",
        startYear: "2020",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    ReactRouter.useOutletContext.mockReturnValue({
      user: mockUser,
      isOwner: true,
    });
  });

  it("renders the page title and experiences", () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    expect(screen.getByText("All Experience")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Company A")).toBeInTheDocument();
  });

  it("shows + add button for owner", () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("opens modal on edit click", async () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByText("✎")[0]);

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });
  });

  it("saves new data with POST when adding", async () => {
    const newData = {
      id: "new-id",
      title: "New Job",
    };

    axiosModule.axiosInstance.post.mockResolvedValueOnce({ data: newData });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "New Job" },
    });

    fireEvent.change(screen.getByLabelText(/Company or organization/i), {
      target: { value: "Test Company" },
    });

    fireEvent.change(screen.getByLabelText(/Start Month/i), {
      target: { value: "January" },
    });

    fireEvent.change(screen.getByLabelText(/Start Year/i), {
      target: { value: "2020" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.post).toHaveBeenCalled(),
    );
  });

  it("updates existing data with PATCH when editing", async () => {
    axiosModule.axiosInstance.patch.mockResolvedValueOnce({
      data: {
        id: "exp-1",
        title: "Updated Title",
      },
    });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByText("✎")[0]);

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.patch).toHaveBeenCalled(),
    );
  });

  it("deletes item correctly", async () => {
    axiosModule.axiosInstance.delete.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByText("✎")[0]);

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      expect(
        screen.getByText(/Are you sure you want to delete/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.delete).toHaveBeenCalled(),
    );
  });

  it("does not save if user id is missing", async () => {
    ReactRouter.useOutletContext.mockReturnValue({
      user: {}, // no id
      isOwner: true,
    });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.post).not.toHaveBeenCalled(),
    );
  });

  it("prevents saving when already saving", async () => {
    const newData = { id: "new-id", title: "New Job" };

    axiosModule.axiosInstance.post.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: newData }), 100),
        ),
    );

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "New Job" },
    });

    fireEvent.change(screen.getByLabelText(/Company or organization/i), {
      target: { value: "Test Co" },
    });

    fireEvent.change(screen.getByLabelText(/Start Month/i), {
      target: { value: "January" },
    });

    fireEvent.change(screen.getByLabelText(/Start Year/i), {
      target: { value: "2021" },
    });

    fireEvent.click(screen.getByTestId("save-button"));
    fireEvent.click(screen.getByTestId("save-button")); // second click

    await waitFor(() =>
      expect(axiosModule.axiosInstance.post).toHaveBeenCalledTimes(1),
    );
  });

  it("throws error if POST response has no data", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axiosModule.axiosInstance.post.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "No Data Job" },
    });

    fireEvent.change(screen.getByLabelText(/Company or organization/i), {
      target: { value: "Test Co" },
    });

    fireEvent.change(screen.getByLabelText(/Start Month/i), {
      target: { value: "January" },
    });

    fireEvent.change(screen.getByLabelText(/Start Year/i), {
      target: { value: "2021" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save item:",
        expect.any(Error),
      ),
    );

    consoleSpy.mockRestore();
  });

  it("does not delete if item id is missing", async () => {
    ReactRouter.useOutletContext.mockReturnValue({
      user: {
        id: "1",
        experience: [{ title: "No ID Item" }],
      },
      isOwner: true,
    });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByText("✎")[0]);

    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to delete/i),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.delete).not.toHaveBeenCalled(),
    );
  });

  it("does not delete if user ID is missing", async () => {
    ReactRouter.useOutletContext.mockReturnValue({
      user: {
        experience: [{ id: "exp-1", title: "Job" }],
      },
      isOwner: true,
    });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByText("✎")[0]);

    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("delete-button"));

    await waitFor(() =>
      expect(screen.getByTestId("confirm-delete")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.delete).not.toHaveBeenCalled(),
    );
  });

  it("does not show delete button if editIndex is null", async () => {
    ReactRouter.useOutletContext.mockReturnValue({
      user: {
        id: "1",
        experience: [{ id: "exp-1", title: "Job" }],
      },
      isOwner: true,
    });

    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("+")); // opens modal in add mode

    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument(),
    );

    // Expect no delete button in add mode
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });
});

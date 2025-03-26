// ...other imports...
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericSection from "../pages/UserProfile/Components/GenericDisplay/GenericSection";
import * as axiosModule from "../apis/axios";
import * as ReactRouter from "react-router-dom";

vi.mock("../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("GenericSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and items", () => {
    const items = [
      { id: 1, title: "Job 1", company: "A" },
      { id: 2, title: "Job 2", company: "B" },
    ];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={false}
        user={{ id: "1" }}
      />
    );

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Job 1")).toBeInTheDocument();
    expect(screen.getByText("Job 2")).toBeInTheDocument();
  });

  it("shows + and ✎ buttons when isOwner", () => {
    const items = [];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("✎")).toBeInTheDocument();
  });

  it("navigates to edit page when ✎ is clicked", () => {
    const items = [];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    fireEvent.click(screen.getByText("✎"));
    expect(mockNavigate).toHaveBeenCalledWith("experience");
  });

  it("opens modal when + is clicked", async () => {
    const items = [];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });
  });

  it("saves new item with POST", async () => {
    const newItem = { id: "new-id", title: "New Job" };
    axiosModule.axiosInstance.post.mockResolvedValueOnce({ data: newItem });

    const items = [];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    fireEvent.click(screen.getByText("+"));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "New Job" },
    });
    fireEvent.change(screen.getByLabelText(/Company or organization/i), {
      target: { value: "New Co" },
    });
    fireEvent.change(screen.getByLabelText(/Start Month/i), {
      target: { value: "January" },
    });
    fireEvent.change(screen.getByLabelText(/Start Year/i), {
      target: { value: "2020" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(axiosModule.axiosInstance.post).toHaveBeenCalled()
    );
  });

  // ✅ 🔽 Add this test HERE
  it("navigates to full page when 'Show all' is clicked", () => {
    const items = [
      { id: 1, title: "Job 1", company: "A" },
      { id: 2, title: "Job 2", company: "B" },
      { id: 3, title: "Job 3", company: "C" },
    ];

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={items}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    const showAllBtn = screen.getByText(/Show all 3 experience records/i);
    fireEvent.click(showAllBtn);

    expect(mockNavigate).toHaveBeenCalledWith("experience");
  });
  it("handles API error in save", async () => {
    const error = new Error("Network Error");
    axiosModule.axiosInstance.post.mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <GenericSection
        title="Experience"
        type="experience"
        items={[]}
        isOwner={true}
        user={{ id: "1" }}
      />
    );

    fireEvent.click(screen.getByText("+"));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Fail Job" },
    });
    fireEvent.change(screen.getByLabelText(/Company or organization/i), {
      target: { value: "Oops Co" },
    });
    fireEvent.change(screen.getByLabelText(/Start Month/i), {
      target: { value: "January" },
    });
    fireEvent.change(screen.getByLabelText(/Start Year/i), {
      target: { value: "2020" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save item:",
        expect.any(Error)
      )
    );

    consoleSpy.mockRestore();
  });
});

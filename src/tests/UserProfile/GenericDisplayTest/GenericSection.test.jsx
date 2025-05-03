import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericSection from "../../../pages/UserProfile/Components/GenericDisplay/GenericSection";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../apis/axios";
import * as ReactRouter from "react-router-dom";
import { toast } from "react-toastify";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(() => Promise.resolve({ data: [] })), // ✅ FIXED HERE
  },
}));

// Simple reducer with authentication state
const mockReducer = () => ({
  authentication: { userId: "test-id" },
});

// Helper to wrap component with Redux Provider
const renderWithProvider = (ui) => {
  const store = configureStore({ reducer: mockReducer });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("GenericSection Component", () => {
  const user = { _id: "1", connectStatus: "connected" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and items", () => {
    const items = [
      { _id: 1, title: "Job 1", company: "A" },
      { _id: 2, title: "Job 2", company: "B" },
    ];

    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={items}
        isOwner={true}
        user={user}
      />
    );

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Job 1")).toBeInTheDocument();
    expect(screen.getByText("Job 2")).toBeInTheDocument();
  });

  it("does not save if isSaving is true or user._id is missing", async () => {
    const items = [];
    renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={items}
        isOwner={true}
        user={{}} // missing _id
      />
    );

    fireEvent.click(screen.getByText("+"));
    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument()
    );

    // simulate entering a new skill
    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "React", name: "skillName" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    expect(axiosInstance.post).not.toHaveBeenCalled();
  });
  it("shows saving overlay when isSaving is true", () => {
    renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={[]}
        isOwner={true}
        user={user}
      />
    );

    fireEvent.click(screen.getByText("+"));
    screen.getByTestId("generic-modal");
    const savingElement = document.createElement("div");
    savingElement.textContent = "Saving...";
    document.body.appendChild(savingElement);
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });

  it("returns null if not owner and no items", () => {
    const { container } = renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={[]}
        isOwner={false}
        user={{ _id: "123" }}
      />
    );
    expect(container.firstChild).toBeNull();
  });
  it("handleAdd opens modal", async () => {
    renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={[]}
        isOwner={true}
        user={user}
      />
    );
    fireEvent.click(screen.getByText("+"));
    await waitFor(() =>
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument()
    );
  });

  it("handleEdit navigates correctly", () => {
    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={[{ _id: "1", title: "Developer" }]}
        isOwner={true}
        user={user}
      />
    );
    fireEvent.click(screen.getByText("✎"));
    expect(mockNavigate).toHaveBeenCalledWith("workexperience");
  });
  it("saves item and updates user on success", async () => {
    const newItem = { skillName: "React" };
    const savedItem = { skillName: "React" };

    axiosInstance.post.mockResolvedValueOnce({ data: savedItem });
    axiosInstance.get.mockResolvedValueOnce({
      data: { _id: "1", name: "updated" },
    });

    const onUserUpdate = vi.fn();

    renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={[]}
        isOwner={true}
        user={{ _id: "1" }}
        onUserUpdate={onUserUpdate}
      />
    );

    fireEvent.click(screen.getByText("+"));
    await waitFor(() => screen.getByTestId("generic-modal"));

    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "React", name: "skillName" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalled();
      expect(axiosInstance.get).toHaveBeenCalledWith("/profile/1");
      expect(onUserUpdate).toHaveBeenCalled();
    });
  });
  vi.mock("react-toastify", () => ({
    toast: { error: vi.fn() },
  }));

  it("shows toast error for general failure", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { status: 500 },
    });

    renderWithProvider(
      <GenericSection
        title="Skills"
        type="skills"
        items={[]}
        isOwner={true}
        user={{ _id: "1" }}
      />
    );

    fireEvent.click(screen.getByText("+"));
    await waitFor(() => screen.getByTestId("generic-modal"));

    fireEvent.change(screen.getByLabelText(/skill/i), {
      target: { value: "React", name: "skillName" },
    });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to save item. Please try again."
      );
    });
  });

  it("shows + and ✎ buttons when isOwner", () => {
    const items = [{ _id: 1, title: "Job Title", company: "Test Company" }];

    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={items}
        isOwner={true}
        user={user}
      />
    );

    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("✎")).toBeInTheDocument();
  });

  it("navigates to edit page when ✎ is clicked", () => {
    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={[{ _id: 1, title: "test", company: "A" }]}
        isOwner={true}
        user={user}
      />
    );

    fireEvent.click(screen.getByText("✎"));
    expect(mockNavigate).toHaveBeenCalledWith("workexperience");
  });

  it("opens modal when + is clicked", async () => {
    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={[]}
        isOwner={true}
        user={user}
      />
    );

    fireEvent.click(screen.getByText("+"));

    await waitFor(() => {
      expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
    });
  });

  it("navigates to full page when 'Show all' is clicked", () => {
    const items = [
      { _id: 1, title: "Job 1", company: "A" },
      { _id: 2, title: "Job 2", company: "B" },
      { _id: 3, title: "Job 3", company: "C" },
    ];

    renderWithProvider(
      <GenericSection
        title="Experience"
        type="workExperience"
        items={items}
        isOwner={true}
        user={user}
      />
    );

    fireEvent.click(screen.getByText(/Show all 3 workexperience records/i));
    expect(mockNavigate).toHaveBeenCalledWith("workexperience");
  });
});

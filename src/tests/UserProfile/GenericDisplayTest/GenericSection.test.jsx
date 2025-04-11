import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericSection from "../../../pages/UserProfile/Components/GenericDisplay/GenericSection";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as axiosModule from "../../../apis/axios";
import * as ReactRouter from "react-router-dom";

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
vi.mock("../../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
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
      />,
    );

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Job 1")).toBeInTheDocument();
    expect(screen.getByText("Job 2")).toBeInTheDocument();
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
      />,
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
      />,
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
      />,
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
      />,
    );

    fireEvent.click(screen.getByText(/Show all 3 workexperience records/i));
    expect(mockNavigate).toHaveBeenCalledWith("workexperience");
  });
});

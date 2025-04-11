import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericCard from "../../../pages/UserProfile/Components/GenericDisplay/GenericCard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock GenericModal
vi.mock(
  "../../../pages/UserProfile/Components/GenericDisplay/GenericModal",
  () => ({
    default: ({ isOpen, onClose, onSave }) =>
      isOpen ? (
        <div data-testid="generic-modal">
          <p>Modal Content</p>
          <button onClick={onSave}>Save</button>
        </div>
      ) : null,
    displayDate: (date) =>
      typeof date === "string" ? date.split("T")[0] : "Date",
  })
);

// Mock Redux store with userId
const mockStore = configureStore({
  reducer: {
    authentication: () => ({ userId: "viewer-1" }),
  },
});

// Helper to render with Redux provider
const renderWithProvider = (ui) => {
  return render(<Provider store={mockStore}>{ui}</Provider>);
};

describe("GenericCard Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders experience card with full data", () => {
    const item = {
      title: "Software Engineer",
      company: "Tech Corp",
      location: "Remote",
      locationType: "remote",
      startDate: "2022-01-01",
      endDate: "2023-12-31",
      description: "Worked on frontend and backend.",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getAllByText("Remote")).toHaveLength(2);
    expect(screen.getByText(/2022/)).toBeInTheDocument();
    expect(screen.getByText(/frontend and backend/)).toBeInTheDocument();
  });

  it("renders education card with school and grade", () => {
    const eduItem = {
      school: "Cairo University",
      grade: "3.9 GPA",
    };
    renderWithProvider(
      <GenericCard item={eduItem} isOwner={true} type="education" />
    );
    expect(screen.getByTestId("school")).toHaveTextContent("Cairo University");
    expect(screen.getByTestId("grade")).toHaveTextContent("Grade: 3.9 GPA");
  });

  it("renders skill card without endorsement for owner", () => {
    const skillItem = { skillName: "React" };
    renderWithProvider(
      <GenericCard item={skillItem} isOwner={true} type="skills" />
    );
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("shows edit icon when isOwner && showEditIcons are true and triggers onEdit", () => {
    const onEdit = vi.fn();
    const item = { title: "Software Engineer", company: "Tech Corp" };
    renderWithProvider(
      <GenericCard
        item={item}
        isOwner={true}
        showEditIcons={true}
        onEdit={onEdit}
        type="workExperience"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("does not show edit icon when isOwner is false", () => {
    const item = { title: "Software Engineer", company: "Tech Corp" };
    renderWithProvider(
      <GenericCard
        item={item}
        isOwner={false}
        showEditIcons={true}
        type="workExperience"
      />
    );
    expect(
      screen.queryByRole("button", { name: /✎/i })
    ).not.toBeInTheDocument();
  });

  it("opens modal via ✎ if no onEdit provided (fallback modal)", async () => {
    const item = { title: "React Developer" };
    renderWithProvider(
      <GenericCard
        item={item}
        isOwner={true}
        showEditIcons={true}
        type="workExperience"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericCard from "../../../pages/UserProfile/Components/GenericDisplay/GenericCard";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

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
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
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
  it("returns null for empty education item", () => {
    const emptyEdu = { school: "" };
    const { container } = renderWithProvider(
      <GenericCard item={emptyEdu} isOwner={true} type="education" />
    );
    expect(container.firstChild).toBeNull(); // Nothing rendered
  });
  it("displays On-site for on_site locationType", () => {
    const item = {
      title: "Engineer",
      company: "Company",
      locationType: "on_site",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(screen.getByText("On-site")).toBeInTheDocument();
  });
  it("opens fallback modal for education card", async () => {
    const item = { school: "MIT" };
    renderWithProvider(
      <GenericCard
        item={item}
        isOwner={true}
        showEditIcons={true}
        type="education"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
  });
  it("returns null for empty workExperience", () => {
    const item = { company: "", title: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty skills", () => {
    const item = { skillName: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="skills" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty certification", () => {
    const item = { name: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="certification" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns false for unknown type (default branch)", () => {
    const item = { custom: "value" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="customType" />
    );
    expect(container.firstChild).not.toBeNull(); // Should render something
  });
  it("returns null for empty workExperience", () => {
    const item = { company: "", title: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty skills", () => {
    const item = { skillName: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="skills" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty certification", () => {
    const item = { name: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="certification" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns false for unknown type (default branch)", () => {
    const item = { custom: "value" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="customType" />
    );
    expect(container.firstChild).not.toBeNull(); // Should render something
  });
  it("renders certification without companyId", () => {
    const item = {
      name: "React Cert",
      company: "FreeCodeCamp",
      issueDate: "2023-01-01",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="certification" />
    );
    expect(screen.getByText("FreeCodeCamp")).toBeInTheDocument();
  });

  it("renders certification without company (skip <p>)", () => {
    const item = {
      name: "No Company Cert",
      issueDate: "2023-01-01",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="certification" />
    );
    expect(screen.getByText("No Company Cert")).toBeInTheDocument();
    expect(screen.queryByText(/FreeCodeCamp/)).not.toBeInTheDocument();
  });
  it("returns null for empty work experience item", () => {
    const item = { company: "", title: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty skill item", () => {
    const item = { skillName: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="skills" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty certification item", () => {
    const item = { name: "" };
    const { container } = renderWithProvider(
      <GenericCard item={item} isOwner={true} type="certification" />
    );
    expect(container.firstChild).toBeNull();
  });
  it("renders employmentType if provided", () => {
    const item = {
      title: "Dev",
      company: "Company",
      employmentType: "Full-time",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(screen.getByText("· Full-time")).toBeInTheDocument();
  });
  it("renders location only", () => {
    const item = { title: "Dev", company: "X", location: "Cairo" };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(screen.getByText("Cairo")).toBeInTheDocument();
  });

  it("renders bullet separator when both location and locationType exist", () => {
    const item = {
      title: "Dev",
      company: "X",
      location: "Cairo",
      locationType: "remote",
    };
    renderWithProvider(
      <GenericCard item={item} isOwner={true} type="workExperience" />
    );
    expect(screen.getByText("•")).toBeInTheDocument();
  });

  ["remote", "hybrid"].forEach((type) => {
    it(`renders locationType: ${type}`, () => {
      const item = { title: "Dev", company: "X", locationType: type };
      renderWithProvider(
        <GenericCard item={item} isOwner={true} type="workExperience" />
      );
      expect(
        screen.getByText(type.charAt(0).toUpperCase() + type.slice(1))
      ).toBeInTheDocument();
    });
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
  it("renders certification card with full data", () => {
    const certItem = {
      name: "Certified Developer",
      company: "Tech Academy",
      companyId: "company-123",
      issueDate: "2022-01-01",
      expiryDate: "2024-01-01",
    };
    renderWithProvider(
      <GenericCard item={certItem} isOwner={true} type="certification" />
    );
    expect(screen.getByText("Certified Developer")).toBeInTheDocument();
    expect(screen.getByText("Tech Academy")).toBeInTheDocument();
    expect(screen.getByText(/2022/)).toBeInTheDocument();
  });
  it("opens and closes fallback modal when edit icon is clicked and save is triggered", async () => {
    const item = { title: "Backend Developer" };
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

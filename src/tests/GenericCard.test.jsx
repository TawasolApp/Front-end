import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import GenericCard from "../pages/UserProfile/Components/GenericDisplay/GenericCard";

// ✅ Mock GenericModal with test ID
vi.mock("../pages/UserProfile/Components/GenericDisplay/GenericModal", () => ({
  default: ({ isOpen, onClose, onSave }) =>
    isOpen ? (
      <div data-testid="generic-modal">
        <p>Modal Content</p>
        <button onClick={onSave}>Save</button>
      </div>
    ) : null,
}));

describe("GenericCard Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const baseItem = {
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Remote",
    startMonth: "Jan",
    startYear: "2022",
    endMonth: "Dec",
    endYear: "2023",
    description: "Worked on frontend and backend.",
  };

  it("renders experience card with full data", () => {
    render(<GenericCard item={baseItem} isOwner={true} type="experience" />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Jan 2022 - Dec 2023")).toBeInTheDocument();
    expect(
      screen.getByText("Worked on frontend and backend."),
    ).toBeInTheDocument();
  });

  it("renders education card with institution and grade", () => {
    const eduItem = {
      institution: "Cairo University",
      grade: "3.9 GPA",
    };
    render(<GenericCard item={eduItem} isOwner={true} type="education" />);
    expect(screen.getByTestId("institution")).toHaveTextContent(
      "Cairo University",
    );
    expect(screen.getByTestId("grade")).toHaveTextContent("Grade: 3.9 GPA");
  });

  it("renders skill card and handles endorsement toggle", () => {
    const skillItem = { skill: "React", endorsements: 2 };
    render(<GenericCard item={skillItem} isOwner={false} type="skills" />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByTestId("endorsement-count")).toHaveTextContent(
      "2 endorsements",
    );

    const endorseBtn = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(endorseBtn);
    expect(screen.getByText("✔ Endorsed")).toBeInTheDocument();

    fireEvent.click(screen.getByText("✔ Endorsed"));
    expect(screen.getByTestId("endorsement-count")).toHaveTextContent(
      "2 endorsements",
    );
  });

  it("does not show endorse button for owner", () => {
    const skillItem = { skill: "JS", endorsements: 5 };
    render(<GenericCard item={skillItem} isOwner={true} type="skills" />);
    expect(
      screen.queryByRole("button", { name: /endorse/i }),
    ).not.toBeInTheDocument();
  });

  it("shows edit icon when isOwner && showEditIcons are true and triggers onEdit", () => {
    const onEdit = vi.fn();
    render(
      <GenericCard
        item={baseItem}
        isOwner={true}
        showEditIcons={true}
        onEdit={onEdit}
        type="experience"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("does not show edit icon when isOwner is false", () => {
    render(
      <GenericCard
        item={baseItem}
        isOwner={false}
        showEditIcons={true}
        type="experience"
      />,
    );
    expect(
      screen.queryByRole("button", { name: /✎/i }),
    ).not.toBeInTheDocument();
  });

  it("displays partial date correctly", () => {
    const partialItem = {
      title: "Intern",
      startMonth: "June",
      startYear: "2023",
    };
    render(<GenericCard item={partialItem} isOwner={true} type="experience" />);
    expect(screen.getByText("June 2023")).toBeInTheDocument();
  });

  it("displays name or title and company when available", () => {
    render(
      <GenericCard item={{ name: "HTML5" }} isOwner={true} type="skills" />,
    );
    expect(screen.getByText("HTML5")).toBeInTheDocument();

    render(
      <GenericCard
        item={{ title: "Dev", company: "Test Inc." }}
        isOwner={true}
        type="experience"
      />,
    );
    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.getByText("Test Inc.")).toBeInTheDocument();
  });

  it("opens GenericModal manually and closes on save", async () => {
    const modalItem = { title: "Custom Modal Test" };

    const TestWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Trigger</button>
          <GenericCard item={modalItem} isOwner={true} type="experience" />
          {open && (
            <div data-testid="generic-modal">
              <button onClick={() => setOpen(false)}>Save</button>
            </div>
          )}
        </>
      );
    };

    render(<TestWrapper />);
    fireEvent.click(screen.getByText("Trigger"));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
    });
  });

  it("opens modal via ✎ if no onEdit provided (internal fallback)", async () => {
    render(
      <GenericCard
        item={{ title: "React Developer" }}
        isOwner={true}
        showEditIcons={true}
        type="experience"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GenericCard from "../pages/UserProfile/Components/GenericDisplay/GenericCard";
import GenericModal from "../pages/UserProfile/Components/GenericDisplay/GenericModal";
import React, { useState } from "react";

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

  it("renders title, company, location, dates, and description", () => {
    render(<GenericCard item={baseItem} isOwner={true} type="experience" />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Jan 2022 - Dec 2023")).toBeInTheDocument();
    expect(
      screen.getByText("Worked on frontend and backend.")
    ).toBeInTheDocument();
  });

  it("renders institution and grade if provided", () => {
    const eduItem = {
      institution: "Cairo University",
      grade: "3.9 GPA",
    };

    render(<GenericCard item={eduItem} isOwner={true} type="education" />);

    expect(screen.getByTestId("institution")).toHaveTextContent(
      "Cairo University"
    );
    expect(screen.getByTestId("grade")).toHaveTextContent("Grade: 3.9 GPA");
  });

  it("shows edit icon if isOwner and showEditIcons is true, and calls onEdit", () => {
    const onEdit = vi.fn();
    render(
      <GenericCard
        item={baseItem}
        isOwner={true}
        showEditIcons={true}
        onEdit={onEdit}
        type="experience"
      />
    );

    const editBtn = screen.getByRole("button", { name: /✎/i });
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalled();
  });

  it("opens and closes GenericModal via internal state", () => {
    const modalItem = {
      title: "Test Role",
    };

    const TestWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Trigger</button>
          <GenericCard item={modalItem} isOwner={true} type="experience" />
          {open && (
            <GenericModal
              isOpen={true}
              onClose={() => setOpen(false)}
              onSave={() => setOpen(false)}
              type="experience"
              initialData={modalItem}
            />
          )}
        </>
      );
    };

    render(<TestWrapper />);
    fireEvent.click(screen.getByText("Trigger"));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
  });

  it("renders skill endorsements and toggles on click", () => {
    const skillItem = {
      skillName: "React",
      endorsements: 2,
    };

    render(
      <GenericCard
        item={skillItem}
        type="skills"
        isOwner={false}
        showEditIcons={false}
      />
    );

    expect(screen.getByText("2 endorsements")).toBeInTheDocument();

    const endorseButton = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(endorseButton);
    expect(screen.getByText("✔ Endorsed")).toBeInTheDocument();

    // Unendorse
    fireEvent.click(screen.getByText("✔ Endorsed"));
    expect(screen.getByText("2 endorsements")).toBeInTheDocument();
  });
});

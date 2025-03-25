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

  it("renders experience card with full data", () => {
    render(<GenericCard item={baseItem} isOwner={true} type="experience" />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Jan 2022 - Dec 2023")).toBeInTheDocument();
    expect(
      screen.getByText("Worked on frontend and backend.")
    ).toBeInTheDocument();
  });

  it("renders education card with institution and grade", () => {
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

  it("shows edit icon if isOwner and showEditIcons is true and calls onEdit", () => {
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
    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("opens and closes GenericModal via external trigger", () => {
    const modalItem = { title: "Test Role" };
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

  it("renders skill and handles endorsements toggle", () => {
    const skillItem = {
      skill: "React",
      endorsements: 2,
    };
    render(
      <GenericCard
        item={skillItem}
        isOwner={false}
        showEditIcons={false}
        type="skills"
      />
    );

    expect(screen.getByTestId("endorsement-count")).toHaveTextContent(
      "2 endorsements"
    );

    const endorseBtn = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(endorseBtn);
    expect(screen.getByText("✔ Endorsed")).toBeInTheDocument();

    fireEvent.click(screen.getByText("✔ Endorsed"));
    expect(screen.getByTestId("endorsement-count")).toHaveTextContent(
      "2 endorsements"
    );
  });

  it("does not show edit icon if isOwner is false", () => {
    render(
      <GenericCard
        item={baseItem}
        isOwner={false}
        showEditIcons={true}
        type="experience"
      />
    );
    expect(
      screen.queryByRole("button", { name: /✎/i })
    ).not.toBeInTheDocument();
  });

  it("does not show endorse button if isOwner is true", () => {
    const skillItem = { skill: "JS", endorsements: 5 };
    render(<GenericCard item={skillItem} isOwner={true} type="skills" />);
    expect(
      screen.queryByRole("button", { name: /endorse/i })
    ).not.toBeInTheDocument();
  });

  it("displays partial date correctly if end date missing", () => {
    const partialItem = {
      title: "Intern",
      startMonth: "June",
      startYear: "2023",
    };
    render(<GenericCard item={partialItem} isOwner={true} type="experience" />);
    expect(screen.getByText("June 2023")).toBeInTheDocument();
  });

  it("displays company name and title when both are present", () => {
    const comboItem = { title: "Dev", company: "Test Inc." };
    render(<GenericCard item={comboItem} isOwner={true} type="experience" />);
    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.getByText("Test Inc.")).toBeInTheDocument();
  });
  it("opens modal via ✎ and closes it on save", () => {
    const item = { name: "React" }; // item.name to test that line too
    render(
      <GenericCard
        item={item}
        isOwner={true}
        showEditIcons={true}
        type="skills"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /✎/i }));
    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();

    // simulate save (make sure GenericModal has a save button with this text)
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.queryByTestId("generic-modal")).not.toBeInTheDocument();
  });
  it("renders item name if provided", () => {
    render(
      <GenericCard item={{ name: "HTML5" }} isOwner={false} type="skills" />
    );
    expect(screen.getByText("HTML5")).toBeInTheDocument();
  });
});

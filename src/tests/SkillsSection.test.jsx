import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SkillsSection from "../pages/UserProfile/Components/Sections/SkillsSection";

// Mock GenericSection component
vi.mock(
  "../pages/UserProfile/Components/GenericDisplay/GenericSection",
  () => ({
    default: ({ title, type, items }) => (
      <div>
        <h2>{title}</h2>
        <div data-testid="type">{type}</div>
        <ul>
          {Array.isArray(items) &&
            items.map((item, index) => (
              <li key={index} data-testid="skill-item">
                {item.skill}
              </li>
            ))}
        </ul>
      </div>
    ),
  })
);

describe("SkillsSection Component", () => {
  const mockUser = {
    skills: [{ skill: "JavaScript" }, { skill: "React" }],
  };

  it("renders title and skills", () => {
    render(<SkillsSection isOwner={true} user={mockUser} />);

    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("skills");
    expect(screen.getAllByTestId("skill-item")).toHaveLength(2);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders nothing if skills array is empty", () => {
    render(<SkillsSection isOwner={false} user={{ skills: [] }} />);
    expect(screen.queryByTestId("skill-item")).not.toBeInTheDocument();
  });

  it("renders safely if skills field is missing", () => {
    render(<SkillsSection isOwner={false} user={{}} />);
    expect(screen.queryByTestId("skill-item")).not.toBeInTheDocument();
  });
});

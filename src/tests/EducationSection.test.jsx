import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EducationSection from "../pages/UserProfile/Components/Sections/EducationSection";

// Mock the GenericSection component to simplify testing
vi.mock(
  "../pages/UserProfile/Components/GenericDisplay/GenericSection",
  () => ({
    default: ({ title, type, items }) => (
      <div>
        <h2>{title}</h2>
        <div data-testid="type">{type}</div>
        <ul>
          {items.map((item, index) => (
            <li key={index} data-testid="edu-item">
              {item.institution}
            </li>
          ))}
        </ul>
      </div>
    ),
  }),
);

describe("EducationSection Component", () => {
  const mockUser = {
    education: [
      { institution: "Cairo University", degree: "Bachelor's" },
      { institution: "MIT", degree: "Master's" },
    ],
  };

  it("renders title and education items", () => {
    render(<EducationSection isOwner={true} user={mockUser} />);

    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("education");
    expect(screen.getAllByTestId("edu-item")).toHaveLength(2);
    expect(screen.getByText("Cairo University")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("renders an empty section if no education is provided", () => {
    render(<EducationSection isOwner={false} user={{ education: [] }} />);
    expect(screen.queryByTestId("edu-item")).not.toBeInTheDocument();
  });

  it("handles missing education field gracefully", () => {
    render(<EducationSection isOwner={false} user={{}} />);
    expect(screen.queryByTestId("edu-item")).not.toBeInTheDocument();
  });
});

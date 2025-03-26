import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExperienceSection from "../pages/UserProfile/Components/Sections/ExperienceSection";

// Mock the GenericSection component
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
              <li key={index} data-testid="exp-item">
                {item.title}
              </li>
            ))}
        </ul>
      </div>
    ),
  })
);

describe("ExperienceSection Component", () => {
  const mockUser = {
    experience: [
      { title: "Frontend Developer", company: "Google" },
      { title: "Software Engineer", company: "Meta" },
    ],
  };

  it("renders title and experience items", () => {
    render(<ExperienceSection isOwner={true} user={mockUser} />);

    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("experience");
    expect(screen.getAllByTestId("exp-item")).toHaveLength(2);
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders nothing if experience is empty", () => {
    render(<ExperienceSection isOwner={false} user={{ experience: [] }} />);
    expect(screen.queryByTestId("exp-item")).not.toBeInTheDocument();
  });

  it("renders safely if experience field is missing", () => {
    render(<ExperienceSection isOwner={false} user={{}} />);
    expect(screen.queryByTestId("exp-item")).not.toBeInTheDocument();
  });
});

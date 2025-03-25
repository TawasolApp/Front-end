import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Outlet, useOutletContext } from "react-router-dom";
import ProfilePage from "../pages/UserProfile/Components/ProfilePage";

// ✅ Mock all subcomponents to isolate layout behavior
vi.mock(
  "../../src/pages/UserProfile/Components/HeaderComponents/ProfileHeader",
  () => ({
    default: () => <div data-testid="profile-header">ProfileHeader</div>,
  })
);
vi.mock(
  "../../src/pages/UserProfile/Components/Sections/EducationSection",
  () => ({
    default: () => <div data-testid="education-section">EducationSection</div>,
  })
);
vi.mock(
  "../../src/pages/UserProfile/Components/Sections/ExperienceSection",
  () => ({
    default: () => (
      <div data-testid="experience-section">ExperienceSection</div>
    ),
  })
);
vi.mock(
  "../../src/pages/UserProfile/Components/Sections/SkillsSection",
  () => ({
    default: () => <div data-testid="skills-section">SkillsSection</div>,
  })
);
vi.mock(
  "../../src/pages/UserProfile/Components/Sections/CertificationsSection",
  () => ({
    default: () => (
      <div data-testid="certifications-section">CertificationsSection</div>
    ),
  })
);

// ✅ Mock useOutletContext
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: () => ({
      user: { firstName: "Fatma", lastName: "Gamal" },
      isOwner: true,
    }),
  };
});

describe("ProfilePage", () => {
  it("renders all main profile sections", () => {
    render(<ProfilePage />);

    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("education-section")).toBeInTheDocument();
    expect(screen.getByTestId("experience-section")).toBeInTheDocument();
    expect(screen.getByTestId("skills-section")).toBeInTheDocument();
    expect(screen.getByTestId("certifications-section")).toBeInTheDocument();
  });
});

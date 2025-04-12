import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../../../src/pages/UserProfile/Components/ProfilePage";

// ✅ First, spy on react-router mock before importing ProfilePage
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

// ✅ Then import the mocked function
import { useOutletContext } from "react-router-dom";

// ✅ Mock all subcomponents
vi.mock(
  "../../../src/pages/UserProfile/Components/HeaderComponents/ProfileHeader",
  () => ({
    default: () => <div data-testid="profile-header">ProfileHeader</div>,
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Sections/EducationSection",
  () => ({
    default: () => <div data-testid="education-section">EducationSection</div>,
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Sections/ExperienceSection",
  () => ({
    default: () => (
      <div data-testid="experience-section">ExperienceSection</div>
    ),
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Sections/SkillsSection",
  () => ({
    default: () => <div data-testid="skills-section">SkillsSection</div>,
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Sections/CertificationsSection",
  () => ({
    default: () => (
      <div data-testid="certifications-section">CertificationsSection</div>
    ),
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Profilevisibility/RestrictedProfilevisibility",
  () => ({
    default: ({ visibility }) => (
      <div data-testid="restricted-profile">Restricted: {visibility}</div>
    ),
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/UserPostsSlider/UserPostsSlider",
  () => ({
    default: () => <div data-testid="posts-slider">PostsSlider</div>,
  }),
);
vi.mock(
  "../../../src/pages/UserProfile/Components/Sections/AboutSection",
  () => ({
    default: () => <div data-testid="about-section">AboutSection</div>,
  }),
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProfilePage", () => {
  it("renders all main profile sections when visible", () => {
    useOutletContext.mockReturnValue({
      user: {
        firstName: "Fatma",
        lastName: "Gamal",
        visibility: "public",
        connectStatus: "Connection",
      },
      isOwner: true,
      onUserUpdate: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("about-section")).toBeInTheDocument();
    expect(screen.getByTestId("education-section")).toBeInTheDocument();
    expect(screen.getByTestId("experience-section")).toBeInTheDocument();
    expect(screen.getByTestId("skills-section")).toBeInTheDocument();
    expect(screen.getByTestId("certifications-section")).toBeInTheDocument();
    expect(screen.getByTestId("posts-slider")).toBeInTheDocument();
  });

  it("renders restricted message when profile is not visible", () => {
    useOutletContext.mockReturnValue({
      user: {
        visibility: "private",
        connectStatus: "NotConnected",
      },
      isOwner: false,
      onUserUpdate: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
    expect(screen.getByTestId("restricted-profile")).toBeInTheDocument();

    expect(screen.queryByTestId("about-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("education-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("experience-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("skills-section")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("certifications-section"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("posts-slider")).not.toBeInTheDocument();
  });
});

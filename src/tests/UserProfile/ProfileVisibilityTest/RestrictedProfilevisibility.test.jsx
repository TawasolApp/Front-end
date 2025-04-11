import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RestrictedProfilevisibility from "../../../pages/UserProfile/Components/Profilevisibility/RestrictedProfilevisibility";

// ✅ Mock image so Vite doesn't inline the SVG (this prevents errors, not used in test)
vi.mock("../../../../assets/icons/lock.svg", () => ({
  default: "mocked-lock-icon.svg",
}));

describe("RestrictedProfilevisibility", () => {
  it("renders private profile message when visibility is 'private'", () => {
    render(<RestrictedProfilevisibility visibility="private" />);

    expect(screen.getByText("This Profile is Private")).toBeInTheDocument();
    expect(
      screen.getByText("Only the profile owner can view this profile.")
    ).toBeInTheDocument();

    // ✅ Just check image presence and alt
    const image = screen.getByAltText("Lock Icon");
    expect(image).toBeInTheDocument();
  });

  it("renders connection required message when visibility is not private", () => {
    render(<RestrictedProfilevisibility visibility="public" />);

    expect(screen.getByText("This Profile is Private")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Connect with this member to view their full profile and professional journey."
      )
    ).toBeInTheDocument();
  });
});

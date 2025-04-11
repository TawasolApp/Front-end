import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RightSideBar from "../../../pages/Feed/RightSideBar/RightSideBar";

describe("RightSideBar", () => {
  it("renders the sidebar with correct heading text", () => {
    render(<RightSideBar />);

    const heading = screen.getByText("Right Sidebar");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("applies the correct styles to the heading", () => {
    render(<RightSideBar />);

    const heading = screen.getByText("Right Sidebar");
    expect(heading).toHaveClass("text-textPlaceholder", "font-medium", "mb-4");
  });
});

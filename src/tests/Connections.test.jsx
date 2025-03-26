import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Connections from "../../src/pages/UserProfile/Components/Connections";

//  Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Connections Component", () => {
  it("renders back button and heading", () => {
    render(
      <MemoryRouter>
        <Connections />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /← back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /here we'll add the connections/i })
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when back button is clicked", () => {
    render(
      <MemoryRouter>
        <Connections />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: /← back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ViewerView from "../pages/UserProfile/Components/ViewerView";

describe("ViewerView Component", () => {
  const mockUser = {
    mutualFriends: 3,
  };

  it("renders Message, More, and Follow buttons", () => {
    render(<ViewerView user={mockUser} />);

    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("does not render mutual connections info by default", () => {
    render(<ViewerView user={mockUser} />);

    expect(screen.queryByText(/mutual connections/i)).not.toBeInTheDocument();
  });

  //  uncomment and test later if added the mutualFriends section back in
  // it("renders mutual connections info when implemented", () => {
  //   render(<ViewerView user={mockUser} />);
  //   expect(screen.getByText("🔗 3 mutual connections")).toBeInTheDocument();
  // });
});

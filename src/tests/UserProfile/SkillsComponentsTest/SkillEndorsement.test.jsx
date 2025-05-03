import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import SkillEndorsement from "../../../pages/UserProfile/Components/SkillsComponents/SkillEndorsement";
import { axiosInstance as axios } from "../../../apis/axios";

vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock(
  "../../../pages/UserProfile/Components/SkillsComponents/SkillEndorsersModal",
  () => ({
    __esModule: true,
    default: ({ isOpen, onClose }) =>
      isOpen ? (
        <div>
          <p>Modal Content</p>
          <button onClick={onClose}>Close Modal</button>
        </div>
      ) : null,
  })
);

describe("SkillEndorsement", () => {
  const userId = "user123";
  const skillName = "React";
  const viewerId = "viewer1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows endorsement count and opens modal on click", () => {
    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[viewerId, "user2"]}
        viewerId={viewerId}
        isOwner={true}
        connectStatus="NotConnected"
        privacy="public"
      />
    );

    const countText = screen.getByText("2 endorsements");
    expect(countText).toBeInTheDocument();
    fireEvent.click(countText);
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("hides count if endorsementCount is 0 and not public/owner/connected", () => {
    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[]}
        viewerId={viewerId}
        isOwner={false}
        connectStatus="Pending"
        privacy="private"
      />
    );

    expect(screen.queryByText(/endorsement/)).not.toBeInTheDocument();
  });

  it("shows endorse button if viewer is connected and not the owner", () => {
    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[]}
        viewerId={viewerId}
        isOwner={false}
        connectStatus="Connection"
        privacy="private"
      />
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Endorse");
  });

  it("calls endorse API and updates state", async () => {
    axios.post.mockResolvedValueOnce({});
    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[]}
        viewerId={viewerId}
        isOwner={false}
        connectStatus="Connection"
        privacy="public"
      />
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `/connections/${userId}/endorse-skill`,
        { skillName }
      );
      expect(button).toHaveTextContent(/✓\s+Endorsed/);
    });
  });

  it("calls unendorse API and updates state", async () => {
    axios.delete.mockResolvedValueOnce({});
    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[viewerId]}
        viewerId={viewerId}
        isOwner={false}
        connectStatus="Connection"
        privacy="public"
      />
    );

    const button = screen.getByRole("button", { name: /endorsed/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/${userId}/endorsement/${skillName}`
      );
      expect(button).toHaveTextContent("Endorse");
    });
  });

  it("disables button while loading", async () => {
    axios.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 500))
    );

    render(
      <SkillEndorsement
        userId={userId}
        skillName={skillName}
        endorsements={[]}
        viewerId={viewerId}
        isOwner={false}
        connectStatus="Connection"
        privacy="public"
      />
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});

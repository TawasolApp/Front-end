import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SkillEndorsement from "../../../pages/UserProfile/Components/SkillsComponents/SkillEndorsement";
import { axiosInstance as axios } from "../../../apis/axios";

vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("SkillEndorsement", () => {
  const mockUserId = "user123";
  const mockSkill = "React";
  const viewerId = "viewer1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders endorsement count when endorsements exist", () => {
    render(
      <MemoryRouter>
        <SkillEndorsement
          userId={mockUserId}
          skillName={mockSkill}
          endorsements={[viewerId, "otherUser"]}
          viewerId={viewerId}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/2 endorsements?/i)).toBeInTheDocument();
  });
  it("logs error with response.data when endorsement fails", async () => {
    const mockError = { response: { data: "Post failed" } };
    axios.post.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId="user123"
          skillName="React"
          endorsements={[]}
          viewerId="viewer1"
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to endorse skill:",
        "Post failed",
      );
    });

    consoleSpy.mockRestore();
  });
  it("logs error with message when endorsement fails without response", async () => {
    const mockError = { message: "No server response" };
    axios.post.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId="user123"
          skillName="React"
          endorsements={[]}
          viewerId="viewer1"
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to endorse skill:",
        "No server response",
      );
    });

    consoleSpy.mockRestore();
  });
  it("logs error when unendorsement fails", async () => {
    const mockError = { response: { data: "Delete failed" } };
    axios.delete.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId="user123"
          skillName="React"
          endorsements={["viewer1"]}
          viewerId="viewer1"
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorsed/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to unendorse skill:",
        "Delete failed",
      );
    });

    consoleSpy.mockRestore();
  });

  it("logs error when endorsement fails", async () => {
    const mockError = { response: { data: "Post failed" } };
    axios.post.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId="u1"
          skillName="React"
          endorsements={[]}
          viewerId="viewer"
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to endorse skill:",
        "Post failed",
      );
    });

    consoleSpy.mockRestore();
  });

  it("logs error when unendorsement fails", async () => {
    const mockError = { message: "Delete failed" };
    axios.delete.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId="u1"
          skillName="React"
          endorsements={["viewer"]}
          viewerId="viewer"
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorsed/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to unendorse skill:",
        "Delete failed",
      );
    });

    consoleSpy.mockRestore();
  });

  it("endorses a skill when not already endorsed", async () => {
    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId={mockUserId}
          skillName={mockSkill}
          endorsements={[]}
          viewerId={viewerId}
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `/connections/${mockUserId}/endorse-skill`,
        { skillName: mockSkill },
      ),
    );

    expect(await screen.findByText(/✓\s+Endorsed/)).toBeInTheDocument();
  });

  it("unendorses a skill when already endorsed", async () => {
    axios.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId={mockUserId}
          skillName={mockSkill}
          endorsements={[viewerId]}
          viewerId={viewerId}
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorsed/i });
    fireEvent.click(button);

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(
        `/connections/${mockUserId}/endorsement/${mockSkill}`,
      ),
    );

    expect(await screen.findByText(/endorse/i)).toBeInTheDocument();
  });

  it("disables button while loading", async () => {
    let resolve;
    const promise = new Promise((r) => (resolve = r));
    axios.post.mockReturnValue(promise);

    render(
      <MemoryRouter>
        <SkillEndorsement
          userId={mockUserId}
          skillName={mockSkill}
          endorsements={[]}
          viewerId={viewerId}
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /endorse/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    resolve();
  });

  it("opens SkillEndorsersModal on endorsement count click", async () => {
    render(
      <MemoryRouter>
        <SkillEndorsement
          userId={mockUserId}
          skillName={mockSkill}
          endorsements={[viewerId, "otherUser"]}
          viewerId="anotherUser"
        />
      </MemoryRouter>,
    );

    const count = screen.getByText(/2 endorsements?/i);
    fireEvent.click(count);

    await waitFor(() => {
      expect(
        screen.getByText(/no one has endorsed this skill yet/i),
      ).toBeInTheDocument();
    });
  });
});

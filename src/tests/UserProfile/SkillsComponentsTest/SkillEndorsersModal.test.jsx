import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SkillEndorsersModal from "../../../pages/UserProfile/Components/SkillsComponents/SkillEndorsersModal";
import { MemoryRouter } from "react-router-dom";
import { axiosInstance as axios } from "../../../apis/axios";

// ✅ Mock useNavigate *before* importing SkillEndorsersModal
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import * as router from "react-router-dom";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("SkillEndorsersModal", () => {
  const mockUserId = "user123";
  const mockSkillName = "React";
  const mockEndorsers = [
    {
      _id: "endorser1",
      firstName: "John",
      lastName: "Doe",
      profilePicture: "https://example.com/avatar.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId={mockUserId}
          skillName={mockSkillName}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders empty state when no endorsers", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId={mockUserId}
          skillName={mockSkillName}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no one has endorsed this skill yet/i)
      ).toBeInTheDocument();
    });
  });

  it("renders endorsers correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockEndorsers });

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId={mockUserId}
          skillName={mockSkillName}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        mockEndorsers[0].profilePicture
      );
    });
  });

  it("calls onClose when close button is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const mockClose = vi.fn();

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={mockClose}
          userId={mockUserId}
          skillName={mockSkillName}
        />
      </MemoryRouter>
    );

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });
  it("logs error with err.message if response is undefined", async () => {
    const mockError = new Error("Network Error");
    axios.get.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId="errorUser"
          skillName="React"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching endorsers:",
        "Network Error"
      );
    });

    consoleSpy.mockRestore();
  });
  it("renders fallback avatar if profile picture is missing", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "fallbackUser",
          firstName: "NoPic",
          lastName: "User",
          profilePicture: undefined, // triggers the fallback path
        },
      ],
    });

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId="noPicId"
          skillName="React"
        />
      </MemoryRouter>
    );

    const avatar = await screen.findByRole("img");
    expect(avatar).toHaveAttribute("src", "/default-avatar.png");
  });
  it("logs error with response data when fetch fails with response", async () => {
    const mockError = {
      response: { data: "Server error" },
    };
    axios.get.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId="user123"
          skillName="React"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching endorsers:",
        "Server error"
      );
    });

    consoleSpy.mockRestore();
  });

  it("logs error with message when fetch fails without response", async () => {
    const mockError = {
      message: "Network failed",
    };
    axios.get.mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={() => {}}
          userId="user123"
          skillName="React"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching endorsers:",
        "Network failed"
      );
    });

    consoleSpy.mockRestore();
  });

  it("navigates to user profile on endorser name click", async () => {
    const mockNavigate = vi.fn();
    router.useNavigate.mockReturnValue(mockNavigate);

    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "endorser1",
          firstName: "Jane",
          lastName: "Smith",
          profilePicture: "https://example.com/jane.jpg",
        },
      ],
    });

    render(
      <MemoryRouter>
        <SkillEndorsersModal
          isOpen={true}
          onClose={vi.fn()}
          userId="user123"
          skillName="React"
        />
      </MemoryRouter>
    );

    const button = await screen.findByRole("button", { name: "Jane Smith" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/users/endorser1");
    });
  });
});

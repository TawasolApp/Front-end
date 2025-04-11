import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SkillEndorsersModal from "../../../pages/UserProfile/Components/SkillsComponents/SkillEndorsersModal";
import { MemoryRouter } from "react-router-dom";
import { axiosInstance as axios } from "../../../apis/axios";

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
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
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no one has endorsed this skill yet/i),
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        mockEndorsers[0].profilePicture,
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
      </MemoryRouter>,
    );

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });
});

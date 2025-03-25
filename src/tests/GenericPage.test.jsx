import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GenericPage from "../pages/UserProfile/Components/GenericDisplay/GenericPage";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { axiosInstance as axios } from "../apis/axios";

// Mock axios
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock uuid
vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

// Mock react-router-dom outlet context + navigation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useOutletContext: () => ({
      user: {
        id: "1",
        experience: [
          {
            id: "exp1",
            title: "Software Engineer",
            company: "Google",
            startMonth: "Jan",
            startYear: "2022",
            endMonth: "Dec",
            endYear: "2023",
          },
        ],
        skills: [],
      },
      isOwner: true,
    }),
  };
});

describe("GenericPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page with title and items", () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>
    );

    expect(screen.getByText("All Experience")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
  });

  it("opens the add modal when + button is clicked", () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>
    );

    const addButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(addButton);

    expect(screen.getByTestId("generic-modal")).toBeInTheDocument();
  });

  it("opens the edit modal when ✎ button is clicked", async () => {
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>
    );

    const editButton = screen.getAllByText("✎")[0];
    fireEvent.click(editButton);

    expect(await screen.findByTestId("generic-modal")).toBeInTheDocument();
  });

  it("saves new entry via POST", async () => {
    axios.post.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <GenericPage title="Skills" type="skills" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    const input = await screen.findByLabelText(/skill/i);
    fireEvent.change(input, { target: { value: "React" } });

    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/profile/1/skills", {
        id: "mock-uuid",
        skillName: "React",
      });
    });
  });

  it("deletes an entry via DELETE", async () => {
    axios.delete.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <GenericPage title="Experience" type="experience" />
      </MemoryRouter>
    );

    const editButton = screen.getAllByText("✎")[0];
    fireEvent.click(editButton);

    await screen.findByTestId("generic-modal");

    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/profile/1/experience/exp1");
    });
  });
});

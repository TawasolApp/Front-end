import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "../pages/UserProfile/Components/HeaderComponents/EditProfileModal";
import { axiosInstance as axios } from "../apis/axios";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock axios
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
  },
}));

describe("EditProfileModal", () => {
  const user = {
    id: "1",
    firstName: "Fatimah",
    lastName: "Gamal",
    bio: "I am a motivated Software Engineer",
    country: "Egypt",
    city: "Cairo",
    industry: "Computer Engineering",
    experience: [{ title: "Software Engineer", company: "Google" }],
    education: [{ institution: "Harvard University", degree: "Bachelor's" }],
    skills: [{ skillName: "JavaScript" }],
  };

  const onSave = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal and inputs", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    expect(screen.getByLabelText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country\/region \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry \*/i)).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name \*/i);
    const lastNameInput = screen.getByLabelText(/last name \*/i);

    fireEvent.change(firstNameInput, { target: { value: "Fatimah Updated" } });
    fireEvent.change(lastNameInput, { target: { value: "Gamal Updated" } });

    expect(firstNameInput.value).toBe("Fatimah Updated");
    expect(lastNameInput.value).toBe("Gamal Updated");
  });

  it("calls onSave and makes the PATCH request when Save is clicked", async () => {
    axios.patch.mockResolvedValue({
      data: {
        ...user,
        firstName: "Fatimah Updated",
        lastName: "Gamal Updated",
      },
    });

    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Fatimah Updated" },
    });
    fireEvent.change(screen.getByLabelText(/last name \*/i), {
      target: { value: "Gamal Updated" },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith("/profile", {
        id: user.id,
        firstName: "Fatimah Updated",
        lastName: "Gamal Updated",
        selectedExperienceIndex: 0,
        selectedEducationIndex: 0,
      });
      expect(onSave).toHaveBeenCalledWith({
        ...user,
        firstName: "Fatimah Updated",
        lastName: "Gamal Updated",
        selectedExperienceIndex: 0,
        selectedEducationIndex: 0,
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows validation error for empty required fields", async () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    fireEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalled();
  });
  it("shows validation errors for last name, country, and industry", async () => {
    render(
      <EditProfileModal
        user={{ ...user, lastName: "", country: "", industry: "" }}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/country\/region is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/industry is required/i)).toBeInTheDocument();
    });
  });
});

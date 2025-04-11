import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "../../../pages/UserProfile/Components/HeaderComponents/EditProfileModal";
import { axiosInstance as axios } from "../../../apis/axios";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";

vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
  },
}));

const user = {
  _id: "1",
  firstName: "Fatimah",
  lastName: "Gamal",
  location: "Egypt",
  industry: "Tech",
  workExperience: [{ title: "Engineer", company: "Google" }],
  education: [{ institution: "Harvard", degree: "BSc" }],
  skills: [{ skillName: "JavaScript" }],
};

describe("EditProfileModal", () => {
  const onSave = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders all fields", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    expect(screen.getByLabelText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry \*/i)).toBeInTheDocument();
  });

  it("triggers handleChange correctly", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Fatma" },
    });
    expect(screen.getByLabelText(/first name \*/i).value).toBe("Fatma");
  });

  it("handles Save with valid input", async () => {
    axios.patch.mockResolvedValueOnce({
      data: { ...user, firstName: "Fatma Updated" },
    });

    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Fatma Updated" },
    });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Fatma Updated" }),
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/last name \*/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/location \*/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/industry \*/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByTestId("firstName-error")).toBeInTheDocument();
      expect(screen.getByTestId("lastName-error")).toBeInTheDocument();
      expect(screen.getByTestId("location-error")).toBeInTheDocument();
      expect(screen.getByTestId("industry-error")).toBeInTheDocument();
    });
  });

  it("sets selectedExperienceIndex and selectedEducationIndex correctly", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/Work Experience/i), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText(/Education/i), {
      target: { value: "0" },
    });
  });

  it("saves with selected experience and education indices", async () => {
    const updatedUser = {
      ...user,
      firstName: "Fatma",
      selectedExperienceIndex: 0,
      selectedEducationIndex: 0,
    };

    axios.patch.mockResolvedValueOnce({ data: updatedUser });

    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/Work Experience/i), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText(/Education/i), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Fatma" },
    });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Fatma",
          selectedExperienceIndex: 0,
          selectedEducationIndex: 0,
        }),
      );
    });
  });

  it("calls onClose directly if no unsaved changes", () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByLabelText(/close modal/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("opens discard modal if changes made", async () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Changed" },
    });
    fireEvent.click(screen.getByLabelText(/close modal/i));
    expect(await screen.findByText(/discard changes/i)).toBeInTheDocument();
  });

  it("discards changes when confirmed", async () => {
    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "Changed" },
    });
    fireEvent.click(screen.getByLabelText(/close modal/i));
    const discardButton = await screen.findByRole("button", {
      name: /^discard$/i,
    });
    fireEvent.click(discardButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("sets body overflow on mount and resets on unmount", () => {
    const { unmount } = render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("logs error if PATCH request fails", async () => {
    const error = new Error("Request failed");
    axios.patch.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <EditProfileModal
        user={user}
        isOpen={true}
        onSave={onSave}
        onClose={onClose}
      />,
    );
    fireEvent.change(screen.getByLabelText(/first name \*/i), {
      target: { value: "TriggerError" },
    });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to update profile:",
        error.message,
      );
    });

    consoleSpy.mockRestore();
  });
});

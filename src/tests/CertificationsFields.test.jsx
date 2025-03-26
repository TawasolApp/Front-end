// src/tests/CertificationsFields.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CertificationsFields from "../pages/UserProfile/Components/ModalFields/CertificationsFields";

describe("CertificationsFields Component", () => {
  const mockHandleChange = vi.fn();

  const defaultProps = {
    formData: {
      name: "",
      issuingOrganization: "",
      credentialId: "",
      credentialUrl: "",
    },
    handleChange: mockHandleChange,
    errors: {},
  };

  it("renders all fields", () => {
    render(<CertificationsFields {...defaultProps} />);

    expect(screen.getByLabelText(/name\*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/issuing organization\*/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/credential id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/credential url/i)).toBeInTheDocument();
  });

  it("renders errors if provided", () => {
    const errors = {
      name: "Name is required",
      issuingOrganization: "Organization is required",
    };

    render(<CertificationsFields {...defaultProps} errors={errors} />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Organization is required")).toBeInTheDocument();
  });

  it("calls handleChange on input change", () => {
    render(<CertificationsFields {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/name\*/i), {
      target: { value: "AWS Certified" },
    });

    fireEvent.change(screen.getByLabelText(/credential id/i), {
      target: { value: "12345" },
    });

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
  });
});

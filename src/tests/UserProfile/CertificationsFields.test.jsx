// ✅ STEP 1: Mock axios instance BEFORE importing the component
const mockedAxiosInstance = {
  get: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
  },
};

vi.mock("../../../../apis/axios", () => ({
  axiosInstance: mockedAxiosInstance,
}));

// ✅ STEP 2: Now import the rest
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import CertificationsFields from "../../pages/UserProfile/Components/ModalFields/CertificationsFields";

// ✅ Prevent location.href crash in jsdom
beforeAll(() => {
  delete window.location;
  window.location = { href: vi.fn() };
});

describe("CertificationsFields Component", () => {
  const mockHandleChange = vi.fn();
  const mockSetFormData = vi.fn();

  const defaultProps = {
    formData: {
      name: "",
      company: "",
    },
    setFormData: mockSetFormData,
    handleChange: mockHandleChange,
    errors: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders required fields", () => {
    render(<CertificationsFields {...defaultProps} />);
    expect(screen.getByLabelText(/name\*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/issuing organization\*/i),
    ).toBeInTheDocument();
  });

  it("calls handleChange on name input change", () => {
    render(<CertificationsFields {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/name\*/i), {
      target: { value: "AWS Certified" },
    });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("renders errors when provided", () => {
    const errors = {
      name: "Name is required",
      company: "Organization is required",
    };
    render(<CertificationsFields {...defaultProps} errors={errors} />);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Organization is required")).toBeInTheDocument();
  });

  it("filters and shows dropdown options", async () => {
    mockedAxiosInstance.get.mockResolvedValueOnce({
      data: [{ name: "Microsoft", companyId: "1", logo: "logo.png" }],
    });

    render(<CertificationsFields {...defaultProps} />);

    const input = screen.getByLabelText(/issuing organization\*/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Mic" } });

    await waitFor(() => {
      expect(screen.getByText("Microsoft")).toBeInTheDocument();
    });
  });

  it("selects company from dropdown and updates formData", async () => {
    mockedAxiosInstance.get.mockResolvedValueOnce({
      data: [{ name: "Microsoft", companyId: "1", logo: "logo.png" }],
    });

    render(<CertificationsFields {...defaultProps} />);

    const input = screen.getByLabelText(/issuing organization\*/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Mic" } });

    await waitFor(() => {
      expect(screen.getByText("Microsoft")).toBeInTheDocument();
      fireEvent.mouseDown(screen.getByText("Microsoft"));
    });

    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        company: "Microsoft",
        companyId: "1",
        companyLogo: "logo.png",
      }),
    );
  });
});

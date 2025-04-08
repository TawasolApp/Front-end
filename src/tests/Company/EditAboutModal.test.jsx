import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import EditAboutModal from "../../pages/Company/Components/Modals/EditAboutModal";
import { axiosInstance as axios } from "../../apis/axios";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

describe("EditAboutModal", () => {
  const defaultCompany = {
    companyId: 1,
    name: "Company Name",
    logo: "logo-url",
    banner: "banner-url",
    description: "Old Description",
    overview: "Old Overview",
    industry: "Tech",
    address: "123 Street",
    website: "https://company.com",
    contactNumber: "1234567890",
    isVerified: true,
    founded: "2000",
    email: "email@company.com",
    location: "https://map.com",
    companySize: "51-400 Employees",
    companyType: "Public Company",
  };

  const onClose = vi.fn();
  const setCompanyData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.classList.remove("overflow-hidden");
  });

  afterEach(() => {
    document.body.classList.remove("overflow-hidden");
  });

  test("does not render when show is false", () => {
    const { container } = render(
      <EditAboutModal
        show={false}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders all form fields when show is true", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    expect(screen.getByDisplayValue("Old Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Overview")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Street")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://company.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("email@company.com")).toBeInTheDocument();
  });

  test("allows editing description", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const input = screen.getByDisplayValue("Old Description");
    fireEvent.change(input, { target: { value: "New Description" } });

    expect(input.value).toBe("New Description");
  });

  test("submits changes and closes modal", async () => {
    axios.patch.mockResolvedValueOnce({
      data: { description: "New Description" },
    });

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const input = screen.getByDisplayValue("Old Description");
    fireEvent.change(input, { target: { value: "New Description" } });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        "/companies/1",
        expect.objectContaining({ description: "New Description" })
      );
      expect(setCompanyData).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("shows error message if update fails", async () => {
    axios.patch.mockRejectedValueOnce({
      response: { data: { message: "Update failed." } },
    });

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Update failed."
      );
    });
  });

  test("closes modal on ✖ click", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    fireEvent.click(screen.getByText("✖"));
    expect(onClose).toHaveBeenCalled();
  });

  test("toggles verified checkbox", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={{ ...defaultCompany, isVerified: false }}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: /Verified Page/i });
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test("sets body overflow-hidden when modal is open", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(true);
  });

  // Additional Tests for File Upload

  test("uploads banner file successfully", async () => {
    const file = new File(["banner-image"], "banner.jpg", {
      type: "image/jpeg",
    });
    axios.post.mockResolvedValueOnce({ data: { url: "banner-url" } });

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const fileInput = screen.getByTestId("banner-upload-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const bannerImage = screen.getByTestId("banner-image"); // Use the test ID for the image
      expect(bannerImage).toHaveAttribute("src", "banner-url"); // Check if the src attribute has been updated
    });
  });

  test("shows error message on banner upload failure", async () => {
    const file = new File(["banner-image"], "banner.jpg", {
      type: "image/jpeg",
    });
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const fileInput = screen.getByTestId("banner-upload-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Failed to upload banner. Please try again."
      );
    });
  });

  test("uploads logo file successfully", async () => {
    const file = new File(["logo-image"], "logo.jpg", {
      type: "image/jpeg",
    });
    axios.post.mockResolvedValueOnce({ data: { url: "logo-url" } });

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const fileInput = screen.getByTestId("logo-upload-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const logoImage = screen.getByTestId("logo-image");
      expect(logoImage).toHaveAttribute("src", "logo-url");
    });
  });

  test("shows error message on logo upload failure", async () => {
    const file = new File(["logo-image"], "logo.jpg", {
      type: "image/jpeg",
    });
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    render(
      <EditAboutModal
        show={true}
        companyData={defaultCompany}
        onClose={onClose}
        setCompanyData={setCompanyData}
      />
    );

    const fileInput = screen.getByTestId("logo-upload-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Failed to upload logo. Please try again."
      );
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import EditAboutModal from "../pages/CompanyPage/Components/EditAboutModal";
import { axiosInstance as axios } from "../apis/axios";

vi.mock("../apis/axios", () => ({
  axiosInstance: {
    patch: vi.fn(),
  },
}));
const mockedAxios = axios;

describe("EditAboutModal", () => {
  const mockCompanyData = {
    companyId: 1,
    logo: "logo-url",
    banner: "banner-url",
    description: "Old Description",
    overview: "Old Overview",
    industry: "Tech",
    address: "123 Street",
    website: "https://company.com",
    contactNumber: "1234567890",
    isVerified: true,
    verification_date: "2023-01-01",
    founded: "2000",
    specialities: "IT Services",
    location: "Map URL",
  };

  const onClose = vi.fn();

  beforeEach(() => {
    document.body.classList.remove("overflow-hidden");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("does not render if show is false", () => {
    const { container } = render(
      <EditAboutModal
        show={false}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders modal with data when show is true", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    expect(screen.getByDisplayValue("Old Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old Overview")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
  });

  test("allows editing fields", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    const descriptionInput = screen.getByDisplayValue("Old Description");
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });

    expect(descriptionInput.value).toBe("New Description");
  });

  test("submits form and closes modal", async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });
    delete window.location;
    window.location = { reload: vi.fn() };

    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("Old Description"), {
      target: { value: "Updated Description" },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/companies/1",
        expect.objectContaining({ description: "Updated Description" }),
      );
      expect(onClose).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test("toggles body overflow-hidden when modal is shown/hidden", () => {
    const { rerender } = render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(true);

    rerender(
      <EditAboutModal
        show={false}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(false);
  });
  test("shows error message if update fails", async () => {
    axios.patch.mockRejectedValueOnce(new Error("Request failed"));

    render(
      <EditAboutModal
        show={true}
        companyData={{ companyId: 1 }}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Save Changes"));

    expect(await screen.findByTestId("error-message")).toHaveTextContent(
      "Failed to update company profile.",
    );
  });
  test("renders default values for missing company data", () => {
    render(<EditAboutModal show={true} companyData={{}} onClose={onClose} />);

    expect(screen.getByPlaceholderText("Enter new banner URL")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter new logo URL")).toHaveValue("");
  });

  test("checks and unchecks verified checkbox", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={{ isVerified: false }}
        onClose={onClose}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Verified Page" });

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test("closes modal when close button is clicked", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByText("✖"));
    expect(onClose).toHaveBeenCalled();
  });

  test("renders company logo and banner", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    const logo = screen.getByAltText("Company Logo");
    const banner = screen.getByAltText("Company Banner");

    expect(logo).toHaveAttribute("src", "logo-url");
    expect(banner).toHaveAttribute("src", "banner-url");
  });

  test("renders all input fields", () => {
    render(
      <EditAboutModal
        show={true}
        companyData={mockCompanyData}
        onClose={onClose}
      />,
    );

    expect(
      screen.getByPlaceholderText("Enter new banner URL"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter new logo URL"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://company.com")).toBeInTheDocument();
  });
});

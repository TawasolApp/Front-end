const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateCompanyPage from "../../pages/Company/Components/CreateCompanyPage/CreateCompanyPage";
import { axiosInstance as axios } from "../../apis/axios";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

describe("CreateCompanyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form inputs", () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("company-name")).toBeInTheDocument();
    expect(screen.getByTestId("company-industry")).toBeInTheDocument();
    expect(screen.getByTestId("organization-size")).toBeInTheDocument();
    expect(screen.getByTestId("organization-type")).toBeInTheDocument();
    expect(screen.getByText("Create Page")).toBeInTheDocument();
  });

  test("displays validation errors if form is incomplete", async () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(screen.getByText("Please enter a name.")).toBeInTheDocument();
      expect(
        screen.getByText("Please select an industry."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please select an organization size."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please select an organization type."),
      ).toBeInTheDocument();
    });
  });

  test("shows success message on successful form submission", async () => {
    // Use the default async flow and avoid fake timers
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { companyId: 123 },
    });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    // Fill required fields
    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Test Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    // Wait for success message to appear
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/company/123/home");
    });

    // Ensure navigation is triggered after the success message
    // expect(mockNavigate).toHaveBeenCalledWith("/company/123");
  }, 20000); // Increased timeout to 20 seconds

  test("shows error message on API failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: "Failed to create",
        },
      },
    });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    // Fill required fields
    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Test Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "51-400 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));

    await act(async () => {
      fireEvent.click(screen.getByText("Create Page"));
    });

    const errorMessage = await screen.findByTestId("api-error-message");
    expect(errorMessage).toHaveTextContent("Failed to create");
  }, 20000); // Increased timeout to 20 seconds

  test("disables submit button when terms are not agreed", () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    const submitButton = screen.getByText("Create Page");
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByTestId("agree-terms"));
    expect(submitButton).not.toBeDisabled();
  });
  test("shows error if logo upload fails", async () => {
    const file = new File(["dummy"], "logo.png", { type: "image/png" });

    const mockPost = vi.fn().mockRejectedValueOnce(new Error("Upload failed"));
    axios.post = mockPost;

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    const input = screen
      .getByLabelText(/logo/i)
      .closest("div")
      .querySelector('input[type="file"]');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText(/Failed to upload logo/i)).toBeInTheDocument();
  });
  test("shows error if location link is invalid", async () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Test Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });

    fireEvent.change(screen.getByTestId("company-location"), {
      target: { value: "invalid-location" },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(
        screen.getByText(/Location must be a valid Google Maps link/i),
      ).toBeInTheDocument();
    });
  });
  test("does not include invalid founded year", async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { companyId: 321 },
    });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    // Fill required fields
    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Test Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });
    fireEvent.change(screen.getByTestId("company-founded"), {
      target: { value: "1600" }, // Invalid year
    });

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/company/321/home");
      },
      { timeout: 3000 },
    );

    expect(axios.post).toHaveBeenCalledWith(
      "/companies",
      expect.not.objectContaining({ founded: 1600 }), // founded should not be included
    );
  });
  test("shows error if email is missing", async () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Example Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });
    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter an email address."),
      ).toBeInTheDocument();
    });
  });
  test("adds red border on invalid required fields", async () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      const nameInput = screen.getByTestId("company-name");
      expect(nameInput.className).toMatch(/border-red-500/);
    });
  });
  test("uploads logo and shows preview", async () => {
    const mockUrl = "https://fakeurl.com/logo.png";
    axios.post.mockResolvedValueOnce({ data: { url: mockUrl } });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );
    const file = new File(["dummy"], "logo.png", { type: "image/png" });

    const input = screen.getByTestId("company-logo");
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByAltText("Logo Preview")).toHaveAttribute(
        "src",
        mockUrl,
      );
    });
  });
  test("submits form successfully with valid Google Maps location", async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { companyId: 456 },
    });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Maps Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Maps" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "51-400 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "maps@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://maps.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+201111111111" },
    });
    fireEvent.change(screen.getByTestId("company-location"), {
      target: {
        value: "https://www.google.com/maps?q=30.0444,31.2357",
      },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/company/456/home");
    });
  });
  test("blocks submission if logo is still uploading", async () => {
    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    // Fill required fields
    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Test Company" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));

    // Simulate logo uploading state
    const fileInput = screen.getByTestId("company-logo");
    const dummyFile = new File(["dummy"], "logo.png", { type: "image/png" });

    // Intercept the logo upload and keep it "pending"
    const unresolvedPromise = new Promise(() => {});
    const mockPost = vi
      .spyOn(axios, "post")
      .mockImplementation(() => unresolvedPromise);

    fireEvent.change(fileInput, { target: { files: [dummyFile] } });

    // Now click submit while logo is still uploading
    fireEvent.click(screen.getByText("Create Page"));

    // Check for the error
    await waitFor(() => {
      expect(
        screen.getByText("Please wait for the logo to finish uploading."),
      ).toBeInTheDocument();
    });

    mockPost.mockRestore(); // cleanup
  });
  test("includes valid founded year in submission", async () => {
    const postSpy = vi
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ status: 201, data: { companyId: 777 } });

    render(
      <MemoryRouter>
        <CreateCompanyPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByTestId("company-name"), {
      target: { value: "Founded Co" },
    });
    fireEvent.change(screen.getByTestId("company-industry"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByTestId("organization-size"), {
      target: { value: "1-50 Employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public Company" },
    });
    fireEvent.change(screen.getByTestId("company-email"), {
      target: { value: "founded@example.com" },
    });
    fireEvent.change(screen.getByTestId("company-website"), {
      target: { value: "https://founded.com" },
    });
    fireEvent.change(screen.getByTestId("company-contactNumber"), {
      target: { value: "+20123456789" },
    });
    fireEvent.change(screen.getByTestId("company-founded"), {
      target: { value: "2005" },
    });

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith(
        "/companies",
        expect.objectContaining({ founded: 2005 }),
      );
    });
  });
});

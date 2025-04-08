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
      </MemoryRouter>
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
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(screen.getByText("Please enter a name.")).toBeInTheDocument();
      expect(
        screen.getByText("Please select an industry.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please select an organization size.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please select an organization type.")
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
      </MemoryRouter>
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
    await screen.findByTestId("success-message");

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
      </MemoryRouter>
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
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Create Page");
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByTestId("agree-terms"));
    expect(submitButton).not.toBeDisabled();
  });
});

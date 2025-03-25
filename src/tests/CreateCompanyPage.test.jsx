import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateCompanyPage from "../pages/CompanyPage/Components/CreateCompanyPage";
import { axiosInstance as axios } from "../apis/axios";

vi.mock("../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));
const mockedAxios = axios;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    mockedAxios.post.mockResolvedValueOnce({ status: 201 });

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
      target: { value: "2-10 employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public company" },
    });
    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(
        screen.getByText("Company page created successfully!"),
      ).toBeInTheDocument();
    });
  });

  test("shows error message on API failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: "Failed to create" } },
    });

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
      target: { value: "2-10 employees" },
    });
    fireEvent.change(screen.getByTestId("organization-type"), {
      target: { value: "Public company" },
    });
    fireEvent.click(screen.getByTestId("agree-terms"));
    fireEvent.click(screen.getByText("Create Page"));

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes("Failed to create")),
      ).toBeInTheDocument();
    });
  });

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
});

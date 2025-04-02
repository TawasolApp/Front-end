import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { formatNumbers } from "../utils/formatNumbers";
import CompanyHeader from "../pages/Company/Components/GenericComponents/CompanyHeader";
import { axiosInstance } from "../apis/axios";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
const mockedAxios = axiosInstance;
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
  };
});

describe("formatNumbers function", () => {
  test("formats numbers < 1K correctly", () => {
    expect(formatNumbers(999)).toBe("999");
  });

  test("formats numbers >= 1K and < 1M correctly", () => {
    expect(formatNumbers(1000)).toBe("1K");
    expect(formatNumbers(15432)).toBe("15K");
    expect(formatNumbers(999_999)).toBe("999K");
  });

  test("formats numbers >= 1M correctly", () => {
    expect(formatNumbers(1_000_000)).toBe("1.0M");
    expect(formatNumbers(2_500_000)).toBe("2.5M");
  });
});

describe("CompanyHeader", () => {
  const mockCompany = {
    name: "Test Company",
    banner: "",
    logo: "",
    description: "A test company description",
    address: "Test Address",
    followers: 1234,
    companySize: "201-500 employees",
    website: "https://testcompany.com",
    isFollowing: false,
  };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockCompany });
    mockedAxios.post.mockResolvedValue({});
    mockedAxios.delete.mockResolvedValue({});
  });

  test("handles follow button toggle", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("+ Follow")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("+ Follow"));
    await waitFor(() =>
      expect(screen.getByText("✓ Following")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("✓ Following")); // Open unfollow modal
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to unfollow/i),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByLabelText("Confirm Unfollow"));
    await waitFor(() =>
      expect(screen.getByText("+ Follow")).toBeInTheDocument(),
    );
  });
  test("renders company info correctly", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );
    // Wait for the company name to appear
    await waitFor(() =>
      expect(screen.getByText("Test Company")).toBeInTheDocument(),
    );
    // Wait until the logo and banner are rendered
    const bannerImage = await screen.findByAltText("Company Banner");
    const logoImage = await screen.findByAltText("Company Logo");
    // Assert that the images are in the document
    expect(bannerImage).toBeInTheDocument();
    expect(logoImage).toBeInTheDocument();
    // Verify other company details
    expect(screen.getByText(/A test company description/)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("1K followers")),
    ).toBeInTheDocument();
    expect(screen.getByText("+ Follow")).toBeInTheDocument();
    expect(screen.getByText("Visit website")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("201-500 employees")),
    ).toBeInTheDocument();
  });
  test("opens image enlarge modal when banner is clicked", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    const banner = await screen.findByAltText("Company Banner");
    fireEvent.click(banner);

    const modal = await screen.findByRole("dialog", {
      name: "Enlarged Image Modal",
    });

    expect(modal).toBeInTheDocument();
  });
  test("closes the image enlarge modal when close button is clicked", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    const banner = await screen.findByAltText("Company Banner");
    fireEvent.click(banner);

    const closeBtn = await screen.findByRole("button", {
      name: /close enlarged image/i,
    });
    fireEvent.click(closeBtn);

    expect(screen.queryByAltText("Profile Enlarged")).not.toBeInTheDocument();
  });

  test("handles follow button toggle", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    // Step 1: Wait for "+ Follow" button
    await waitFor(() =>
      expect(screen.getByText("+ Follow")).toBeInTheDocument(),
    );

    // Step 2: Click "+ Follow" → Should change to "✓ Following"
    fireEvent.click(screen.getByText("+ Follow"));

    await waitFor(() =>
      expect(screen.getByText("✓ Following")).toBeInTheDocument(),
    );

    // Step 3: Click "✓ Following" → Opens Unfollow Modal
    fireEvent.click(screen.getByText("✓ Following"));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to unfollow/i),
      ).toBeInTheDocument(),
    );

    // Step 4: Click "Close Unfollow" → Modal should disappear
    const closeunfollow = screen.getByLabelText("Close Unfollow");
    fireEvent.click(closeunfollow);

    await waitFor(() =>
      expect(
        screen.queryByText(/Are you sure you want to unfollow/i),
      ).not.toBeInTheDocument(),
    );

    // Step 5: Click "✓ Following" again → Reopen modal
    fireEvent.click(screen.getByText("✓ Following"));

    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to unfollow/i),
      ).toBeInTheDocument(),
    );

    // Step 6: Click "Unfollow" → Should change back to "+ Follow"
    const confirmunfollow = screen.getByLabelText("Confirm Unfollow");
    fireEvent.click(confirmunfollow);

    await waitFor(() =>
      expect(screen.getByText("+ Follow")).toBeInTheDocument(),
    );
  });

  test("opens the More Options modal when clicking the More Options button", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    // Wait for company data to load
    await waitFor(() =>
      expect(screen.getByText("Test Company")).toBeInTheDocument(),
    );
    const moreOptionsBtn = screen.getByLabelText("More options");
    fireEvent.click(moreOptionsBtn);

    // Expect modal options to appear
    expect(screen.getByText(/Send in a message/i)).toBeInTheDocument();
    expect(screen.getByText(/Report abuse/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a Tawasol Page/i)).toBeInTheDocument();
  });
  test("closes the More Options modal when clicking the More Options button again", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    const moreOptionsBtn = await screen.findByLabelText("More options");
    fireEvent.click(moreOptionsBtn); // open
    fireEvent.click(moreOptionsBtn); // close

    expect(screen.queryByText(/Send in a message/i)).not.toBeInTheDocument(); // modal is gone
  });

  test("opens the Edit About modal when clicking the Edit About button", async () => {
    render(
      <MemoryRouter>
        <CompanyHeader companyId="test-company" />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Test Company")).toBeInTheDocument(),
    );
    const editBtn = screen.getByLabelText("Edit Company");
    fireEvent.click(editBtn);

    // Check that modal content appears
    expect(screen.getByText(/Edit Company Profile/i)).toBeInTheDocument();
  });

  const buttons = ["Home", "About", "Posts", "Jobs"];

  buttons.forEach((button) => {
    test(`navigates to ${button} page`, async () => {
      render(
        <MemoryRouter>
          <CompanyHeader companyId="test-company" />
        </MemoryRouter>,
      );

      await screen.findByText(button);

      fireEvent.click(screen.getByText(button));

      expect(mockNavigate).toHaveBeenCalledWith(
        `/company/test-company/${button.toLowerCase()}`,
        expect.any(Object),
      );
    });
  });
});

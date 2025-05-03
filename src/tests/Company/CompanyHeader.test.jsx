import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CompanyHeader from "../../pages/Company/Components/GenericComponents/CompanyHeader";
import { axiosInstance } from "../../apis/axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/company/test-company/home" }),
  };
});

const mockCompany = {
  companyId: "test-company",
  name: "Test Company",
  banner: "",
  logo: "",
  description: "A test company description",
  address: "Test Address",
  followers: 1234,
  companySize: "201-500 employees",
  website: "https://testcompany.com",
  isFollowing: false,
  isManager: false,
};

const renderHeader = (props = {}) => {
  return render(
    <MemoryRouter>
      <CompanyHeader
        company={{ ...mockCompany, ...props.company }}
        setCompanyData={vi.fn()}
        showAdminIcons={props.showAdminIcons ?? false}
        setShowAdminIcons={props.setShowAdminIcons ?? vi.fn()}
        isAdmin={props.isAdmin ?? false}
      />
    </MemoryRouter>
  );
};

describe("CompanyHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.post.mockResolvedValue({});
    axiosInstance.delete.mockResolvedValue({});
  });

  test("follow and unfollow flow works", async () => {
    renderHeader({ company: { isFollowing: true } });
    fireEvent.click(await screen.findByText("✓ Following"));
    fireEvent.click(await screen.findByLabelText("Confirm Unfollow"));
    expect(await screen.findByText("+ Follow")).toBeInTheDocument();
  });

  test("more options toggles modal", async () => {
    renderHeader();
    const moreBtn = await screen.findByLabelText("More options");
    fireEvent.click(moreBtn);
    expect(screen.getByText(/Share Page/i)).toBeInTheDocument();
    fireEvent.click(moreBtn);
    expect(screen.queryByText(/Send in a message/i)).not.toBeInTheDocument();
  });

  test("edit modal shows for admin", async () => {
    renderHeader({ isAdmin: true, showAdminIcons: true });
    fireEvent.click(await screen.findByLabelText("Edit Company"));
    expect(screen.getByText(/Edit Company Profile/i)).toBeInTheDocument();
  });

  test("shows add manager button for admins", async () => {
    renderHeader({
      isAdmin: true,
      showAdminIcons: true,
      company: { isManager: true },
    });
    expect(await screen.findByText("Add Manager")).toBeInTheDocument();
  });

  test("toggles admin view buttons correctly", async () => {
    const setShowAdminIcons = vi.fn();
    renderHeader({ isAdmin: true, setShowAdminIcons });
    fireEvent.click(await screen.findByText("Show Admin View"));
    expect(setShowAdminIcons).toHaveBeenCalledWith(true);
  });

  test("shows followers modal when followers count clicked", async () => {
    renderHeader();
    const buttons = screen.getAllByText(/followers/i);
    fireEvent.click(buttons.find((btn) => btn.tagName === "BUTTON"));
    expect(
      screen.getByRole("heading", { name: /followers/i })
    ).toBeInTheDocument();
  });

  ["Home", "About", "Posts", "Jobs"].forEach((label) => {
    test(`navigates to ${label}`, async () => {
      renderHeader();
      fireEvent.click(await screen.findByText(label));
      expect(mockNavigate).toHaveBeenCalledWith(
        `/company/${mockCompany.companyId}/${label.toLowerCase()}`,
        expect.any(Object)
      );
    });
  });
  test("renders LoadingPage if company is not provided", () => {
    render(
      <MemoryRouter>
        <CompanyHeader
          company={null}
          setCompanyData={vi.fn()}
          showAdminIcons={false}
          setShowAdminIcons={vi.fn()}
          isAdmin={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  test("follows a company when not already following", async () => {
    renderHeader();
    const followBtn = await screen.findByText("+ Follow");
    fireEvent.click(followBtn);

    await waitFor(() =>
      expect(screen.getByText("✓ Following")).toBeInTheDocument()
    );
  });
  test("shows 'Show Admin View' button for admins when icons hidden", async () => {
    const setShowAdminIcons = vi.fn();
    renderHeader({ isAdmin: true, showAdminIcons: false, setShowAdminIcons });

    const toggleBtn = await screen.findByText("Show Admin View");
    fireEvent.click(toggleBtn);
    expect(setShowAdminIcons).toHaveBeenCalledWith(true);
  });
  test("shows 'Show User View' button and toggles to user view", async () => {
    const setShowAdminIcons = vi.fn();
    renderHeader({ isAdmin: true, showAdminIcons: true, setShowAdminIcons });

    const toggleBtn = await screen.findByText("Show User View");
    fireEvent.click(toggleBtn);
    expect(setShowAdminIcons).toHaveBeenCalledWith(false);
  });
  test("renders the company website link correctly", () => {
    renderHeader();
    const websiteLink = screen.getByText("Visit website").closest("a");
    expect(websiteLink).toHaveAttribute("href", "https://testcompany.com");
    expect(websiteLink).toHaveAttribute("target", "_blank");
  });
  test("opens unfollow modal when clicking '✓ Following'", async () => {
    renderHeader({
      company: { isFollowing: true },
      isAdmin: false,
      showAdminIcons: false,
    });

    // Click the follow button
    const followBtn = await screen.findByText("✓ Following");
    fireEvent.click(followBtn);

    // Check if modal is now visible
    expect(
      screen.getByText(/are you sure you want to unfollow/i)
    ).toBeInTheDocument();
  });

  test("handles 409 error on follow attempt gracefully", async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { status: 409 },
    });

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHeader({ isAdmin: false });

    fireEvent.click(await screen.findByText("+ Follow"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Already following this company."
      );
    });

    consoleSpy.mockRestore();
  });
  test("logs error when follow request fails with other error", async () => {
    const mockError = new Error("Server Down");
    axiosInstance.post.mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderHeader({ isAdmin: false });

    fireEvent.click(await screen.findByText("+ Follow"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error following company:",
        mockError
      );
    });

    consoleSpy.mockRestore();
  });
  test("closes unfollow modal when Cancel is clicked", async () => {
    renderHeader({
      company: { isFollowing: true },
      isAdmin: false,
      showAdminIcons: false,
    });

    // Open the unfollow modal
    fireEvent.click(await screen.findByText("✓ Following"));

    // Click cancel
    fireEvent.click(screen.getByLabelText("Close Unfollow"));

    // Modal should disappear
    await waitFor(() => {
      expect(
        screen.queryByText(/Are you sure you want to unfollow/i)
      ).not.toBeInTheDocument();
    });
  });
  test("opens Add Manager modal when button is clicked", async () => {
    renderHeader({
      isAdmin: true,
      showAdminIcons: true,
      company: { isManager: true },
    });

    // Click the actual button (not the modal heading)
    const buttons = screen.getAllByText(/Add Manager/i);
    const actualButton = buttons.find((el) => el.tagName === "BUTTON");
    fireEvent.click(actualButton);

    // Check that the modal heading is present
    expect(
      screen.getByRole("heading", { name: /Add Manager/i })
    ).toBeInTheDocument();
  });

  test("enlarges banner when clicked", async () => {
    renderHeader();
    const banner = await screen.findByAltText("Company Banner");
    fireEvent.click(banner);

    // Assuming dialog/modal shows up
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  test("closes image modal when close button clicked", async () => {
    renderHeader();

    // Open the modal
    fireEvent.click(screen.getByAltText("Company Banner"));

    // Close it
    const closeButton = screen.getByLabelText(/close enlarged image/i);
    fireEvent.click(closeButton);

    // Assert modal is gone
    expect(
      screen.queryByRole("dialog", { name: /enlarged image modal/i })
    ).not.toBeInTheDocument();
  });
  test("closes EditAboutModal when onClose is triggered", async () => {
    renderHeader({ isAdmin: true, showAdminIcons: true });
    fireEvent.click(await screen.findByLabelText("Edit Company"));

    // Close modal (you may need a specific close button or `onClose`)
    const closeBtn = screen.getByLabelText("Close Edit Modal"); // use appropriate label if exists
    fireEvent.click(closeBtn);

    await waitFor(() =>
      expect(
        screen.queryByText(/Edit Company Profile/i)
      ).not.toBeInTheDocument()
    );
  });
  test("closes AddManagerModal when onClose is called", async () => {
    renderHeader({ isAdmin: true, showAdminIcons: true });

    fireEvent.click(screen.getByText("Add Manager"));

    // You might simulate the modal's close button here
    fireEvent.click(screen.getByLabelText("Close Add Manager Modal"));

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: /add manager/i })
      ).not.toBeInTheDocument()
    );
  });
  test("closes FollowersModal when onClose is called", async () => {
    renderHeader();

    fireEvent.click(
      screen.getAllByText(/followers/i).find((btn) => btn.tagName === "BUTTON")
    );

    const closeBtn = screen.getByLabelText("Close Followers Modal");
    fireEvent.click(closeBtn);

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: /followers/i })
      ).not.toBeInTheDocument()
    );
  });
});

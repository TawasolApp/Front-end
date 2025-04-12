import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import FollowersModal from "../../pages/Company/Components/Modals/FollowersModal";
import { axiosInstance as axios } from "../../apis/axios";

vi.mock("../../apis/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockFollowers = [
  {
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePicture: "https://example.com/john.jpg",
    headline: "Software Engineer",
  },
  {
    userId: 2,
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePicture: "https://example.com/jane.jpg",
    headline: "Product Manager",
  },
];

describe("FollowersModal", () => {
  const defaultProps = {
    show: true,
    onClose: vi.fn(),
    companyId: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders followers when fetched", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFollowers });

    render(<FollowersModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("displays 'No followers yet.' when no data is returned", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<FollowersModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("No followers yet.")).toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<FollowersModal show={true} onClose={vi.fn()} companyId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load followers. Please try again."),
      ).toBeInTheDocument();
    });
  });

  test("calls onClose when ✖ is clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: mockFollowers });

    render(<FollowersModal {...defaultProps} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("✖"));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test("loads more followers when 'Load More' is clicked", async () => {
    const firstBatch = [
      {
        userId: "1",
        profilePicture: "https://example.com/john.jpg",
        firstName: "John",
        lastName: "Doe",
        headline: "Software Engineer",
        username: "johndoe",
      },
      {
        userId: "2",
        profilePicture: "https://example.com/jane.jpg",
        firstName: "Jane",
        lastName: "Smith",
        headline: "Product Manager",
        username: "janesmith",
      },
      {
        userId: "3",
        profilePicture: "https://example.com/bob.jpg",
        firstName: "Bob",
        lastName: "Johnson",
        headline: "Designer",
        username: "bobjohnson",
      },
    ];

    const secondBatch = [
      {
        userId: "4",
        profilePicture: "https://example.com/emma.jpg",
        firstName: "Emma",
        lastName: "Stone",
        headline: "Marketing Lead",
        username: "emmastone",
      },
    ];

    axios.get
      .mockResolvedValueOnce({ data: firstBatch })
      .mockResolvedValueOnce({ data: secondBatch });

    render(<FollowersModal show={true} onClose={vi.fn()} companyId={1} />);

    // Wait for initial batch
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Load more
    const loadMoreBtn = screen.getByRole("button", { name: /load more/i });
    fireEvent.click(loadMoreBtn);

    // Wait for the second batch to render
    await waitFor(() => {
      expect(screen.getByText("Emma Stone")).toBeInTheDocument();
    });
  });

  test("does not render when show is false", () => {
    const { container } = render(
      <FollowersModal {...defaultProps} show={false} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

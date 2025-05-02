import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import PostCard from "../../../pages/AdminPanel/AdminAnalytics/PostCard";

// Sample post data
const mockPost = {
  authorName: "Alice Johnson",
  authorPicture: "/alice.jpg",
  authorBio: "Frontend Developer",
  timestamp: "2024-05-01T14:30:00Z",
  content: "This is a test post with media.",
  media: ["/img1.png", "/img2.png"],
};

describe("PostCard", () => {
  test("renders author name, bio, and content", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test post with media.")
    ).toBeInTheDocument();
  });

  test("renders formatted timestamp", () => {
    render(<PostCard post={mockPost} />);
    // Timestamp will depend on locale, just assert presence of any date string
    expect(screen.getByText(/2024|May/i)).toBeInTheDocument();
  });

  test("renders media images", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getAllByRole("img")).toHaveLength(3); // author + 2 media
    expect(screen.getByAltText("media-0")).toHaveAttribute("src", "/img1.png");
    expect(screen.getByAltText("media-1")).toHaveAttribute("src", "/img2.png");
  });

  test("renders report count when provided", () => {
    render(<PostCard post={mockPost} reportCount={5} />);
    expect(screen.getByText("Reports Received: 5")).toBeInTheDocument();
  });

  test("does not render report count if not provided", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.queryByText(/Reports Received:/i)).not.toBeInTheDocument();
  });

  test("renders nothing if post is null", () => {
    const { container } = render(<PostCard post={null} />);
    expect(container.firstChild).toBeNull();
  });
});

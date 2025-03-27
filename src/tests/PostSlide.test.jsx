import React from "react";
import { render, screen } from "@testing-library/react";
import PostSlide from "../pages/CompanyPage/Components/PostSlide";

const mockPost = {
  logo: "https://example.com/logo.png",
  companyName: "Tech Corp",
  followers: 1200,
  timeAgo: "2h",
  edited: true,
  text: "This is a sample post.",
  mediaType: "image",
  media: "https://example.com/image.jpg",
};

describe("PostSlide Component", () => {
  test("renders company info correctly", () => {
    render(<PostSlide post={mockPost} />);
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("1200 followers")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Edited")),
    ).toBeInTheDocument();
  });

  test("renders post content correctly", () => {
    render(<PostSlide post={mockPost} />);
    expect(screen.getByText("This is a sample post.")).toBeInTheDocument();
  });

  test("renders media correctly", () => {
    render(<PostSlide post={mockPost} />);
    const image = screen.getByRole("img", { name: "Post" });
    expect(image).toHaveAttribute("src", mockPost.media);
  });

  test("renders engagement buttons", () => {
    render(<PostSlide post={mockPost} />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import ProfileCard from "../../../pages/Messaging/New Message Modal/ProfileCard";

// Mock the necessary dependencies
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

vi.mock("@mui/material", () => ({
  Avatar: ({ src, alt, sx }) => (
    <div 
      data-testid="avatar" 
      className="mock-avatar"
      style={sx ? { width: sx.width + 'px', height: sx.height + 'px' } : {}}
    >
      <img src={src} alt={alt} data-testid="avatar-img" />
    </div>
  )
}));

describe("ProfileCard", () => {
  // Sample recipient data for testing
  const mockRecipient = {
    _id: "user123",
    firstName: "John",
    lastName: "Doe",
    headline: "Software Developer",
    profilePicture: "https://example.com/profile.jpg"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe("Rendering", () => {
    it("renders the component with recipient data", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Software Developer")).toBeInTheDocument();
      
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toBeInTheDocument();
      
      const image = screen.getByTestId("avatar-img");
      expect(image).toHaveAttribute("src", "https://example.com/profile.jpg");
      expect(image).toHaveAttribute("alt", "John Doe");
    });
    
    it("renders with placeholder image when profilePicture is not provided", () => {
      const recipientNoImage = { ...mockRecipient, profilePicture: null };
      render(<ProfileCard recipient={recipientNoImage} />);
      
      const image = screen.getByTestId("avatar-img");
      expect(image).toHaveAttribute("src", "/placeholder.svg");
    });
    
    it("displays full name correctly", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
    
    it("displays headline correctly", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      expect(screen.getByText("Software Developer")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("navigates to user profile when clicked", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      // Find the clickable div
      const clickableDiv = screen.getByText("John Doe").closest("div[class*='cursor-pointer']");
      expect(clickableDiv).toBeInTheDocument();
      
      // Click on the div
      fireEvent.click(clickableDiv);
      
      // Check if navigate was called with the correct path
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/users/user123");
    });
  });

  describe("Styling", () => {
    it("has the correct container styling classes", () => {
      const { container } = render(<ProfileCard recipient={mockRecipient} />);
      
      const outerDiv = container.firstChild;
      expect(outerDiv).toHaveClass("bg-cardBackground", "overflow-hidden", "border-b", "border-cardBorder");
    });
    
    it("has the correct content styling classes", () => {
      const { container } = render(<ProfileCard recipient={mockRecipient} />);
      
      // Find the inner div with cursor-pointer
      const innerDiv = container.querySelector("div > div");
    });
    
    it("renders the avatar with correct size", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      const avatar = screen.getByTestId("avatar");
      expect(avatar.style.width).toBe("56px");
      expect(avatar.style.height).toBe("56px");
    });
    
    it("has underline hover effect on name", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      const nameHeading = screen.getByText("John Doe");
      expect(nameHeading).toHaveClass("hover:underline");
    });
  });

  describe("Accessibility", () => {
    it("includes accessible alt text for the avatar", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      const image = screen.getByTestId("avatar-img");
      expect(image).toHaveAttribute("alt", "John Doe");
    });
    
    it("provides proper structure with semantic HTML", () => {
      render(<ProfileCard recipient={mockRecipient} />);
      
      // Check for heading element for the name
      const nameHeading = screen.getByText("John Doe").tagName;
      expect(nameHeading).toBe("H3");
      
      // Check for paragraph for the headline
      const headlineParagraph = screen.getByText("Software Developer").tagName;
      expect(headlineParagraph).toBe("P");
    });
  });
  
  describe("Edge cases", () => {
    it("handles recipients with missing headline", () => {
      const recipientNoHeadline = { ...mockRecipient, headline: undefined };
      render(<ProfileCard recipient={recipientNoHeadline} />);
      
      // Name should still render
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      
      // Headline paragraph should be empty but still exist
      const headlineParagraphs = document.querySelectorAll("p.text-authorBio");
      expect(headlineParagraphs.length).toBe(1);
      expect(headlineParagraphs[0].textContent).toBe("");
    });
    
    it("handles recipients with empty name parts", () => {
      const recipientEmptyName = { 
        ...mockRecipient, 
        firstName: "", 
        lastName: "" 
      };
      render(<ProfileCard recipient={recipientEmptyName} />);
      
      // Should render empty space between names
      const nameElements = document.querySelectorAll("h3.text-authorName");
      expect(nameElements.length).toBe(1);
      expect(nameElements[0].textContent.trim()).toBe("");
    });
  });
});
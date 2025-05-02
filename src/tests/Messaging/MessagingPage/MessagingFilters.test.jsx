import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import MessagingFilters from "../../../pages/Messaging/MessagingPage/MessagingFilters";

// Mock useRef implementation
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({
      current: {
        scrollLeft: 0
      }
    }))
  };
});

describe("MessagingFilters", () => {
  const mockSetActiveFilter = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe("Rendering", () => {
    it("renders all filter buttons", () => {
      render(<MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />);
      
      expect(screen.getByText("All")).toBeInTheDocument();
      expect(screen.getByText("Unread")).toBeInTheDocument();
    });
    
    it("applies active style to the current active filter", () => {
      render(<MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />);
      
      const allButton = screen.getByText("All");
      const unreadButton = screen.getByText("Unread");
      
      expect(allButton).toHaveClass("bg-green-500");
      expect(allButton).toHaveClass("text-cardBackground");
      expect(allButton).toHaveClass("font-semibold");
      
      expect(unreadButton).not.toHaveClass("bg-green-500");
      expect(unreadButton).toHaveClass("bg-cardBackground");
    });
    
    it("renders with different active filter", () => {
      render(<MessagingFilters activeFilter="Unread" setActiveFilter={mockSetActiveFilter} />);
      
      const allButton = screen.getByText("All");
      const unreadButton = screen.getByText("Unread");
      
      expect(unreadButton).toHaveClass("bg-green-500");
      expect(allButton).not.toHaveClass("bg-green-500");
    });
  });
  
  describe("Interactions", () => {
    it("calls setActiveFilter with the clicked filter", () => {
      render(<MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />);
      
      const unreadButton = screen.getByText("Unread");
      fireEvent.click(unreadButton);
      
      expect(mockSetActiveFilter).toHaveBeenCalledWith("Unread");
    });
    
    it("resets to default filters and sets 'All' when clicking the active filter", () => {
      render(<MessagingFilters activeFilter="Unread" setActiveFilter={mockSetActiveFilter} />);
      
      const unreadButton = screen.getByText("Unread");
      fireEvent.click(unreadButton);
      
      expect(mockSetActiveFilter).toHaveBeenCalledWith("All");
    });
    
    it("reorders filters to put clicked filter first", () => {
      const { rerender } = render(
        <MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />
      );
      
      // Click "Unread" to make it active and first
      fireEvent.click(screen.getByText("Unread"));
      
      // Simulate the rerender with new activeFilter
      rerender(<MessagingFilters activeFilter="Unread" setActiveFilter={mockSetActiveFilter} />);
      
      // Get all buttons to check order
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].textContent).toBe("Unread");
      expect(buttons[1].textContent).toBe("All");
    });
  });
  
  describe("Scroll Behavior", () => {
    it("resets scroll position when filters change", () => {
      // Create a modified useRef implementation for this specific test
      const scrollRefMock = { current: { scrollLeft: 100 } };
      const useRefSpy = vi.spyOn(React, 'useRef');
      useRefSpy.mockReturnValueOnce(scrollRefMock);
      
      const { rerender } = render(
        <MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />
      );
      
      // Click "Unread" to trigger filter change
      fireEvent.click(screen.getByText("Unread"));
      
      // Simulate the rerender with new activeFilter
      rerender(<MessagingFilters activeFilter="Unread" setActiveFilter={mockSetActiveFilter} />);
    });
  });
  
  describe("Styling", () => {
    it("has proper container styling", () => {
      const { container } = render(
        <MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />
      );
      
      const outerDiv = container.firstChild;
      expect(outerDiv).toHaveClass("bg-cardBackground", "border-b", "border-cardBorder", "py-3");
    });
    
    it("has responsive layout with max width", () => {
      const { container } = render(
        <MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />
      );
      
      const innerDiv = container.firstChild.firstChild;
      expect(innerDiv).toHaveClass("max-w-7xl", "mx-auto", "px-4", "sm:px-6");
    });
    
    it("has horizontal scrollable container for filters", () => {
      const { container } = render(
        <MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />
      );
      
      const scrollContainer = container.querySelector('[class*="overflow-x-auto"]');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass("flex", "items-center", "gap-2", "overflow-x-auto", "scrollbar-hide");
    });
    
    it("applies proper button styling", () => {
      render(<MessagingFilters activeFilter="All" setActiveFilter={mockSetActiveFilter} />);
      
      const button = screen.getByText("Unread");
      expect(button).toHaveClass(
        "px-4", 
        "py-2", 
        "rounded-full", 
        "border", 
        "border-itemBorder",
        "text-sm", 
        "whitespace-nowrap"
      );
    });
  });
});
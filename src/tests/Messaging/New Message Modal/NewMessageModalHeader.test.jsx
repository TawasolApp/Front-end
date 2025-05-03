import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import NewMessageModalHeader from "../../../pages/Messaging/New Message Modal/NewMessageModalHeader";

// Mock MUI icons
vi.mock("@mui/icons-material", () => ({
  Close: () => <div data-testid="close-icon">Close Icon</div>,
  CloseFullscreen: () => <div data-testid="minimize-icon">Minimize Icon</div>,
  OpenInFull: () => <div data-testid="maximize-icon">Maximize Icon</div>
}));

describe("NewMessageModalHeader", () => {
  // Mock functions for props
  const mockOnMinimize = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    // Clear mock function calls before each test
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the header with correct title", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const title = screen.getByText("New message");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("text-authorName", "font-medium", "text-lg");
    });

    it("renders with minimize icon when not minimized", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      expect(screen.getByTestId("minimize-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("maximize-icon")).not.toBeInTheDocument();
    });

    it("renders with maximize icon when minimized", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={true} 
        />
      );
      
      expect(screen.getByTestId("maximize-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("minimize-icon")).not.toBeInTheDocument();
    });

    it("always renders the close icon", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has 'Minimize' aria-label when not minimized", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const minimizeButton = screen.getByLabelText("Minimize");
      expect(minimizeButton).toBeInTheDocument();
    });

    it("has 'Maximize' aria-label when minimized", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={true} 
        />
      );
      
      const maximizeButton = screen.getByLabelText("Maximize");
      expect(maximizeButton).toBeInTheDocument();
    });

    it("has 'Close' aria-label on close button", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onMinimize when minimize button is clicked", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const minimizeButton = screen.getByLabelText("Minimize");
      fireEvent.click(minimizeButton);
      
      expect(mockOnMinimize).toHaveBeenCalledTimes(1);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("calls onMinimize when maximize button is clicked", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={true} 
        />
      );
      
      const maximizeButton = screen.getByLabelText("Maximize");
      fireEvent.click(maximizeButton);
      
      expect(mockOnMinimize).toHaveBeenCalledTimes(1);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("calls onClose when close button is clicked", () => {
      render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const closeButton = screen.getByLabelText("Close");
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnMinimize).not.toHaveBeenCalled();
    });
  });

  describe("UI Styling", () => {
    it("has a border at the bottom", () => {
      const { container } = render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const headerDiv = container.firstChild;
      expect(headerDiv).toHaveClass("border-b", "border-cardBorder");
    });

    it("has proper background color", () => {
      const { container } = render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const headerDiv = container.firstChild;
      expect(headerDiv).toHaveClass("bg-cardBackground");
    });

    it("has flex layout with space-between", () => {
      const { container } = render(
        <NewMessageModalHeader 
          onMinimize={mockOnMinimize} 
          onClose={mockOnClose} 
          isMinimized={false} 
        />
      );
      
      const headerDiv = container.firstChild;
      expect(headerDiv).toHaveClass("flex", "justify-between", "items-center");
    });
  });
});
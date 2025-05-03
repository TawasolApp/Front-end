import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Hoist mock declarations
const mockSocket = vi.hoisted(() => ({
  connected: true,
  emit: vi.fn((event, payload, callback) => {
    // Simulate successful acknowledgment by default
    if (callback) callback({ success: true });
  })
}));

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn()
}));

// Variables to track state and handlers
let minimizeHandler = vi.hoisted(() => null);
let isModalMinimized = vi.hoisted(() => false);
let sendMessageHandler = vi.hoisted(() => null);

// Mock recipient data
const mockRecipient = {
  _id: "user123",
  firstName: "John",
  lastName: "Doe",
  headline: "Software Developer",
  profilePicture: "https://example.com/profile.jpg"
};

// Set up mocks
vi.mock("../../../hooks/SocketContext", () => ({
  useSocket: () => mockSocket
}));

vi.mock("react-toastify", () => ({
  toast: mockToast
}));

// Mock child components
vi.mock("../../../pages/Messaging/New Message Modal/NewMessageModalHeader", () => ({
  default: ({ isMinimized, onMinimize, onClose }) => {
    // Store the handler for testing
    minimizeHandler = onMinimize;
    isModalMinimized = isMinimized;
    
    return (
      <div data-testid="mock-header">
        <span>Modal Header</span>
        <button data-testid="minimize-btn" onClick={onMinimize}>
          {isMinimized ? "Maximize" : "Minimize"}
        </button>
        <button data-testid="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }
}));

vi.mock("../../../pages/Messaging/New Message Modal/ProfileCard", () => ({
  default: ({ recipient }) => (
    <div data-testid="mock-profile-card">
      <span>Profile: {recipient.firstName} {recipient.lastName}</span>
    </div>
  )
}));

vi.mock("../../../pages/Messaging/New Message Modal/NewMessageModalInputs", () => ({
  default: ({ isMinimized, onSend }) => {
    // Store the handler for testing
    sendMessageHandler = onSend;
    
    return (
      <div data-testid="mock-inputs">
        <span>Message Inputs</span>
        <button 
          data-testid="send-btn" 
          onClick={() => onSend({ text: "Test message", media: [] })}
        >
          Send Test Message
        </button>
        <span data-testid="minimized-state">{isMinimized ? "Minimized" : "Maximized"}</span>
      </div>
    );
  }
}));

// Import the component after all mocks are set up
import NewMessageModal from "../../../pages/Messaging/New Message Modal/NewMessageModal";

describe("NewMessageModal", () => {
  const mockOnClose = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    isModalMinimized = false;
  });

  describe("Rendering", () => {
    it("renders the component with all child components", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      expect(screen.getByTestId("mock-header")).toBeInTheDocument();
      expect(screen.getByTestId("mock-profile-card")).toBeInTheDocument();
      expect(screen.getByTestId("mock-inputs")).toBeInTheDocument();
    });
    
    it("passes recipient data to ProfileCard", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      expect(screen.getByText("Profile: John Doe")).toBeInTheDocument();
    });
    
    it("passes initial isMinimized state (false) to child components", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      expect(screen.getByTestId("minimized-state")).toHaveTextContent("Maximized");
      expect(isModalMinimized).toBe(false);
    });
  });

  describe("Minimizing/Maximizing", () => {
    it("toggles isMinimized state when minimize button is clicked", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      // Initial state
      expect(isModalMinimized).toBe(false);
      expect(screen.getByTestId("minimized-state")).toHaveTextContent("Maximized");
      
      // Click minimize button
      fireEvent.click(screen.getByTestId("minimize-btn"));
      
      // State should be toggled
      expect(isModalMinimized).toBe(true);
      expect(screen.getByTestId("minimized-state")).toHaveTextContent("Minimized");
      
      // Click again to maximize
      fireEvent.click(screen.getByTestId("minimize-btn"));
      
      // State should be toggled back
      expect(isModalMinimized).toBe(false);
      expect(screen.getByTestId("minimized-state")).toHaveTextContent("Maximized");
    });
    
    it("applies different width classes based on isMinimized state", () => {
      const { container, rerender } = render(
        <NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />
      );
      
      // Initial state - maximized
      const modalContainer = container.firstChild;
      expect(modalContainer).toHaveClass("w-[30vw]");
      expect(modalContainer).not.toHaveClass("w-[20vw]");
      
      // Simulate minimizing
      fireEvent.click(screen.getByTestId("minimize-btn"));
      
      // Should now have minimized class
      expect(modalContainer).toHaveClass("w-[20vw]");
      expect(modalContainer).not.toHaveClass("w-[30vw]");
    });
  });

  describe("Message Sending", () => {
    it("emits send_message event with correct payload when message is sent", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      // Send a test message
      fireEvent.click(screen.getByTestId("send-btn"));
      
      // Check socket.emit was called with correct parameters
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "send_message",
        {
          receiverId: "user123",
          text: "Test message",
          media: []
        },
        expect.any(Function)
      );
    });
    
    it("shows success toast when message is successfully sent", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      // Send a test message
      fireEvent.click(screen.getByTestId("send-btn"));
      
      // Check success toast was shown
      expect(mockToast.success).toHaveBeenCalledWith(
        "Message sent successfully",
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000,
        })
      );
    });
    
    it("shows error toast when message sending fails", () => {
      // Override the emit function to simulate failure
      mockSocket.emit.mockImplementationOnce((event, payload, callback) => {
        if (callback) callback({ success: false });
      });
      
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      // Send a test message
      fireEvent.click(screen.getByTestId("send-btn"));
      
      // Check error toast was shown
      expect(mockToast.error).toHaveBeenCalledWith(
        "Failed to send message",
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000,
        })
      );
    });
    
    it("shows error toast when socket is not connected", () => {
      // Create a temporary mock with modified values
      const originalConnected = mockSocket.connected;
      mockSocket.connected = false;
      
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      // Send a test message
      fireEvent.click(screen.getByTestId("send-btn"));
      
      // Check error toast was shown
      expect(mockToast.error).toHaveBeenCalledWith(
        "Not connected to server",
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000,
        })
      );
      
      // Emit should not have been called
      expect(mockSocket.emit).not.toHaveBeenCalled();
      
      // Restore the original value
      mockSocket.connected = originalConnected;
    });
  });

  describe("Closing", () => {
    it("calls onClose prop when close button is clicked", () => {
      render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByTestId("close-btn"));
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("UI Structure", () => {
    it("has fixed positioning at bottom-right", () => {
      const { container } = render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      const modalWrapper = container.firstChild;
      expect(modalWrapper).toHaveClass("fixed", "bottom-4", "right-4");
    });
    
    it("has responsive width with minimum width", () => {
      const { container } = render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      const modalWrapper = container.firstChild;
      expect(modalWrapper).toHaveClass("min-w-[300px]");
    });
    
    it("has proper z-index to appear above content", () => {
      const { container } = render(<NewMessageModal recipient={mockRecipient} onClose={mockOnClose} />);
      
      const modalWrapper = container.firstChild;
      expect(modalWrapper).toHaveClass("z-50");
    });
  });
});
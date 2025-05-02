import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Simple mock data
const mockConversation = {
  id: "conv1",
  participant: {
    _id: "user2",
    firstName: "Jane",
    lastName: "Doe",
    headline: "Software Engineer",
    profilePicture: "https://example.com/jane.jpg"
  }
};

// Simple mock messages
const mockMessages = [
  {
    _id: "msg1",
    text: "Hello there!",
    senderId: "user2", 
    sentAt: new Date().toISOString(),
    status: "Read"
  },
  {
    _id: "msg2",
    text: "How are you?",
    senderId: "user1", 
    sentAt: new Date().toISOString(),
    status: "Read"
  }
];

// Hoisted mocks with minimal functionality
const mockSocket = vi.hoisted(() => ({
  connected: true,
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn((event, payload, callback) => {
    if (callback && event === "send_message") callback({ success: true });
  })
}));

const mockAxios = vi.hoisted(() => ({
  get: vi.fn(() => Promise.resolve({
    data: {
      data: mockMessages,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: mockMessages.length,
        itemsPerPage: 20
      }
    }
  })),
  put: vi.fn(() => Promise.resolve({ data: { success: true } }))
}));

const mockToast = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn()
}));

const mockNavigate = vi.hoisted(() => vi.fn());

// Mock hooks and dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

vi.mock("react-redux", () => ({
  useSelector: () => "user1" // Mock userId
}));

vi.mock("../../../hooks/SocketContext", () => ({
  useSocket: () => mockSocket
}));

vi.mock("../../../apis/axios", () => ({
  axiosInstance: mockAxios
}));

vi.mock("react-toastify", () => ({
  toast: mockToast
}));

// Mock NewMessageModalInputs component
vi.mock("../../../pages/Messaging/New Message Modal/NewMessageModalInputs", () => ({
  default: ({ onSend }) => (
    <div data-testid="message-input">
      <button 
        data-testid="send-button"
        onClick={() => onSend({ text: "New test message", media: [] })}
      >
        Send
      </button>
    </div>
  )
}));

// Mock ProfileCard component
vi.mock("../../../pages/Messaging/New Message Modal/ProfileCard", () => ({
  default: ({ recipient }) => (
    <div data-testid="profile-card">
      <span>Profile: {recipient.firstName} {recipient.lastName}</span>
    </div>
  )
}));

// Mock MUI components
vi.mock("@mui/material/IconButton", () => ({
  default: (props) => (
    <button 
      data-testid="block-button"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}));

vi.mock("@mui/material/Tooltip", () => ({
  default: ({ title, children }) => children
}));

// Mock MUI icons
vi.mock("@mui/icons-material/Block", () => ({
  default: () => <span data-testid="block-icon">Block</span>
}));

vi.mock("@mui/icons-material/AccessTime", () => ({
  default: () => <span data-testid="icon-pending">⌛</span>
}));

vi.mock("@mui/icons-material/Done", () => ({
  default: () => <span data-testid="icon-sent">✓</span>
}));

vi.mock("@mui/icons-material/DoneAll", () => ({
  default: ({ className }) => <span data-testid="icon-delivered" className={className}>✓✓</span>
}));

// Create mock implementations of the DOM Element properties
beforeEach(() => {
  // Mock implementation for scrollHeight
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: function() { return this._scrollHeight || 1000; },
    set: function(val) { this._scrollHeight = val; }
  });
  
  // Mock implementation for scrollTop
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get: function() { return this._scrollTop || 0; },
    set: function(val) { this._scrollTop = val; }
  });
  
  // Mock requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
});

// Import the component after all mocks
import ConversationView from "../../../pages/Messaging/MessagingPage/ConversationView";

describe("ConversationView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders conversation header with participant name", async () => {
      render(<ConversationView conversation={mockConversation} />);
      
      // Look for header with border-b class to be more specific
      await waitFor(() => {
        // Get the first div containing the border-b class (usually the header)
        const headerElement = document.querySelector('.border-b');
        expect(headerElement).toBeInTheDocument();
        expect(headerElement.textContent).toContain('Jane Doe');
      });
    });
  });
  
  describe("API Interactions", () => {
    it("fetches messages when conversation changes", async () => {
      render(<ConversationView conversation={mockConversation} />);
      
      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          `/messages/conversations/${mockConversation.id}`,
          expect.objectContaining({
            params: expect.anything()
          })
        );
      });
    });
    
    it("blocks user when block button is clicked", async () => {
      render(<ConversationView conversation={mockConversation} />);
      
      // Wait for block button to be available
      let blockButton;
      await waitFor(() => {
        blockButton = screen.getByTestId("block-button");
        expect(blockButton).toBeInTheDocument();
      });
      
      // Click block button
      fireEvent.click(blockButton);
      
      // Check if block API was called
      await waitFor(() => {
        expect(mockAxios.put).toHaveBeenCalledWith(
          "/messages/block",
          { participantId: mockConversation.participant._id }
        );
      });
    });
  });
  
  describe("Sending Messages", () => {
    it("sends message when send button is clicked", async () => {
      render(<ConversationView conversation={mockConversation} />);
      
      // Wait for message input to be available
      let sendButton;
      await waitFor(() => {
        sendButton = screen.getByTestId("send-button");
        expect(sendButton).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Click send button
      fireEvent.click(sendButton);
      
      // Check if socket emit was called
      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          "send_message",
          expect.objectContaining({
            receiverId: mockConversation.participant._id,
            text: "New test message"
          }),
          expect.any(Function)
        );
      });
    });
  });
  
  describe("Navigation", () => {
    it("navigates to user profile when name is clicked", async () => {
      render(<ConversationView conversation={mockConversation} />);
      
      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByTestId("block-button")).toBeInTheDocument();
      });
      
      // Find the clickable name element in header - using the cursor-pointer class
      const headerElement = document.querySelector('.border-b');
      const nameElement = headerElement.querySelector('.cursor-pointer');
      expect(nameElement).toBeInTheDocument();
      
      // Click name
      fireEvent.click(nameElement);
      
      // Check if navigate was called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(`/users/${mockConversation.participant._id}`);
      });
    });
  });
});
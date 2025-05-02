import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// Hoist mock declarations
const mockSocket = vi.hoisted(() => ({
  connected: true,
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn()
}));

const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn()
}));

const mockToast = vi.hoisted(() => ({
  error: vi.fn()
}));

const mockUserId = "user123";

// Mock conversations data
const mockConversations = [
  {
    _id: "conv1",
    otherParticipant: {
      _id: "other1",
      firstName: "John",
      lastName: "Doe",
      profilePicture: "https://example.com/john.jpg",
      isOnline: true
    },
    lastMessage: {
      text: "Hello there!",
      sentAt: new Date().toISOString(),
      senderId: "other1"
    },
    unseenCount: 2,
    markedAsUnread: false
  },
  {
    _id: "conv2",
    otherParticipant: {
      _id: "other2",
      firstName: "Jane",
      lastName: "Smith",
      profilePicture: null,
      isOnline: false
    },
    lastMessage: {
      text: "How are you doing?",
      sentAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      senderId: mockUserId
    },
    unseenCount: 0,
    markedAsUnread: false
  }
];

// Mock Redux 
vi.mock("react-redux", () => ({
  useSelector: vi.fn((selector) => {
    // Mock the authentication state
    return mockUserId;
  })
}));

// Mock axios
vi.mock("../../../apis/axios", () => ({
  axiosInstance: mockAxios
}));

// Mock socket context
vi.mock("../../../hooks/SocketContext", () => ({
  useSocket: () => mockSocket
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: mockToast
}));

// Mock MUI components
vi.mock("@mui/material/Avatar", () => ({
  default: ({ src, alt, sx }) => (
    <div data-testid="mui-avatar" className="mock-avatar" style={sx || {}}>
      {src ? <img src={src} alt={alt} /> : alt?.charAt(0)}
    </div>
  )
}));

vi.mock("@mui/material/Tooltip", () => ({
  default: ({ title, children }) => (
    <div data-testid="mui-tooltip" title={title}>
      {children}
    </div>
  )
}));

vi.mock("@mui/material/IconButton", () => ({
  default: (props) => (
    <button 
      data-testid="mui-icon-button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.children}
    </button>
  )
}));

// Mock Material Icons
vi.mock("@mui/icons-material/CheckCircleOutline", () => ({
  default: () => <div data-testid="mock-icon-check-circle">✓</div>
}));

vi.mock("@mui/icons-material/RadioButtonUnchecked", () => ({
  default: () => <div data-testid="mock-icon-radio-unchecked">○</div>
}));

vi.mock("@mui/icons-material/MarkEmailReadOutlined", () => ({
  default: () => <div data-testid="mock-icon-mark-read">📧</div>
}));

vi.mock("@mui/icons-material/MarkEmailUnreadOutlined", () => ({
  default: () => <div data-testid="mock-icon-mark-unread">📩</div>
}));

vi.mock("@mui/icons-material/DeleteOutlineOutlined", () => ({
  default: () => <div data-testid="mock-icon-delete">🗑️</div>
}));

// Import the component after all mocks
import ConversationList from "../../../pages/Messaging/MessagingPage/ConversationList";

describe("ConversationList", () => {
  const mockOnConversationSelect = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup successful API response
    mockAxios.get.mockResolvedValue({
      data: {
        data: mockConversations,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockConversations.length,
          itemsPerPage: 10
        }
      }
    });
  });

  describe("Rendering states", () => {
    it("shows loading state initially", () => {
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      expect(screen.getByText("Loading conversations...")).toBeInTheDocument();
    });
    
    it("shows empty state when no conversations are available", async () => {
      // Mock empty response
      mockAxios.get.mockResolvedValueOnce({
        data: {
          data: [],
          pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 10 }
        }
      });
      
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      // Wait for loading to finish
      const emptyStateTitle = await screen.findByText("No conversations yet");
      expect(emptyStateTitle).toBeInTheDocument();
      
      expect(screen.getByText(/Start a new conversation by searching for users/)).toBeInTheDocument();
    });
    
    it("renders conversation list when data is loaded", async () => {
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      // Wait for loading to finish and conversations to render
      const johnName = await screen.findByText("John Doe");
      expect(johnName).toBeInTheDocument();
      
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Hello there!")).toBeInTheDocument();
      expect(screen.getByText("You: How are you doing?")).toBeInTheDocument();
    });
  });
  
  describe("Conversation interactions", () => {
    it("selects conversation and calls onConversationSelect when clicked", async () => {
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      // Wait for loading to finish
      await screen.findByText("John Doe");
      
      // Click on John's conversation
      const johnConversation = screen.getByText("John Doe").closest("div[role='button']") || 
                              screen.getByText("John Doe").closest("div.cursor-pointer");
      fireEvent.click(johnConversation);
      
      // Check if onConversationSelect was called with correct data
      expect(mockOnConversationSelect).toHaveBeenCalledTimes(1);
      expect(mockOnConversationSelect).toHaveBeenCalledWith(expect.objectContaining({
        id: "conv1"
      }));
    });
    
    it("shows checkbox when hovering over conversation avatar", async () => {
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      // Wait for loading to finish
      await screen.findByText("John Doe");
      
      // Get avatar container
      const avatarContainers = document.querySelectorAll(".relative.flex-shrink-0.w-14.h-14");
      const johnAvatarContainer = avatarContainers[0];
      
      // Simulate hover
      fireEvent.mouseEnter(johnAvatarContainer);
      
      // Check if checkbox appeared
      const checkbox = screen.getByTestId("mock-icon-radio-unchecked");
      expect(checkbox).toBeInTheDocument();
      
      // Simulate mouse leave
      fireEvent.mouseLeave(johnAvatarContainer);
      
      // Checkbox should disappear
      expect(screen.queryByTestId("mock-icon-radio-unchecked")).not.toBeInTheDocument();
    });
  });
  
  describe("API interactions", () => {
    it("fetches conversations on mount", () => {
      render(<ConversationList activeFilter="All" onConversationSelect={mockOnConversationSelect} />);
      
      expect(mockAxios.get).toHaveBeenCalledWith("/messages/conversations", {
        params: { page: 1, limit: 10 }
      });
    });
  });
});
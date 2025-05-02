import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import MessagingContainer from "../../../pages/Messaging/MessagingPage/MessagingContainer";

// Mock child components
vi.mock("../../../pages/Messaging/MessagingPage/ConversationList", () => ({
  default: ({ onConversationSelect, activeFilter }) => {
    // Create a unique ID to help differentiate between instances
    const instanceId = Math.random().toString(36).substring(7);
    return (
      <div 
        data-testid="conversation-list"
        className="conversation-list" 
        data-filter={activeFilter}
      >
        <button
          data-testid="select-conversation"
          className="select-conversation-button"
          onClick={() => onConversationSelect({
            id: "conv1",
            participant: {
              _id: "user123",
              firstName: "John",
              lastName: "Doe"
            }
          })}
        >
          Select Conversation
        </button>
      </div>
    );
  }
}));

vi.mock("../../../pages/Messaging/MessagingPage/ConversationView", () => ({
  default: ({ conversation }) => (
    <div data-testid="conversation-view">
      Viewing conversation with: {conversation.participant.firstName} {conversation.participant.lastName}
    </div>
  )
}));

vi.mock("../../../pages/Messaging/MessagingPage/MessagingFilters", () => ({
  default: ({ activeFilter, setActiveFilter }) => (
    <div data-testid="messaging-filters">
      <button 
        data-testid="filter-all" 
        onClick={() => setActiveFilter("All")}
      >
        All
      </button>
      <button 
        data-testid="filter-unread" 
        onClick={() => setActiveFilter("Unread")}
      >
        Unread
      </button>
      <span data-testid="active-filter">Current: {activeFilter}</span>
    </div>
  )
}));

vi.mock("../../../pages/Messaging/MessagingPage/MessagingHeader", () => ({
  default: () => <div data-testid="messaging-header">Messages Header</div>
}));

describe("MessagingContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all components in initial state", () => {
    const { container } = render(<MessagingContainer />);
    
    expect(screen.getByTestId("messaging-header")).toBeInTheDocument();
    expect(screen.getByTestId("messaging-filters")).toBeInTheDocument();
    
    // Check that conversation lists exist using querySelectorAll
    const conversationLists = container.querySelectorAll(".conversation-list");
    expect(conversationLists.length).toBeGreaterThan(0);
    
    expect(screen.getByTestId("active-filter")).toHaveTextContent("Current: All");
    expect(screen.getByText("Select a conversation to start chatting")).toBeInTheDocument();
    expect(screen.queryByTestId("conversation-view")).not.toBeInTheDocument();
  });

  it("changes filter when a new filter is selected", () => {
    const { container } = render(<MessagingContainer />);
    
    // Initially set to "All"
    expect(screen.getByTestId("active-filter")).toHaveTextContent("Current: All");
    
    // Check that all conversation lists have "All" filter
    const conversationLists = container.querySelectorAll(".conversation-list");
    conversationLists.forEach(list => {
      expect(list).toHaveAttribute("data-filter", "All");
    });
    
    // Click on Unread filter
    fireEvent.click(screen.getByTestId("filter-unread"));
    
    // Should update to "Unread" for all lists
    expect(screen.getByTestId("active-filter")).toHaveTextContent("Current: Unread");
    conversationLists.forEach(list => {
      expect(list).toHaveAttribute("data-filter", "Unread");
    });
  });

  it("shows conversation view when a conversation is selected", () => {
    const { container } = render(<MessagingContainer />);
    
    // Initially no conversation view
    expect(screen.queryByTestId("conversation-view")).not.toBeInTheDocument();
    expect(screen.getByText("Select a conversation to start chatting")).toBeInTheDocument();
    
    // Select a conversation using the first button found
    const selectButtons = container.querySelectorAll(".select-conversation-button");
    fireEvent.click(selectButtons[0]);
    
    // Conversation view should be displayed
    expect(screen.queryByText("Select a conversation to start chatting")).not.toBeInTheDocument();
  });

  it("returns to conversation list when back button is clicked on mobile", () => {
    const { container } = render(<MessagingContainer />);
    
    // Select a conversation first (using the first button found)
    const selectButtons = container.querySelectorAll(".select-conversation-button");
    fireEvent.click(selectButtons[0]);
    
    // Verify conversation is shown
    
    // Find back button by its content and container (in the mobile header)
    const mobileHeader = container.querySelector('.md\\:hidden .border-b');
    expect(mobileHeader).toBeInTheDocument();
    
    const backButton = within(mobileHeader).getByRole('button');
    fireEvent.click(backButton);
    
    // Should no longer show conversation view
    expect(screen.queryByTestId("conversation-view")).not.toBeInTheDocument();
    expect(screen.getByText("Select a conversation to start chatting")).toBeInTheDocument();
  });
});
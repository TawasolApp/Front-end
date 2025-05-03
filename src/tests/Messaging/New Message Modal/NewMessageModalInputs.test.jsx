import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import NewMessageModalInputs from "../../../pages/Messaging/New Message Modal/NewMessageModalInputs";

// Mock MUI icons
vi.mock("@mui/icons-material", () => ({
  AttachFile: () => <div data-testid="attach-file-icon">Attach File</div>,
  InsertEmoticon: () => <div data-testid="emoji-icon">Emoji</div>,
  Image: () => <div data-testid="image-icon">Image</div>,
  Send: () => <div data-testid="send-icon"></div>, // Remove text content to avoid duplication
}));

// Mock EmojiPicker
vi.mock("emoji-picker-react", () => ({
  default: ({ onEmojiClick }) => (
    <div data-testid="emoji-picker">
      <button 
        data-testid="test-emoji-btn" 
        onClick={() => onEmojiClick({ emoji: "😀" })}
      >
        Add Emoji
      </button>
    </div>
  ),
}));

// Mock axios instance
vi.mock("../../../apis/axios", () => ({
  axiosInstance: {
    post: vi.fn().mockImplementation((url, formData, config) => {
      // Simulate successful upload with a mock URL
      if (url === "/media") {
        return Promise.resolve({
          data: { url: `https://example.com/media/${Math.random().toString(36).substring(7)}` },
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    }),
  },
}));

describe("NewMessageModalInputs", () => {
  const mockOnSend = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document event listeners after each test
    document.body.innerHTML = '';
    
    // Create click event that will be used in tests
    global.MouseEvent = class extends global.MouseEvent {
      constructor(type, options) {
        super(type, { bubbles: true, cancelable: true, ...options });
      }
    };
  });
  
  // Helper function to get the send button more reliably
  const getSendButton = () => {
    // Find button containing both the "Send" text and the send icon
    return screen.getByRole("button", {
      name: /send/i
    });
  };
  
  describe("Rendering", () => {
    it("renders the textarea with placeholder", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      expect(textarea).toBeInTheDocument();
    });
    
    it("renders action buttons", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      expect(screen.getByTestId("attach-file-icon")).toBeInTheDocument();
      expect(screen.getByTestId("image-icon")).toBeInTheDocument();
      expect(screen.getByTestId("emoji-icon")).toBeInTheDocument();
      expect(screen.getByTestId("send-icon")).toBeInTheDocument();
    });
    
    it("renders send button in disabled state initially", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const sendButton = getSendButton();
      expect(sendButton).toBeDisabled();
      expect(sendButton).toHaveClass("bg-buttonSubmitDisable");
    });
    
    it("applies correct size classes based on isMinimized prop", () => {
      const { rerender } = render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      let textarea = screen.getByPlaceholderText("Write a message...");
      expect(textarea).toHaveClass("min-h-[16rem]", "max-h-[24rem]");
      
      rerender(<NewMessageModalInputs isMinimized={true} onSend={mockOnSend} />);
      
      textarea = screen.getByPlaceholderText("Write a message...");
      expect(textarea).toHaveClass("min-h-[4.5rem]", "max-h-[4.5rem]");
    });
  });
  
  describe("Textarea Interaction", () => {
    it("updates message state when typing", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      
      expect(textarea.value).toBe("Hello world!");
    });
    
    it("enables send button when there is text", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      const sendButton = getSendButton();
      
      expect(sendButton).toBeDisabled();
      
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      
      expect(sendButton).not.toBeDisabled();
      expect(sendButton).toHaveClass("bg-buttonSubmitEnable");
    });
    
    it("shows animated border when textarea is focused", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      const animatedBorder = document.querySelector(".absolute.top-0.left-0.h-\\[2px\\]");
      
      expect(animatedBorder).toHaveClass("w-0");
      
      fireEvent.focus(textarea);
      
      expect(animatedBorder).toHaveClass("w-full");
      
      fireEvent.blur(textarea);
      
      expect(animatedBorder).toHaveClass("w-0");
    });
    
    it("keeps animated border visible when there is text", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      const animatedBorder = document.querySelector(".absolute.top-0.left-0.h-\\[2px\\]");
      
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      fireEvent.blur(textarea);
      
      expect(animatedBorder).toHaveClass("w-full");
    });
    
    it("sends message when pressing Enter without Shift", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
      
      expect(mockOnSend).toHaveBeenCalledWith({
        text: "Hello world!",
        media: [],
      });
      expect(textarea.value).toBe(""); // Text should be cleared after sending
    });
    
    it("doesn't send message when pressing Enter with Shift", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
      
      expect(mockOnSend).not.toHaveBeenCalled();
      expect(textarea.value).toBe("Hello world!"); // Text should remain
    });
  });
  
  describe("Emoji Picker", () => {
    it("shows emoji picker when clicking the button", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const emojiButton = screen.getByTitle("Insert emoji");
      fireEvent.click(emojiButton);
      
      expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
    });
    
    it("hides emoji picker when clicking the button again", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const emojiButton = screen.getByTitle("Insert emoji");
      fireEvent.click(emojiButton);
      fireEvent.click(emojiButton);
      
      expect(screen.queryByTestId("emoji-picker")).not.toBeInTheDocument();
    });
    
    it("adds emoji to message when clicked", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      const emojiButton = screen.getByTitle("Insert emoji");
      
      fireEvent.change(textarea, { target: { value: "Hello " } });
      fireEvent.click(emojiButton);
      
      const addEmojiBtn = screen.getByTestId("test-emoji-btn");
      fireEvent.click(addEmojiBtn);
      
      expect(textarea.value).toBe("Hello 😀");
    });
    
    it("closes emoji picker when clicking outside", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const emojiButton = screen.getByTitle("Insert emoji");
      fireEvent.click(emojiButton);
      
      // Verify emoji picker is shown
      expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
      
      // Click outside
      await act(async () => {
        document.dispatchEvent(new MouseEvent("mousedown"));
      });
      
      // Emoji picker should be hidden
      expect(screen.queryByTestId("emoji-picker")).not.toBeInTheDocument();
    });
  });
  
  describe("File Uploads", () => {
    it("uploads image files when selected", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const imageButton = screen.getByTitle("Add image");
      
      // Get the hidden input
      const imageInput = document.querySelector('input[accept="image/*"]');
      
      // Create a mock file
      const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
      
      // Trigger file selection
      await act(async () => {
        fireEvent.change(imageInput, { target: { files: [file] } });
      });
      
      // Check if the image preview is rendered
      await waitFor(() => {
        const imagePreview = screen.getByAltText("image-0");
        expect(imagePreview).toBeInTheDocument();
      });
      
      // Send button should be enabled
      const sendButton = getSendButton();
      expect(sendButton).not.toBeDisabled();
    });
    
    it("uploads regular files when selected", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const fileButton = screen.getByTitle("Attach file");
      
      // Get the hidden input
      const fileInput = document.querySelector('input[type="file"]:not([accept])');
      
      // Create a mock file
      const file = new File(['file content'], 'test-doc.pdf', { type: 'application/pdf' });
      
      // Trigger file selection
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });
      
      // Check if a file item is rendered (contains the URL)
      await waitFor(() => {
        const fileItems = document.querySelectorAll(".bg-mainBackground.rounded-lg");
        expect(fileItems.length).toBeGreaterThan(0);
      });
    });
    
    it("removes image when remove button is clicked", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      // Get the hidden input
      const imageInput = document.querySelector('input[accept="image/*"]');
      
      // Create a mock file
      const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
      
      // Trigger file selection
      await act(async () => {
        fireEvent.change(imageInput, { target: { files: [file] } });
      });
      
      // Wait for the image to be added
      await waitFor(() => {
        const imagePreview = screen.getByAltText("image-0");
        expect(imagePreview).toBeInTheDocument();
      });
      
      // Find and click the remove button
      const removeButton = screen.getByText("×").closest("button");
      fireEvent.click(removeButton);
      
      // Image should be removed
      expect(screen.queryByAltText("image-0")).not.toBeInTheDocument();
    });
  });
  
  describe("Send Functionality", () => {
    it("calls onSend with message data when send button is clicked", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText("Write a message...");
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      
      const sendButton = getSendButton();
      fireEvent.click(sendButton);
      
      expect(mockOnSend).toHaveBeenCalledWith({
        text: "Hello world!",
        media: [],
      });
    });
    
    it("resets state after sending", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      // Add text
      const textarea = screen.getByPlaceholderText("Write a message...");
      fireEvent.change(textarea, { target: { value: "Hello world!" } });
      
      // Add an image
      const imageInput = document.querySelector('input[accept="image/*"]');
      const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
      
      await act(async () => {
        fireEvent.change(imageInput, { target: { files: [file] } });
      });
      
      // Wait for the image to be added
      await waitFor(() => {
        const imagePreview = screen.getByAltText("image-0");
        expect(imagePreview).toBeInTheDocument();
      });
      
      // Send the message
      const sendButton = getSendButton();
      fireEvent.click(sendButton);
      
      // Verify text and image are cleared
      expect(textarea.value).toBe("");
      expect(screen.queryByAltText("image-0")).not.toBeInTheDocument();
    });
    
    it("doesn't call onSend when there's no message or media", () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      const sendButton = getSendButton();
      fireEvent.click(sendButton);
      
      expect(mockOnSend).not.toHaveBeenCalled();
    });
    
    it("sends message with media URLs", async () => {
      render(<NewMessageModalInputs isMinimized={false} onSend={mockOnSend} />);
      
      // Add an image
      const imageInput = document.querySelector('input[accept="image/*"]');
      const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
      
      await act(async () => {
        fireEvent.change(imageInput, { target: { files: [file] } });
      });
      
      // Wait for the image to be added
      await waitFor(() => {
        const imagePreview = screen.getByAltText("image-0");
        expect(imagePreview).toBeInTheDocument();
      });
      
      // Send the message
      const sendButton = getSendButton();
      fireEvent.click(sendButton);
      
      // Verify the message data includes the media URL
      expect(mockOnSend).toHaveBeenCalledWith({
        text: "",
        media: expect.arrayContaining([expect.stringContaining("https://example.com/media/")]),
      });
    });
  });
});
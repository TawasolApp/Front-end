import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddForm from "../../../../../../pages/Feed/MainFeed/FeedPosts/Post/Comments/AddForm";
import React from "react";

// Mock dependencies
vi.mock("@mui/material", () => ({
  Avatar: ({ src, sx, className }) => (
    <div
      data-testid="avatar-mock"
      className={className}
      style={{ width: sx?.width, height: sx?.height }}
    >
      <img src={src} alt="user avatar" />
    </div>
  ),
}));

vi.mock("@mui/material/CircularProgress", () => ({
  default: ({ size, className }) => (
    <div
      data-testid="loading-spinner"
      className={className}
      style={{ width: size, height: size }}
    >
      Loading...
    </div>
  ),
}));

// Updated TextEditor mock - directly access the textarea
vi.mock("../../../../../../pages/Feed/GenericComponents/TextEditor", () => ({
  __esModule: true,
  default: ({
    placeholder,
    className,
    text,
    setText,
    externalTextareaRef,
    taggedUsers,
    setTaggedUsers,
  }) => {
    React.useEffect(() => {
      // Set ref if provided
      if (externalTextareaRef && externalTextareaRef.current) {
        externalTextareaRef.current.value = text;
      }
    }, [externalTextareaRef, text]);

    return (
      <div className="relative">
        <textarea
          data-testid="text-editor-mock"
          placeholder={placeholder}
          className={className}
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={externalTextareaRef}
          required
          rows={1}
        />
      </div>
    );
  },
}));

// Mock the PostContext
const mockCurrentAuthorPicture = "https://example.com/avatar.jpg";

vi.mock("../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext", () => {
  // Create an actual context object to use in tests
  const { createContext } = require("react");
  const actualContext = createContext(null);

  return {
    PostContext: actualContext,
    usePost: () => ({
      currentAuthorPicture: mockCurrentAuthorPicture,
    }),
    PostProvider: ({ children }) => {
      return (
        <actualContext.Provider
          value={{
            currentAuthorPicture: mockCurrentAuthorPicture,
          }}
        >
          {children}
        </actualContext.Provider>
      );
    },
  };
});

// Import PostProvider after mocking
import { PostProvider } from "../../../../../../pages/Feed/MainFeed/FeedPosts/PostContext";

// Custom render function that wraps components with PostProvider
const customRender = (ui, options) => {
  return render(<PostProvider>{ui}</PostProvider>, options);
};

describe("AddForm Component", () => {
  // Common props for tests
  const defaultProps = {
    handleAddFunction: vi.fn().mockResolvedValue(undefined),
    initialText: "",
    initialTaggedUsers: [],
    type: "Comment",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default comment props correctly", () => {
    customRender(<AddForm {...defaultProps} />);

    // Check that avatar is rendered
    expect(screen.getByTestId("avatar-mock")).toBeInTheDocument();

    // Check that text editor is rendered with correct placeholder
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    expect(textEditor).toBeInTheDocument();

    // Submit button should be hidden when there's no text
    expect(screen.queryByText("Comment")).not.toBeInTheDocument();
  });

  it("renders with reply type correctly", () => {
    customRender(<AddForm {...defaultProps} type="Reply" />);

    // Check that placeholder is updated for reply
    const textEditor = screen.getByPlaceholderText("Add a Reply...");
    expect(textEditor).toBeInTheDocument();

    // Reply type should show the button even without text
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("renders with edit comment type correctly", () => {
    const closeHandler = vi.fn();
    customRender(
      <AddForm {...defaultProps} type="Edit Comment" close={closeHandler} />,
    );

    // Check that placeholder is updated for edit
    const textEditor = screen.getByPlaceholderText("Edit Comment...");
    expect(textEditor).toBeInTheDocument();

    // Should have cancel button for edit types
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    // Cancel button should call close function when clicked
    fireEvent.click(cancelButton);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  it("shows submit button when text is entered", async () => {
    customRender(<AddForm {...defaultProps} />);

    // Initially button should not be visible
    expect(screen.queryByText("Comment")).not.toBeInTheDocument();

    // Type some text
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    fireEvent.change(textEditor, { target: { value: "New comment text" } });

    // Button should now be visible
    expect(screen.getByText("Comment")).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    const user = userEvent.setup();
    const handleAddFunction = vi.fn().mockResolvedValue(undefined);

    customRender(
      <AddForm {...defaultProps} handleAddFunction={handleAddFunction} />,
    );

    // Type some text
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    await user.type(textEditor, "New comment text");

    // Submit the form
    const submitButton = screen.getByText("Comment");
    await user.click(submitButton);

    // Wait for async operations
    await waitFor(() => {
      // Check if handleAddFunction was called with correct parameters
      expect(handleAddFunction).toHaveBeenCalledWith("New comment text", []);

      // Text should be cleared after submission
      expect(textEditor.value).toBe("");
    });
  });

  it("shows loading state during submission", async () => {
    // Create a delayed mock function to simulate loading
    const delayedHandleAdd = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 100);
      });
    });

    customRender(
      <AddForm {...defaultProps} handleAddFunction={delayedHandleAdd} />,
    );

    // Type some text
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    fireEvent.change(textEditor, { target: { value: "New comment text" } });

    // Submit the form
    const submitButton = screen.getByText("Comment");
    fireEvent.click(submitButton);

    // Loading spinner should appear
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Wait for the submission to complete
    await waitFor(() => {
      expect(delayedHandleAdd).toHaveBeenCalledWith("New comment text", []);
    });
  });

  it("prevents submission when text is empty", async () => {
    const handleAddFunction = vi.fn();
    customRender(
      <AddForm {...defaultProps} handleAddFunction={handleAddFunction} />,
    );

    // Try to submit with empty text (form submit event)
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Function should not be called for empty text
    expect(handleAddFunction).not.toHaveBeenCalled();
  });

  it("handles submission errors gracefully", async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Create a mock that throws an error
    const errorHandleAdd = vi
      .fn()
      .mockRejectedValue(new Error("Submission failed"));

    customRender(
      <AddForm {...defaultProps} handleAddFunction={errorHandleAdd} />,
    );

    // Type some text
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    fireEvent.change(textEditor, { target: { value: "New comment text" } });

    // Submit the form
    const submitButton = screen.getByText("Comment");
    fireEvent.click(submitButton);

    // Wait for the error to be handled
    await waitFor(() => {
      // Error should be logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error adding comment:",
        expect.any(Error),
      );

      // Form should still be usable after error
      expect(screen.getByText("Comment")).toBeInTheDocument();
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("initializes with provided initial text and tagged users", () => {
    const initialText = "Initial comment text";
    const initialTaggedUsers = [{ id: "1", name: "John Doe" }];

    customRender(
      <AddForm
        {...defaultProps}
        initialText={initialText}
        initialTaggedUsers={initialTaggedUsers}
      />,
    );

    // Text editor should have initial text
    const textEditor = screen.getByPlaceholderText("Add a comment...");
    expect(textEditor).toHaveValue(initialText);

    // Button should be visible since there's initial text
    expect(screen.getByText("Comment")).toBeInTheDocument();
  });

  it("displays Edit Reply text with Edit Reply type", () => {
    customRender(
      <AddForm {...defaultProps} type="Edit Reply" initialText="Some text" />,
    );
    expect(screen.getByText("Edit Reply")).toBeInTheDocument();
  });

  it("displays Reply text with Reply type", () => {
    customRender(
      <AddForm {...defaultProps} type="Reply" initialText="Some text" />,
    );
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });
});

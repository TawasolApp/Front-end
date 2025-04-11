import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TextViewer from "../../../pages/Feed/GenericComponents/TextViewer";

// Utility function to wrap component in MemoryRouter for Link component
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("TextViewer Component", () => {
  describe("processText function", () => {
    it("handles plain text without mentions or URLs", () => {
      renderWithRouter(<TextViewer text="This is a simple text" />);
      expect(screen.getByText("This is a simple text")).toBeInTheDocument();
    });

    it("processes mentions correctly", () => {
      const text = "Hello @**John Doe** how are you?";
      const taggedUsers = ["user123"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Check text before mention
      expect(screen.getByText("Hello")).toBeInTheDocument();

      // Check mention with userId as a link
      const mentionLink = screen.getByText("John Doe");
      expect(mentionLink).toBeInTheDocument();
      expect(mentionLink.closest("a")).toHaveAttribute(
        "href",
        "/users/user123",
      );

      // Check text after mention
      expect(screen.getByText("how are you?")).toBeInTheDocument();
    });

    it("handles mentions without userId correctly", () => {
      const text = "Hello @**John Doe** how are you?";
      // No taggedUsers provided

      renderWithRouter(<TextViewer text={text} />);

      // Check mention without userId (should not be a link)
      const mention = screen.getByText("John Doe");
      expect(mention).toBeInTheDocument();
      expect(mention.tagName).toBe("SPAN");
      expect(mention).toHaveClass("font-bold");
      expect(mention).toHaveClass("text-blue-600");
    });

    it("processes URLs correctly", () => {
      const text = "Check out this website: https://example.com";

      renderWithRouter(<TextViewer text={text} />);

      // Check text before URL
      expect(screen.getByText("Check out this website:")).toBeInTheDocument();

      // Check URL is rendered as a link
      const urlLink = screen.getByText("External Link");
      expect(urlLink).toBeInTheDocument();
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );
      expect(urlLink.closest("a")).toHaveAttribute("target", "_blank");
      expect(urlLink.closest("a")).toHaveAttribute(
        "rel",
        "noopener noreferrer",
      );
    });

    it("handles multiple mentions correctly", () => {
      const text = "@**John Doe** and @**Jane Smith** are friends";
      const taggedUsers = ["user123", "user456"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Check first mention
      const firstMention = screen.getByText("John Doe");
      expect(firstMention).toBeInTheDocument();
      expect(firstMention.closest("a")).toHaveAttribute(
        "href",
        "/users/user123",
      );

      // Check second mention
      const secondMention = screen.getByText("Jane Smith");
      expect(secondMention).toBeInTheDocument();
      expect(secondMention.closest("a")).toHaveAttribute(
        "href",
        "/users/user456",
      );

      // Check text between and after mentions
      expect(screen.getByText("and")).toBeInTheDocument();
      expect(screen.getByText("are friends")).toBeInTheDocument();
    });

    it("handles multiple URLs correctly", () => {
      const text = "Check https://example.com and https://test.com sites";

      renderWithRouter(<TextViewer text={text} />);

      // Check both URLs are rendered as links
      const urlLinks = screen.getAllByText("External Link");
      expect(urlLinks).toHaveLength(2);
      expect(urlLinks[0].closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );
      expect(urlLinks[1].closest("a")).toHaveAttribute(
        "href",
        "https://test.com",
      );
    });

    it("processes mixed mentions and URLs correctly", () => {
      const text =
        "@**John Doe** shared https://example.com with @**Jane Smith**";
      const taggedUsers = ["user123", "user456"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Check mentions
      const firstMention = screen.getByText("John Doe");
      expect(firstMention.closest("a")).toHaveAttribute(
        "href",
        "/users/user123",
      );

      const secondMention = screen.getByText("Jane Smith");
      expect(secondMention.closest("a")).toHaveAttribute(
        "href",
        "/users/user456",
      );

      // Check URL
      const urlLink = screen.getByText("External Link");
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );

      // Check connecting text
      expect(screen.getByText("shared")).toBeInTheDocument();
      expect(screen.getByText("with")).toBeInTheDocument();
    });

    it("handles mention immediately followed by URL correctly", () => {
      const text = "@**John Doe**https://example.com";
      const taggedUsers = ["user123"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Check mention
      const mention = screen.getByText("John Doe");
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");

      // Check URL
      const urlLink = screen.getByText("External Link");
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );
    });

    it("handles URL immediately followed by mention correctly", () => {
      const text = "https://example.com@**John Doe**";
      const taggedUsers = ["user123"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Check URL
      const urlLink = screen.getByText("External Link");
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );

      // Check mention
      const mention = screen.getByText("John Doe");
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");
    });

    it("processes http and https URLs correctly", () => {
      const text = "Check http://example.com and https://secure.com";

      renderWithRouter(<TextViewer text={text} />);

      const urlLinks = screen.getAllByText("External Link");
      expect(urlLinks).toHaveLength(2);
      expect(urlLinks[0].closest("a")).toHaveAttribute(
        "href",
        "http://example.com",
      );
      expect(urlLinks[1].closest("a")).toHaveAttribute(
        "href",
        "https://secure.com",
      );
    });

    it("handles mentions with special characters in names correctly", () => {
      const text = "Hello @**John-Doe O'Connor** welcome!";
      const taggedUsers = ["user123"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      const mention = screen.getByText("John-Doe O'Connor");
      expect(mention).toBeInTheDocument();
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");
    });
  });

  describe("truncation logic", () => {
    it("truncates text when it exceeds maxChars", () => {
      const longText =
        "This is a very long text that should be truncated because it exceeds the maximum character limit set for the component.";

      renderWithRouter(<TextViewer text={longText} maxChars={50} />);

      // Check if "...more" button is rendered
      const moreButton = screen.getByText("...more");
      expect(moreButton).toBeInTheDocument();

      // Check if text is truncated
      expect(screen.getByText(/^This is a very long text/)).toBeInTheDocument();
      expect(
        screen.queryByText(/exceeds the maximum character limit/),
      ).not.toBeInTheDocument();

      // Expand text
      fireEvent.click(moreButton);

      // Full text should now be visible
      expect(
        screen.getByText(/exceeds the maximum character limit/),
      ).toBeInTheDocument();

      // Less button should be visible
      const lessButton = screen.getByText("...less");
      expect(lessButton).toBeInTheDocument();

      // Collapse text again
      fireEvent.click(lessButton);

      // Text should be truncated again
      expect(
        screen.queryByText(/exceeds the maximum character limit/),
      ).not.toBeInTheDocument();
      expect(screen.getByText("...more")).toBeInTheDocument();
    });

    it("truncates mentions correctly when they would exceed maxChars", () => {
      const text =
        "Start @**John Doe** is mentioned near the truncation point.";
      const taggedUsers = ["user123"];

      renderWithRouter(
        <TextViewer text={text} taggedUsers={taggedUsers} maxChars={20} />,
      );

      // Check if mention is visible
      expect(screen.getByText("Start")).toBeInTheDocument();

      // Expand text
      fireEvent.click(screen.getByText("...more"));

      // Full text with mention should be visible
      const mention = screen.getByText("John Doe");
      expect(mention).toBeInTheDocument();
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");
      expect(
        screen.getByText("is mentioned near the truncation point."),
      ).toBeInTheDocument();
    });

    it("truncates URLs correctly when they would exceed maxChars", () => {
      const text =
        "Start https://example.com is a URL near the truncation point.";

      renderWithRouter(<TextViewer text={text} maxChars={20} />);

      // Check if text before URL is visible
      expect(screen.getByText("Start")).toBeInTheDocument();

      // Expand text
      fireEvent.click(screen.getByText("...more"));

      // Full text with URL should be visible
      const urlLink = screen.getByText("External Link");
      expect(urlLink).toBeInTheDocument();
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );
      expect(
        screen.getByText("is a URL near the truncation point."),
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("returns null when no text is provided", () => {
      const { container } = renderWithRouter(<TextViewer text={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("handles empty text correctly", () => {
      const { container } = renderWithRouter(<TextViewer text="" />);
      expect(container.textContent).toBe("");
    });

    it("handles text with only mentions correctly", () => {
      const text = "@**John Doe**";
      const taggedUsers = ["user123"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      const mention = screen.getByText("John Doe");
      expect(mention).toBeInTheDocument();
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");
    });

    it("handles text with only URLs correctly", () => {
      const text = "https://example.com";

      renderWithRouter(<TextViewer text={text} />);

      const urlLink = screen.getByText("External Link");
      expect(urlLink).toBeInTheDocument();
      expect(urlLink.closest("a")).toHaveAttribute(
        "href",
        "https://example.com",
      );
    });

    it("handles text with incomplete mention syntax", () => {
      const text = "This is an @**incomplete mention syntax";

      renderWithRouter(<TextViewer text={text} />);

      // Should render as plain text
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it("handles more tagged users than mentions correctly", () => {
      const text = "@**John Doe** is here";
      const taggedUsers = ["user123", "user456", "user789"];

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // Should only use the first tagged user
      const mention = screen.getByText("John Doe");
      expect(mention.closest("a")).toHaveAttribute("href", "/users/user123");
    });

    it("handles fewer tagged users than mentions correctly", () => {
      const text = "@**John Doe** and @**Jane Smith** are here";
      const taggedUsers = ["user123"]; // Only one user ID

      renderWithRouter(<TextViewer text={text} taggedUsers={taggedUsers} />);

      // First mention should be linked
      const firstMention = screen.getByText("John Doe");
      expect(firstMention.closest("a")).toHaveAttribute(
        "href",
        "/users/user123",
      );

      // Second mention should be styled but not linked
      const secondMention = screen.getByText("Jane Smith");
      expect(secondMention.tagName).toBe("SPAN");
      expect(secondMention).toHaveClass("font-bold");
    });
  });
});

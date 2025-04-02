import React, { useState } from "react";
import { Link } from "react-router-dom";

const TextViewer = ({
  text,
  maxLines = 3,
  maxChars = 200,
  taggedUsers = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Process text to handle mentions and URLs
  const processText = () => {
    // Regular expressions for mentions and URLs
    const mentionRegex = /@\*\*([^*]+)\*\*/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace mentions with React elements
    let processedContent = [];
    let lastIndex = 0;
    let match;
    let mentionIndex = 0;

    // First process mentions
    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        processedContent.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      // Add the mention with corresponding userId if available
      const userId =
        mentionIndex < taggedUsers.length ? taggedUsers[mentionIndex] : null;
      processedContent.push({
        type: "mention",
        content: match[1], // Extract the name between **
        userId: userId,
      });

      mentionIndex++;
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      processedContent.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    // Then process URLs within each text segment
    const finalContent = [];
    processedContent.forEach((segment, idx) => {
      if (segment.type === "mention") {
        finalContent.push(segment);
        return;
      }

      const textContent = segment.content;
      let textLastIndex = 0;
      let urlMatch;

      while ((urlMatch = urlRegex.exec(textContent)) !== null) {
        // Add text before the URL
        if (urlMatch.index > textLastIndex) {
          finalContent.push({
            type: "text",
            content: textContent.substring(textLastIndex, urlMatch.index),
          });
        }

        // Add the URL
        finalContent.push({
          type: "url",
          content: urlMatch[0],
        });

        textLastIndex = urlMatch.index + urlMatch[0].length;
      }

      // Add remaining text after last URL
      if (textLastIndex < textContent.length) {
        finalContent.push({
          type: "text",
          content: textContent.substring(textLastIndex),
        });
      }
    });

    return finalContent;
  };

  const renderSegment = (segment, key) => {
    if (segment.type === "mention") {
      // If we have a userId, make it a link to the user's profile
      if (segment.userId) {
        return (
          <Link
            key={key}
            to={`/users/${segment.userId}`}
            className="font-bold text-blue-600 hover:underline"
          >
            {segment.content}
          </Link>
        );
      } else {
        // If no userId is available, just style it without the link
        return (
          <span key={key} className="font-bold text-blue-600">
            {segment.content}
          </span>
        );
      }
    } else if (segment.type === "url") {
      return (
        <a
          key={key}
          href={segment.content}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-blue-600 hover:underline"
        >
          External Link
        </a>
      );
    } else {
      return <span key={key}>{segment.content}</span>;
    }
  };

  // Handle truncation logic
  const processedContent = processText();

  // Convert processed content back to plain text for line splitting
  const plainText = processedContent
    .map((segment) => {
      if (segment.type === "url") return "External Link";
      return segment.content;
    })
    .join("");

  // Split content into individual lines
  const lines = plainText.split("\n");

  // Calculate total characters in first maxLines
  let totalChars = 0;
  for (let i = 0; i < Math.min(maxLines, lines.length); i++) {
    totalChars += lines[i].length;
  }

  const needsTruncation = lines.length > maxLines || totalChars > maxChars;

  // For rendering, we need to map our processed content to lines
  // This is more complex as we need to preserve formatting
  const renderContent = () => {
    if (!needsTruncation || isExpanded) {
      // Just render all content with formatting
      return (
        <div className="text-textContent whitespace-pre-wrap break-words text-sm font-normal">
          {processedContent.map((segment, idx) => renderSegment(segment, idx))}
        </div>
      );
    } else {
      // We need to truncate
      let charCount = 0;
      let lineCount = 0;
      let truncatedContent = [];
      let currentLine = [];
      let currentLineChars = 0;

      // Convert segments to characters/lines for truncation
      for (let i = 0; i < processedContent.length; i++) {
        const segment = processedContent[i];
        const segmentText =
          segment.type === "url" ? "External Link" : segment.content;
        const segmentLines = segmentText.split("\n");

        for (let j = 0; j < segmentLines.length; j++) {
          const line = segmentLines[j];

          // If we're at a new line and not the first segment line
          if (j > 0) {
            // Complete the current line
            if (currentLine.length > 0) {
              truncatedContent.push(currentLine);
              currentLine = [];
              currentLineChars = 0;
              lineCount++;

              // Check if we've reached max lines
              if (lineCount >= maxLines) {
                break;
              }
            }
          }

          // Process current line
          const remainingChars = maxChars - charCount;
          if (charCount + line.length <= maxChars && lineCount < maxLines) {
            // We can add the whole line segment
            if (segment.type === "text") {
              currentLine.push({
                ...segment,
                content: j === 0 ? line : j > 0 ? line : segment.content,
              });
            } else {
              currentLine.push(segment);
            }
            charCount += line.length;
            currentLineChars += line.length;
          } else if (remainingChars > 0 && lineCount < maxLines) {
            // We need to truncate this segment
            if (segment.type === "text") {
              currentLine.push({
                ...segment,
                content: line.substring(0, remainingChars),
              });
              charCount += remainingChars;
              currentLineChars += remainingChars;
            } else {
              // For non-text segments (mentions, URLs) we'll add them fully if we have space
              if (segment.type === "url" && remainingChars >= 12) {
                // "External Link" length
                currentLine.push(segment);
                charCount += 12;
                currentLineChars += 12;
              } else if (
                segment.type === "mention" &&
                remainingChars >= segment.content.length
              ) {
                currentLine.push(segment);
                charCount += segment.content.length;
                currentLineChars += segment.content.length;
              }
            }
            break;
          } else {
            // We've reached the limit
            break;
          }
        }

        // If we've reached max chars or lines, stop processing
        if (charCount >= maxChars || lineCount >= maxLines) {
          break;
        }
      }

      // Add the current line if it's not empty
      if (currentLine.length > 0) {
        truncatedContent.push(currentLine);
      }

      // Render truncated content
      return (
        <div className="text-textContent whitespace-pre-wrap break-words text-sm font-normal">
          {truncatedContent.map((line, lineIdx) => (
            <div key={lineIdx}>
              {line.map((segment, segIdx) =>
                renderSegment(segment, `${lineIdx}-${segIdx}`),
              )}
              {lineIdx === truncatedContent.length - 1 && (
                <button
                  className="text-textPlaceholder hover:underline text-sm ml-1"
                  onClick={() => setIsExpanded(true)}
                >
                  ...more
                </button>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      {renderContent()}

      {/* Show less button when expanded */}
      {isExpanded && needsTruncation && (
        <button
          className="text-gray-400 hover:underline text-sm"
          onClick={() => setIsExpanded(false)}
        >
          ...less
        </button>
      )}
    </div>
  );
};

export default TextViewer;

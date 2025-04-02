import { useState, useRef, useEffect, useImperativeHandle } from "react";
import DropdownUsers from "./DropdownUsers";

const TextEditor = ({
  placeholder,
  className,
  text,
  setText,
  taggedUsers,
  setTaggedUsers,
  externalTextareaRef = null,
  rows = undefined,
  style = undefined,
}) => {
  const [mentionStart, setMentionStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagPatterns, setTagPatterns] = useState([]);
  const textareaRef = useRef(null);

  // Allow the parent to access the same textarea reference if externalTextareaRef is provided
  useImperativeHandle(externalTextareaRef, () => textareaRef.current);

  // Track all mentions in the text when tags are added or text changes
  useEffect(() => {
    const mentionRegex = /@\*\*([^*]+)\*\*/g;
    const currentPatterns = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      currentPatterns.push(match[0]);
    }

    // Check if any patterns were removed
    if (tagPatterns.length > currentPatterns.length) {
      // Find which patterns were removed
      const removedPatterns = tagPatterns.filter(
        (pattern) => !currentPatterns.includes(pattern),
      );

      // For each removed pattern, remove the corresponding user
      removedPatterns.forEach(() => {
        setTaggedUsers((prev) => {
          // Find the index of the removed pattern
          const patternIndex = tagPatterns.findIndex(
            (pattern) => !currentPatterns.includes(pattern),
          );

          // If found, remove the user at that index
          if (patternIndex !== -1) {
            const newTaggedUsers = [...prev];
            newTaggedUsers.splice(patternIndex, 1);
            return newTaggedUsers;
          }
          return prev;
        });
      });
    }

    // Update the stored patterns
    setTagPatterns(currentPatterns);
  }, [text, taggedUsers]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Check for @ mentions
    const caretPos = e.target.selectionStart;
    const textBeforeCaret = value.slice(0, caretPos);
    const atIndex = textBeforeCaret.lastIndexOf("@");

    if (atIndex >= 0) {
      const currentWord = textBeforeCaret.slice(atIndex + 1);
      if (/^[a-zA-Z0-9_]*$/.test(currentWord)) {
        setMentionStart(atIndex);
        setSearchQuery(currentWord);
        return;
      }
    }

    setMentionStart(null);
    setSearchQuery("");
  };

  const handleUserSelect = (userId, firstName, lastName) => {
    const mentionIndex = text.lastIndexOf(
      "@",
      textareaRef.current.selectionStart - 1,
    );
    if (mentionIndex === -1) return;

    const tagPattern = `@**${firstName} ${lastName}**`;
    const newText =
      text.slice(0, mentionIndex) +
      tagPattern +
      " " +
      text.slice(textareaRef.current.selectionStart);
    setText(newText);
    setTaggedUsers((prev) => [...prev, userId]);

    // Update tag patterns array
    setTagPatterns((prev) => [...prev, tagPattern]);
    setMentionStart(null);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        className={className}
        value={text}
        onChange={handleTextChange}
        required
        rows={rows || undefined}
        style={style || {}}
      />

      {mentionStart !== null && (
        <div
          className="absolute"
          style={{
            top: textareaRef.current
              ? textareaRef.current.offsetTop +
                textareaRef.current.scrollTop +
                20
              : 0,
            left: textareaRef.current
              ? textareaRef.current.offsetLeft + mentionStart * 8
              : 0,
          }}
        >
          <DropdownUsers name={searchQuery} onSelect={handleUserSelect} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;

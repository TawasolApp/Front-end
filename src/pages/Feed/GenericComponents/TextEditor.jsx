import { useState, useRef, useEffect } from "react";
import DropdownUsers from "./DropdownUsers";

const TextEditor = ({
  placeholder,
  className,
  text,
  setText,
  taggedUsers,
  setTaggedUsers,
}) => {
  const [mentionStart, setMentionStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevTagPattern, setPrevTagPattern] = useState("");
  const textareaRef = useRef(null);

  // Track when a mention pattern is deleted
  useEffect(() => {
    const checkForDeletedMention = () => {
      // If we have a previous tag pattern but it's no longer in the text
      if (
        prevTagPattern &&
        !text.includes(prevTagPattern) &&
        taggedUsers.length > 0
      ) {
        // Remove the last tagged user
        setTaggedUsers((prev) => {
          const newTaggedUsers = [...prev];
          newTaggedUsers.pop();
          return newTaggedUsers;
        });
        // Clear the previous tag pattern
        setPrevTagPattern("");
      }
    };

    checkForDeletedMention();
  }, [text, prevTagPattern, taggedUsers]);

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

    // Create a bold tag pattern for the mention
    const tagPattern = `@${firstName} ${lastName}`;
    const newText =
      text.slice(0, mentionIndex) +
      tagPattern +
      " " +
      text.slice(textareaRef.current.selectionStart);
    setText(newText);

    setTaggedUsers((prev) => [...prev, userId]);
    setPrevTagPattern(tagPattern); // Store the tag pattern for deletion detection
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

import { useState, useRef, useEffect } from "react";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import Avatar from "@mui/material/Avatar";
import DropdownUsers from "./DropdownUsers";
import DropdownMenu from "../../GenericComponents/DropdownMenu";
import CloseIcon from "@mui/icons-material/Close";

const TextModal = ({
  currentAuthorName,
  currentAuthorPicture,
  setIsModalOpen,
  handleSubmitFunction,
  initialText = "",
}) => {
  const [text, setText] = useState(initialText);
  const [visibilityType, setVisibilityType] = useState("Public");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevTagPattern, setPrevTagPattern] = useState("");
  const textareaRef = useRef(null);

  const menuItems = [
    {
      text: "Public",
      onClick: () => setVisibilityType("Public"),
      icon: PublicIcon,
    },
    {
      text: "Connections",
      onClick: () => setVisibilityType("Connections"),
      icon: PeopleIcon,
    },
  ];

  // Track when a mention pattern is deleted
  useEffect(() => {
    const checkForDeletedMention = () => {
      // If we have a previous tag pattern but it's no longer in the text
      if (prevTagPattern && !text.includes(prevTagPattern) && taggedUsers.length > 0) {
        // Remove the last tagged user
        setTaggedUsers(prev => {
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
    const newText = text.slice(0, mentionIndex) + tagPattern + " " + text.slice(textareaRef.current.selectionStart);
    setText(newText);

    setTaggedUsers((prev) => [...prev, userId]);
    setPrevTagPattern(tagPattern); // Store the tag pattern for deletion detection
    setMentionStart(null);
    setSearchQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    handleSubmitFunction(text, visibilityType, taggedUsers);
    setIsModalOpen();
    setText("");
    setTaggedUsers([]);
    setPrevTagPattern("");
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-cardBackground rounded-lg w-full max-w-2xl relative">
        <button
          onClick={setIsModalOpen}
          className="absolute top-2 right-2 hover:bg-buttonIconHover p-2 rounded-full"
        >
          <CloseIcon className="w-5 h-5 text-icon" />
        </button>

        <div className="flex items-center justify-between px-4 pt-4">
          <DropdownMenu menuItems={menuItems} position="right-0" width="w-48">
            <div className="flex items-start gap-2 mb-4 p-2 rounded-lg hover:bg-buttonIconHover cursor-pointer">
              <Avatar
                sx={{ width: 48, height: 48 }}
                className="rounded-full"
                src={currentAuthorPicture}
              />
              <div>
                <h3 className="font-medium text-authorName">
                  {currentAuthorName}
                </h3>
                <button className="text-sm text-textPlaceholder font-medium py-1 flex items-center gap-1">
                  {visibilityType}{" "}
                  {visibilityType === "Public" ? (
                    <PublicIcon
                      sx={{ fontSize: 16 }}
                      className="text-textPlaceholder"
                    />
                  ) : (
                    <PeopleIcon
                      sx={{ fontSize: 16 }}
                      className="text-textPlaceholder"
                    />
                  )}
                </button>
              </div>
            </div>
          </DropdownMenu>
        </div>

        <form className="px-4 pb-4" onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={textareaRef}
              placeholder="What do you want to talk about?"
              className="w-full h-48 p-2 resize-none focus:outline-none text-lg text-textContent bg-cardBackground"
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

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                text.trim()
                  ? "bg-buttonSubmitEnable text-white hover:bg-buttonSubmitEnableHover"
                  : "bg-buttonSubmitDisable text-textDescriptor cursor-not-allowed"
              }`}
              disabled={!text.trim()}
            >
              <span className="text-sm font-semibold text-buttonSubmitText">
                Post
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextModal;
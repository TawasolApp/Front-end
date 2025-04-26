import { useState, useRef, useEffect } from "react";
import { AttachFile, InsertEmoticon, Image, Send } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";

const NewMessageModalInputs = ({ isMinimized }) => {
  const [message, setMessage] = useState("");
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // TODO: complete this logic
      console.log("Attached files:", files);
    }
  };

  const handleImageChange = (e) => {
    const images = Array.from(e.target.files);
    if (images.length > 0) {
      // TODO: complete this logic
      console.log("Attached images:", images);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    // TODO: complete this logic
    console.log("Sending:", { message });
  };

  return (
    <div>
      {/* Message Textarea */}
      <div className="relative p-3 bg-cardBackground">
        {/* Animated border */}
        <div
          className={`absolute top-0 left-0 h-[2px] bg-textContent transition-all duration-300 ${
            isTextareaFocused || message ? "w-full" : "w-0"
          }`}
        />
        <textarea
          className={`w-full bg-mainBackground text-textContent rounded-lg p-2 focus:outline-none transition-all duration-300 ${
            isMinimized
              ? "min-h-[4.5rem] max-h-[4.5rem]"
              : "min-h-[16rem] max-h-[24rem]"
          }`}
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center p-2 bg-cardBackground border-t border-cardBorder">
        <div className="flex gap-2">
          {/* File Attachment */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
            title="Attach file"
          >
            <AttachFile className="text-textActivity" fontSize="small" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </button>

          {/* Emoji Picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
              title="Insert emoji"
            >
              <InsertEmoticon className="text-textActivity" fontSize="small" />
            </button>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 left-0 z-10"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={350}
                />
              </div>
            )}
          </div>

          {/* Image Attachment */}
          <button
            onClick={() => imageInputRef.current.click()}
            className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors"
            title="Add image"
          >
            <Image className="text-textActivity" fontSize="small" />
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
              multiple
            />
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
            message.trim()
              ? "bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText shadow-sm hover:shadow-md"
              : "bg-buttonSubmitDisable text-buttonSubmitDisabledText cursor-not-allowed"
          }`}
        >
          <span className="text-sm">Send</span>
          <Send fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default NewMessageModalInputs;

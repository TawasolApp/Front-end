import { useState, useRef, useEffect } from "react";
import { AttachFile, InsertEmoticon, Image, Send } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { axiosInstance } from "../../../apis/axios";

const NewMessageModalInputs = ({ isMinimized, onSend }) => {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false); // Track upload state
  const [media, setMedia] = useState([]); // Store media URLs

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
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

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    e.target.value = ""; // Reset the input value after selecting the files

    setIsUploadingMedia(true); // Set uploading state to true
    const uploadPromises = selectedImages.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Upload successful:", response.data);
        return response.data.url; // Return the URL
      } catch (error) {
        console.error("Upload failed:", error);
        return null; // Return null if upload fails
      }
    });

    const newUrls = (await Promise.all(uploadPromises)).filter(Boolean); // Filter out failed uploads
    setMedia((prev) => [...prev, ...newUrls]); // Add the URLs to the media state
    setImages((prev) => [...prev, ...newUrls]); // Store images as URLs for preview
    setIsUploadingMedia(false); // Set uploading state to false
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    e.target.value = ""; // Reset the input value after selecting the files

    setIsUploadingMedia(true); // Set uploading state to true
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Upload successful:", response.data);
        return response.data.url; // Return the URL
      } catch (error) {
        console.error("Upload failed:", error);
        return null; // Return null if upload fails
      }
    });

    const newUrls = (await Promise.all(uploadPromises)).filter(Boolean); // Filter out failed uploads
    setMedia((prev) => [...prev, ...newUrls]); // Add the URLs to the media state
    setFiles((prev) => [...prev, ...newUrls]); // Store files as URLs for preview
    setIsUploadingMedia(false); // Set uploading state to false
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setMedia(prev => prev.filter((_, i) => i !== index)); // Remove URL from media state as well
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMedia(prev => prev.filter((_, i) => i !== index)); // Remove URL from media state as well
  };

  const handleSend = () => {
    if (!message.trim() && media.length === 0) return; // If no message or media, don't send

    const messageData = {
      text: message.trim(),
      media, // Send the URLs as media
    };

    onSend(messageData); // Send the message data with URLs

    // Reset
    setMessage("");
    setImages([]);
    setFiles([]);
    setMedia([]); // Reset media state
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      {/* Message Textarea */}
      <div className="relative p-3 bg-cardBackground">
        {/* Attached Images Preview */}
        {(images.length > 0 || files.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`image-${index}`}
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {files.map((f, index) => (
              <div
                key={index}
                className="relative flex items-center bg-mainBackground rounded-lg p-2 text-sm"
              >
                <span className="truncate max-w-[8rem]">{f}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Animated Border */}
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
          onKeyDown={handleKeyDown}
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
              <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-10">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={350}
                />
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() && images.length === 0 && files.length === 0}
          className={`px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
            message.trim() || images.length > 0 || files.length > 0
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

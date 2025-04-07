import { useState, useRef, useEffect } from "react";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import Avatar from "@mui/material/Avatar";
import DropdownMenu from "../../GenericComponents/DropdownMenu";
import TextEditor from "../../GenericComponents/TextEditor";
import CloseIcon from "@mui/icons-material/Close";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CancelIcon from "@mui/icons-material/Cancel";
import { axiosInstance } from "../../../../apis/axios";

const TextModal = ({
  currentAuthorName,
  currentAuthorPicture,
  setIsModalOpen,
  handleSubmitFunction,
  initialText = "",
  initialTaggedUsers = [],
  initialVisiblity = "Public",
  initialMedia = [],
  preventMedia = false,
}) => {
  const [text, setText] = useState(initialText);
  const [visibilityType, setVisibilityType] = useState(initialVisiblity);
  const [taggedUsers, setTaggedUsers] = useState(initialTaggedUsers);
  const [media, setMedia] = useState(initialMedia);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    // Prevent adding files if PDF exists
    if (media.some((url) => getMediaType(url) === "document")) return;

    const files = Array.from(e.target.files);
    e.target.value = ""; // Clear input

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post(
          "/media",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        console.log("Upload successful:", response.data);
        return response.data.url;
      } catch (error) {
        console.error("Upload failed:", error);
        return null;
      }
    });

    const newUrls = (await Promise.all(uploadPromises)).filter(Boolean);
    const hasPDF = newUrls.some((url) => url.includes("/documents/"));
    if (hasPDF) {
      // Keep only the first PDF and clear others
      const pdfUrl = newUrls.find((url) => url.includes("/documents/"));
      setMedia([pdfUrl]);
    } else {
      setMedia((prev) => [...prev, ...newUrls]);
    }
  };

  const getMediaType = (url) => {
    if (url.includes("/image/")) return "image";
    if (url.includes("/video/")) return "video";
    return "document";
  };

  const renderMediaPreview = (url) => {
    const type = getMediaType(url);

    switch (type) {
      case "image":
        return (
          <img src={url} className="w-full h-32 object-cover rounded-lg" />
        );
      case "video":
        return (
          <video src={url} className="w-full h-32 object-cover rounded-lg" />
        );
      default:
        return (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg">
            <PictureAsPdfIcon className="w-10 h-10 text-red-500" />
            <span className="text-xs mt-1 truncate">
              {url.split("/").pop()}
            </span>
          </div>
        );
    }
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const isSubmitEnabled = text.trim() !== "" || media.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    handleSubmitFunction(text, media, visibilityType, taggedUsers);
    setIsModalOpen();
    setText("");
    setMedia([]);
    setTaggedUsers([]);
  };

  // Helper to get media icon based on type
  const getMediaIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="text-white w-4 h-4" />;
      case "video":
        return <VideoLibraryIcon className="text-white w-4 h-4" />;
      case "doc":
        return <PictureAsPdfIcon className="text-white w-4 h-4" />;
      default:
        return <PermMediaIcon className="text-white w-4 h-4" />;
    }
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
          <TextEditor
            placeholder="What do you want to talk about?"
            className="w-full h-48 p-2 resize-none focus:outline-none text-lg text-textContent bg-cardBackground"
            text={text}
            setText={setText}
            taggedUsers={taggedUsers}
            setTaggedUsers={setTaggedUsers}
          />

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-lg p-2 overflow-x-auto">
              <div className="flex space-x-2">
                {media.map((item, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden min-w-[120px] w-32 h-32"
                  >
                    {renderMediaPreview(item)}

                    {/* Remove Media Button */}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                    >
                      <CancelIcon className="text-white w-5 h-5" />
                    </button>

                    {/* Media Type Icon */}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 rounded-md p-0.5">
                      {getMediaIcon(item.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            {/* Media Upload Button */}
            <button
              type="button"
              className="p-2 rounded-md hover:bg-buttonIconHover flex items-center gap-1 font-semibold text-textActivity hover:text-textActivityHover disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current.click()}
              disabled={
                preventMedia || media.some((url) => url.includes("/documents/"))
              }
            >
              <PermMediaIcon className="w-5 h-5" />
              <span className="text-sm">Add Media</span>
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              type="submit"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                isSubmitEnabled
                  ? "bg-buttonSubmitEnable text-white hover:bg-buttonSubmitEnableHover"
                  : "bg-buttonSubmitDisable text-textDescriptor cursor-not-allowed"
              }`}
              disabled={!isSubmitEnabled}
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

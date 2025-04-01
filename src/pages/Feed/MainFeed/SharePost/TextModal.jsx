import { useState, useRef, useEffect } from "react";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import Avatar from "@mui/material/Avatar";
import DropdownUsers from "../../GenericComponents/DropdownUsers";
import DropdownMenu from "../../GenericComponents/DropdownMenu";
import TextEditor from "../../GenericComponents/TextEditor";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    handleSubmitFunction(text, visibilityType, taggedUsers);
    setIsModalOpen();
    setText("");
    setTaggedUsers([]);
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

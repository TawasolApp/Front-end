import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import TextModal from "./TextModal";
import { useSelector } from "react-redux";

const SharePost = ({ handleSharePost }) => {
  
  const currentAuthorName = `${useSelector((state) => state.authentication.firstName)} ${useSelector((state) => state.authentication.lastName)}`;
  const currentAuthorPicture = useSelector((state) => state.authentication.profilePicture);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-cardBackground border border-cardBorder rounded-none sm:rounded-lg p-4 pb-2 mb-4">
        <div className="flex items-start gap-2 pb-3">
          <Avatar
            sx={{ width: 48, height: 48 }}
            className="rounded-full"
            src={currentAuthorPicture}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 pl-4 pr-2 py-2 my-1 bg-cardBackground hover:bg-cardBackgroundHover rounded-full border-2 border-itemBorder text-left"
          >
            <span className="font-semibold text-sm text-textPlaceholder">
              Start a post
            </span>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <TextModal
          currentAuthorName={currentAuthorName}
          currentAuthorPicture={currentAuthorPicture}
          setIsModalOpen={() => setIsModalOpen(false)}
          handleSubmitFunction={handleSharePost}
        />
      )}
    </>
  );
};

export default SharePost;

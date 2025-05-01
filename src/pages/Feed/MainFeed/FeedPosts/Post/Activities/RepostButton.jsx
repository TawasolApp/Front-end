import { useState } from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { usePost } from "../../PostContext";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import TextModal from "../../../SharePost/TextModal";

const RepostButton = () => {
  const { currentAuthorName, currentAuthorPicture, post, handleSharePost } =
    usePost();
  const [openShare, setOpenShare] = useState(false);

  let menuItems = [
    {
      text: "Repost with your thoughts",
      onClick: () => setOpenShare(true),
      icon: BorderColorIcon,
    },
    {
      text: "Repost",
      onClick: () =>
        handleSharePost("dummy data", [], post.visibility, [], post.id, true),
      icon: RepeatIcon,
    },
  ];

  return (
    <>
      <div className="flex p-2 item-center justify-center hover:bg-buttonIconHover hover:transition-all duration-200 group">
        <DropdownMenu menuItems={menuItems} position="left-0 top-0">
          <button className="flex items-center justify-center gap-1">
            <RepeatIcon
              sx={{ fontSize: 16 }}
              className="text-textActivity group-hover:text-textActivityHover"
            />
            <span data-testid="postRepost" className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover hidden sm:inline">
              Repost
            </span>
          </button>
        </DropdownMenu>
      </div>

      {openShare && (
        <TextModal
          currentAuthorName={currentAuthorName}
          currentAuthorPicture={currentAuthorPicture}
          setIsModalOpen={() => setOpenShare(false)}
          handleSubmitFunction={(text, media, visibility, taggedUsers) =>
            handleSharePost(
              text,
              media,
              visibility,
              taggedUsers,
              post.id,
              false,
            )
          }
          preventMedia={true}
        />
      )}
    </>
  );
};

export default RepostButton;

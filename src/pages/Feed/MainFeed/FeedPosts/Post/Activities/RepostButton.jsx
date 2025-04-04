import RepeatIcon from "@mui/icons-material/Repeat";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import { usePost } from "../../PostContext";
import { useState } from "react";
import TextModal from "../../../SharePost/TextModal";

const RepostButton = () => {

  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";

  const { post, handleSharePost } = usePost();
  const [openShare, setOpenShare] = useState(false);

  let menuItems = [
    {
      text: "Repost with your thoughts",
      onClick: () => setOpenShare(true),
      icon: BorderColorIcon,
    },
    {
      text: "Repost",
      onClick: () => handleSharePost("dummy data", [], "", [], post.id, true),
      icon: RepeatIcon,
    }
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
              <span className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover">
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
          handleSubmitFunction={(text, media, visibility, taggedUsers) => handleSharePost(text, media, visibility, taggedUsers, post.id, false)}
        />
      )}
    </>
  );
};

export default RepostButton;

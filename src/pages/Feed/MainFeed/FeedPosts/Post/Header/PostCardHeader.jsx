import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import ActorHeader from "../../../../GenericComponents/ActorHeader";
import DropdownMenu from "../../../../GenericComponents/DropdownMenu";
import { usePost } from "../../PostContext";

const PostCardHeader = ({
  menuItems,
  modal,
  handleClosePostModal,
  noRightItems = false,
}) => {
  const { post } = usePost();

  return (
    <div className="relative">
      <div className="pr-16 pl-3 pt-3 mb-2">
        {noRightItems ? (
          <ActorHeader
            authorId={post.repostedComponents.authorId}
            authorName={post.repostedComponents.authorName}
            authorPicture={post.repostedComponents.authorPicture}
            authorBio={post.repostedComponents.authorBio}
            authorType={post.repostedComponents.authorType}
            timestamp={post.repostedComponents.timestamp}
            visibility={post.repostedComponents.visibility}
          />
        ) : (
          <ActorHeader
            authorId={post.authorId}
            authorName={post.authorName}
            authorPicture={post.authorPicture}
            authorBio={post.authorBio}
            authorType={post.authorType}
            timestamp={post.timestamp}
            visibility={post.visibility}
            isEdited={post.isEdited}
          />
        )}
      </div>
      {!noRightItems && (
        <div className="absolute right-3 top-1">
          <div className="flex items-center gap-1">
            {modal ? (
              <CloseIcon
                onClick={handleClosePostModal}
                className="p-2 text-icon hover:bg-buttonIconHover rounded-full hover:cursor-pointer"
                sx={{
                  fontSize: 40,
                }}
              />
            ) : (
              <DropdownMenu menuItems={menuItems} position="right-0">
                <button data-testid="postEllipsis" className="hover:bg-buttonIconHover rounded-full p-1">
                  <MoreHorizIcon className="w-5 h-5 text-icon" />
                </button>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCardHeader;

import MediaDisplay from "./MediaContent/MediaDisplay";
import TextContent from "./TextContent/TextContent";

const PostContent = ({
  modal,
  handleOpenPostModal,
  reposted = false,
}) => {
  return (
    <>
      <TextContent reposted={reposted} />
      {!modal && <MediaDisplay handleOpenPostModal={handleOpenPostModal} reposted={reposted} />}
    </>
  );
};

export default PostContent;

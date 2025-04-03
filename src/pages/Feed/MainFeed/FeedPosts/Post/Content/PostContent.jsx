import MediaDisplay from "./MediaContent/MediaDisplay";
import TextContent from "./TextContent/TextContent";

const PostContent = ({ modal, handleOpenPostModal }) => {
  return (
    <>
      <TextContent />
      {!modal && <MediaDisplay handleOpenPostModal={handleOpenPostModal} />}
    </>
  );
};

export default PostContent;

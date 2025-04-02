import MediaDisplay from "./MediaContent/MediaDisplay";
import TextContent from "./TextContent/TextContent";

const PostContent = ({ content, taggedUsers, media, modal, handleOpenPostModal }) => {
  return (
    <>
      <TextContent content={content} taggedUsers={taggedUsers} />
      {!modal && (
        <MediaDisplay
          media={media}
          handleOpenPostModal={handleOpenPostModal}
        />
      )}
    </>
  );
};

export default PostContent;

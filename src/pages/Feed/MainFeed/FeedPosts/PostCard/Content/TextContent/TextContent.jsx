import TextViewer from "../../../../../GenericComponents/TextViewer";

const TextContent = ({
  content,
  taggedUsers
}) => {

  return (
    <div className="pb-2 mx-4">
      <TextViewer
        text={content}
        maxChars={300}
        maxLines={3}
        taggedUsers={taggedUsers}
      />
    </div>
  );
};

export default TextContent;

import TextViewer from "../../../../../GenericComponents/TextViewer";
import { usePost } from "../../../PostContext";

const TextContent = () => {
  const { post } = usePost();

  return (
    <div className="pb-2 mx-4">
      <TextViewer
        text={post.content}
        maxChars={300}
        maxLines={3}
        taggedUsers={post.taggedUsers}
      />
    </div>
  );
};

export default TextContent;

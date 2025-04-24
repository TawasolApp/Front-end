import { usePost } from "../../../PostContext";
import TextViewer from "../../../../../GenericComponents/TextViewer";

const TextContent = ({ reposted }) => {
  const { post } = usePost();

  return (
    <div className="pb-2 mx-4">
      {reposted ? (
        <TextViewer
          text={post.repostedComponents.content}
          maxChars={300}
          maxLines={3}
          taggedUsers={post.repostedComponents.taggedUsers}
        />
      ) : (
        <TextViewer
          text={post.content}
          maxChars={300}
          maxLines={3}
          taggedUsers={post.taggedUsers}
        />
      )}
    </div>
  );
};

export default TextContent;

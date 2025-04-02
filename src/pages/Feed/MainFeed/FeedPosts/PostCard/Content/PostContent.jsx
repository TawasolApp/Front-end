import TextContent from "./TextContent/TextContent";

const PostContent = ({
  content,
  taggedUsers,
  media }) => {
  return <TextContent content={content} taggedUsers={taggedUsers} />;
};

export default PostContent;

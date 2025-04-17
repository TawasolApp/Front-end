import NewspaperIcon from "@mui/icons-material/Newspaper";
import PostContainer from "./PostContainer";

const FeedPosts = ({
  posts,
  lastPostRef,
  handleSharePost,
  handleDeletePost,
  currentAuthorId,
  currentAuthorName,
  currentAuthorPicture,
  isAdmin,
  loading,
}) => {
  if (!loading && (!posts || posts.length === 0)) {
    return (
      <div className="w-full bg-cardBackground rounded-lg p-8 text-center flex flex-col items-center gap-4">
        <div className="text-navbarIconsNormal">
          <NewspaperIcon size={56} />
        </div>
        <h3 className="text-2xl font-semibold text-header">No posts yet</h3>
        <p className="text-gray-500 text-sm max-w-md">
          Your feed is quiet right now. Follow more people or check back later
          for fresh content!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {posts.map((post, index) => {
        // Create a unique key using post ID + author + timestamp or index as fallback
        const uniqueKey = post.id
          ? `${post.id}-${post.authorId || index}-${post.timestamp}`
          : `post-${index}`;
          
        if (index === posts.length - 1) {
          return (
            <div ref={lastPostRef} key={uniqueKey}>
              <PostContainer
                post={post}
                handleSharePost={handleSharePost}
                handleDeletePost={handleDeletePost}
                currentAuthorId={currentAuthorId}
                currentAuthorName={currentAuthorName}
                currentAuthorPicture={currentAuthorPicture}
                isAdmin={isAdmin}
              />
            </div>
          );
        }
        return (
          <PostContainer
            key={uniqueKey}
            post={post}
            handleSharePost={handleSharePost}
            handleDeletePost={handleDeletePost}
            currentAuthorId={currentAuthorId}
            currentAuthorName={currentAuthorName}
            currentAuthorPicture={currentAuthorPicture}
            isAdmin={isAdmin}
          />
        );
      })}
    </div>
  );
};

export default FeedPosts;

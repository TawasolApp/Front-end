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
}) => {
  return (
    <div className="w-full">
      {posts &&
        posts.length > 0 &&
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div ref={lastPostRef} key={index}>
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
              key={index}
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

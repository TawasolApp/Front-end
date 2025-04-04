import PostContainer from "./PostContainer";

const FeedPosts = ({ posts, lastPostRef, handleSharePost, handleDeletePost }) => {
  return (
    <div className="space-y-4 w-full">
      {posts &&
        posts.length > 0 &&
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div ref={lastPostRef} key={post.id || index}>
                <PostContainer
                  post={post}
                  handleSharePost={handleSharePost}
                  handleDeletePost={handleDeletePost}
                />
              </div>
            );
          }
          return (
            <PostContainer
              key={post.id || index}
              post={post}
              handleSharePost={handleSharePost}
              handleDeletePost={handleDeletePost}
            />
          );
        })}
    </div>
  );
};

export default FeedPosts;

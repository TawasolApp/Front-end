import PostCard from "./PostCard/PostCard";

const FeedPosts = ({ posts, lastPostRef, handleDeletePost, handleOpenPostModal, handleClosePostModal }) => {
  return (
    <div className="space-y-4 w-full">
      {posts &&
        posts.length > 0 &&
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div ref={lastPostRef} key={post.id || index}>
                <PostCard
                  post={post}
                  handleDeletePost={handleDeletePost}
                  handleOpenPostModal={handleOpenPostModal}
                />
              </div>
            );
          }
          return (
            <PostCard
              key={post.id || index}
              post={post}
              handleDeletePost={handleDeletePost}
              handleOpenPostModal={handleOpenPostModal}
              handleClosePostModal={handleClosePostModal}
            />
          );
        })}
    </div>
  );
};

export default FeedPosts;

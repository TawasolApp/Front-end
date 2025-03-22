import PostCard from './PostCard/PostCard';

const FeedPosts = ({
    posts,
    lastPostRef
}) => {

    return (
        <div className="space-y-4 w-full">
            {/* {posts && posts.length > 0 && posts.map((post, index) => (
                <PostCard key={post.id} post={post} />
            ))} */}
            {posts && posts.length > 0 && posts.map((post, index) => {
                 if (index === posts.length - 1) {
                    return (
                        <div ref={lastPostRef} key={post.id || index}>
                            <PostCard post={post} />
                        </div>
                    );
                }
                return <PostCard key={post.id || index} post={post} />;
            })}
        </div>
    );
};

export default FeedPosts;
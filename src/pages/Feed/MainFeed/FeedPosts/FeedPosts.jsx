import PostCard from './PostCard/PostCard';

const FeedPosts = ({ posts }) => {

    return (
        <div className="space-y-4 w-full">
            {posts && posts.length > 0 && posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default FeedPosts;
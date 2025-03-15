import FeedPostCard from './FeedPostCard';

const FeedPosts = () => {

    // Mock posts data
    const mockPost = [
        {
            id: 1,
            isRepost: false,
            repostAuthor: "", // only if isRepost is true
            author: {
                name: "John Doe",
                title: "Software Engineer at Tech Corp",
                avatar: "https://example.com/avatar.jpg"
            },
            content: "This is a sample post content...",
            media: null, // or media URL
            reactions: {
                like: 45,
                celebrate: 23,
                support: 100,
                love: 0,
                insightful: 0,
                funny: 0
              },
            comments: 45,
            reposts: 12,
            shares: 8,
            timestamp: "2023-07-20T12:00:00",
            showComments: false // manage this with state
        }
    ]

    const mockPosts = Array(10).fill(null).map((_, index) => ({
        ...mockPost[0],
        id: index + 1 // Ensure each post has a unique ID
    }));


    return (
        <div className="space-y-4 w-full">
            {mockPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default FeedPosts;
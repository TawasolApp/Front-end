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
            reactions: {
                like: 44,
                celebrate: 45,
                support: 2,
                love: 0,
                insightful: 0,
                funny: 0
              },
            media: [
                "https://media.licdn.com/dms/image/v2/D4D22AQH6CSh3GG5jkw/feedshare-shrink_800/B4DZU4IgaRHAAk-/0/1740403517920?e=1744848000&v=beta&t=UW7Kb9WEfPpx0Y4eJdt77JYn_3XWCLeRUgACRpSEaNA",
                "https://media.licdn.com/dms/image/v2/D4D22AQGHs1zv53L1sg/feedshare-shrink_800/B4DZU4IgbPG8Ag-/0/1740403528207?e=1744848000&v=beta&t=gIUravC11fdyr1BXT-lk8YbZBz3XoqML7RmWWJUQ8xs",
                "https://media.licdn.com/dms/image/v2/D4D22AQH3uBt2uncklg/feedshare-shrink_800/B4DZU4IgbRHAAg-/0/1740403522423?e=1744848000&v=beta&t=m2BDQOq_lTFtGWVmYHVlw8KP_16Ut_fDMRs1RTGa7mQ",
                "https://media.licdn.com/dms/image/v2/D4D22AQFTFRxCX1N-ew/feedshare-shrink_2048_1536/B4DZU4IgbZHIAo-/0/1740403525710?e=1744848000&v=beta&t=GIclj6fm_PKEOgk9JgrDtOMwBf1JDRd5MFAeqoW-uh8",
                "https://media.licdn.com/dms/image/v2/D4D22AQFTFRxCX1N-ew/feedshare-shrink_2048_1536/B4DZU4IgbZHIAo-/0/1740403525710?e=1744848000&v=beta&t=GIclj6fm_PKEOgk9JgrDtOMwBf1JDRd5MFAeqoW-uh8",
                "https://media.licdn.com/dms/image/v2/D4D22AQFTFRxCX1N-ew/feedshare-shrink_2048_1536/B4DZU4IgbZHIAo-/0/1740403525710?e=1744848000&v=beta&t=GIclj6fm_PKEOgk9JgrDtOMwBf1JDRd5MFAeqoW-uh8",
            ],
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
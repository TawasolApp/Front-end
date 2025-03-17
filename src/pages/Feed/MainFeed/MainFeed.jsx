import SharePost from './SharePost/SharePost';
import FeedPosts from './FeedPosts/FeedPosts';

const MainFeed = () => {

    return (
        <>
            <SharePost />
            <div className="rounded-lg border-gray-200">
                <FeedPosts />
            </div>
        </>
    );
};

export default MainFeed;
import SharePost from './SharePost';
import FeedPosts from './FeedPosts'

const FeedContainer = () => {
    return (
        <div className="flex justify-center min-h-screen bg-[#f4f2ee] gap-0 p-4">
            {/* Left Sidebar - Strict width */}
            <div className="hidden lg:block w-56 max-w-[220px] sticky top-4 h-fit mr-2">
                <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                    <h2 className="text-gray-500 font-medium mb-4">Left Sidebar</h2>
                </div>
            </div>

            {/* Main Feed Content - Adjusted width */}
            <main className="w-[540px] flex-grow-0 mx-2 space-y-4">
                <SharePost />
                <div className="rounded-lg border-gray-200">
                    <FeedPosts />
                </div>
            </main>

            {/* Right Sidebar - Strict width */}
            <aside className="hidden lg:block w-72 max-w-[280px] sticky top-4 h-fit ml-2">
                <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                    <h2 className="text-gray-500 font-medium mb-4">Right Sidebar</h2>
                </div>
            </aside>
        </div>
    );
};

export default FeedContainer;
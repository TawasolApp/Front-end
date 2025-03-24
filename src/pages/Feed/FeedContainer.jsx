import LeftSideBar from './LeftSideBar/LeftSideBar';
import MainFeed from './MainFeed/MainFeed';
import RightSideBar from './RightSideBar/RightSideBar';

const FeedContainer = () => {
    return (
        <div className="min-h-screen bg-[#f4f2ee]">
            {/* Container with max width and centered content */}
            <div className="max-w-7xl mx-auto">
                {/* Extra Large Screens (1280px+): Three column layout */}
                <div className="hidden xl:flex justify-center gap-6 px-6">
                    {/* Left Sidebar */}
                    <div className="w-56 flex-shrink-0">
                        <div className="sticky top-4 h-fit">
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <LeftSideBar />
                            </div>
                        </div>
                    </div>

                    {/* Main Feed - Fixed width to match LinkedIn */}
                    <main className="w-full max-w-xl flex-shrink-0">
                        <MainFeed />
                    </main>

                    {/* Right Sidebar */}
                    <aside className="w-80 flex-shrink-0">
                        <div className="sticky top-4 h-fit">
                            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                                <RightSideBar />
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Large Screens (1024px-1280px): Three column but compressed */}
                <div className="hidden lg:flex xl:hidden justify-center gap-4 px-4">
                    {/* Left Sidebar */}
                    <div className="w-52 flex-shrink-0">
                        <div className="sticky top-4 h-fit">
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <LeftSideBar />
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <main className="w-full max-w-md flex-shrink-0">
                        <MainFeed />
                    </main>

                    {/* Right Sidebar */}
                    <aside className="w-72 flex-shrink-0">
                        <div className="sticky top-4 h-fit">
                            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                                <RightSideBar />
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Medium Screens (768px-1024px): Two column layout (no right sidebar) */}
                <div className="hidden md:flex lg:hidden gap-4 px-4">
                    {/* Left Sidebar */}
                    <div className="w-48 flex-shrink-0">
                        <div className="sticky top-4 h-fit">
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <LeftSideBar />
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <main className="flex-1">
                        <MainFeed />
                    </main>
                </div>

                {/* Small Screens (640px-768px): Single column with spacing */}
                <div className="hidden sm:block md:hidden px-4 space-y-4">
                    <div className="bg-white rounded-lg shadow border border-gray-200">
                        <LeftSideBar />
                    </div>
                    
                    <main>
                        <MainFeed />
                    </main>
                </div>

                {/* Mobile (<640px): Single column full width */}
                <div className="sm:hidden">
                    <div className="bg-white">
                        <LeftSideBar />
                    </div>
                    
                    <main>
                        <MainFeed />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FeedContainer;
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import MainFeed from "./MainFeed/MainFeed";
import RightSideBar from "./RightSideBar/RightSideBar";

const FeedContainer = () => {
  return (
    <div className="min-h-screen bg-mainBackground">
      {/* Container with max width and centered content */}
      <div className="max-w-7xl mx-auto">
        {/* Single responsive layout that maintains component instances */}
        <div className="flex flex-wrap justify-center px-2 sm:px-4 md:px-4 lg:px-4 xl:px-6">
          {/* Left Sidebar - changes width/display based on breakpoints */}
          <div className="w-full sm:w-full md:w-48 lg:w-52 xl:w-56 flex-shrink-0">
            <div className="md:sticky md:top-4 md:h-fit">
              <div className="bg-cardBackground rounded-lg border border-cardBorder">
                <LeftSideBar />
              </div>
            </div>
          </div>

          {/* Main Feed - changes width based on breakpoints */}
          <main className="w-full min-w-[430px] mt-4 md:mt-0 md:ml-4 md:flex-1 lg:w-full lg:max-w-md xl:max-w-xl xl:flex-shrink-0 xl:pt-4">
            <MainFeed />
          </main>

          {/* Right Sidebar - hidden on smaller screens */}
          <aside className="hidden lg:block w-72 lg:w-72 xl:w-80 flex-shrink-0 lg:ml-4 xl:ml-6">
            <div className="sticky top-4 h-fit">
              <div className="bg-cardBackground rounded-lg p-4 border border-cardBorder">
                <RightSideBar />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FeedContainer;
import { useSelector } from "react-redux";
import MainFeed from "../Feed/MainFeed/MainFeed";
import SavedBar from "./SavedBar";

const SavedPostsContainer = () => {

  const currentAuthorId = useSelector((state) => state.authentication.userId);

  return (
    <div className="min-h-screen bg-mainBackground">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center px-0 sm:px-2 md:px-4 lg:px-4 xl:px-6">
          <div className="w-full sm:w-full md:w-48 lg:w-52 xl:w-56 flex-shrink-0 mt-2 md:mt-4">
            <div className="md:top-4 md:h-fit">
              <div className="bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder">
                <SavedBar />
              </div>
            </div>
          </div>
          <main className="w-full mt-2 md:mt-4 md:ml-4 md:flex-1 lg:max-w-md xl:max-w-xl xl:flex-shrink-0">
           <MainFeed API_ROUTE={`/posts/${currentAuthorId}/saved`} showShare={false} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SavedPostsContainer;

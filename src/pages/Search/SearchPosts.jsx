import { useSelector } from "react-redux";
import MainFeed from "../Feed/MainFeed/MainFeed";

const SearchPosts = ({ searchText, network, timeframe }) => {

  const currentAuthorId = useSelector((state) => state.authentication.userId);

  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className="w-full mt-2 md:mt-4 md:ml-4 md:flex-1 lg:max-w-md xl:max-w-xl xl:flex-shrink-0">
        <MainFeed
          API_ROUTE={`/posts/${currentAuthorId}/search`}
          q={searchText}
          timeframe={timeframe}
          network={network}
          showShare={false}
        />
      </main>
    </div>
  );
};

export default SearchPosts;

import { useParams } from "react-router-dom";
import MainFeed from "../Feed/MainFeed/MainFeed";

const SearchPosts = () => {

    const { searchText } = useParams();

  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className="w-[540px] flex-grow-0 mx-2 space-y-4">
        <MainFeed
            API_ROUTE="/posts/search/"
            q={searchText}
            showShare={false}
        />
      </main>
    </div>
  );
};

export default SearchPosts;

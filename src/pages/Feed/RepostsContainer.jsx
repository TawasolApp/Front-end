import { useParams } from "react-router-dom";
import MainFeed from "./MainFeed/MainFeed";
import { useSelector } from "react-redux";

const RepostsContainer = () => {
  const { id } = useParams();
  const currentAuthorId = useSelector((state) => state.authentication.userId);

  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className="w-full mt-2 md:mt-4 md:ml-4 md:flex-1 lg:max-w-md xl:max-w-xl xl:flex-shrink-0">
        <MainFeed API_ROUTE={`/posts/${currentAuthorId}/${id}/reposts`} showShare={false} />
      </main>
    </div>
  );
};

export default RepostsContainer;

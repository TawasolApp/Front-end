import MainFeed from "../Feed/MainFeed/MainFeed";

const SavedPostsContainer = () => {
  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className="w-[540px] flex-grow-0 mx-2 space-y-4">
        <MainFeed API_ROUTE="/posts/saved" showShare={false} />
      </main>
    </div>
  );
};

export default SavedPostsContainer;

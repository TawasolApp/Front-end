import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import MainFeed from "../../../Feed/MainFeed/MainFeed.jsx";

function UserPostsPage() {
  const { user, isOwner } = useOutletContext();
  const userId = user?._id;
  const [loading, setLoading] = useState(!user);

  if (loading) return <LoadingPage />;

  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className="w-full max-w-3xl mx-auto space-y-4">
        <MainFeed
          API_ROUTE={`/posts/${userId}/user/${userId}`}
          showShare={false}
        />
      </main>
    </div>
  );
}

export default UserPostsPage;

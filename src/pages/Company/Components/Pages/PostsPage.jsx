import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import LoadingPage from "../../../LoadingScreen/LoadingPage.jsx";
import MainFeed from "../../../Feed/MainFeed/MainFeed.jsx";

function PostsPage() {
  const navigate = useNavigate();

  const { company, isAdmin } = useOutletContext();
  const { companyId } = useParams();
  const [loading, setLoading] = useState(!company);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-mainBackground gap-0 p-4">
      <main className=" w-full max-w-3xl mx-auto space-y-4">
        <MainFeed
          API_ROUTE={`/posts/${companyId}/user/${companyId}`}
          showShare={isAdmin}
          currentAuthorId={companyId}
          currentAuthorName={company.name}
          currentAuthorPicture={company.logo}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}

export default PostsPage;

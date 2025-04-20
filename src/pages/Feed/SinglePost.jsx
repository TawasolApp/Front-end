import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";
import PostContainer from "./MainFeed/FeedPosts/PostContainer";
import { useSelector } from "react-redux";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`posts/${id}`);
        setPost(response.data);
      } catch (e) {
        navigate("/error-404");
      }
    };
    if (id) fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`/delete/${id}`);
      navigate("/feed");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSharePost = async (
    text,
    media,
    visibility,
    taggedUsers,
    parentPost = null,
    silentRepost = false,
  ) => {
    try {
      await axiosInstance.post("posts", {
        content: text,
        media: media,
        taggedUsers: taggedUsers,
        visibility: visibility,
        parentPostId: parentPost,
        isSilentRepost: silentRepost,
      });
      navigate("/feed");
    } catch (e) {
      console.log(e.message);
    }
  };

  const currentAuthorId = useSelector((state) => state.authentication.userId);
  const currentAuthorName = `${useSelector((state) => state.authentication.firstName)} ${useSelector((state) => state.authentication.lastName)}`;
  const currentAuthorPicture = useSelector(
    (state) => state.authentication.profilePicture,
  );

  return (
    <div className="min-h-screen bg-mainBackground">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center px-2 sm:px-4 md:px-4 lg:px-4 xl:px-6">
          <main className="w-full mt-2 md:mt-4 md:ml-4 md:flex-1 lg:max-w-md xl:max-w-xl xl:flex-shrink-0">
            {post && (
              <PostContainer
                post={post}
                handleSharePost={handleSharePost}
                handleDeletePost={handleDeletePost}
                currentAuthorId={currentAuthorId}
                currentAuthorName={currentAuthorName}
                currentAuthorPicture={currentAuthorPicture}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

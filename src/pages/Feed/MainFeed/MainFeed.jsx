import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import SharePost from "./SharePost/SharePost";
import FeedPosts from "./FeedPosts/FeedPosts";
import { axiosInstance } from "../../../apis/axios";
import { useSelector } from "react-redux";

const MainFeed = ({
  API_ROUTE = "posts",
  q = null,
  timeframe = null,
  network = null,
  showShare = true,
  currentAuthorId = useSelector((state) => state.authentication.userId),
  currentAuthorName = `${useSelector((state) => state.authentication.firstName)} ${useSelector((state) => state.authentication.lastName)}`,
  currentAuthorPicture = useSelector(
    (state) => state.authentication.profilePicture,
  ),
  isAdmin = false,
}) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const isFetching = useRef(false);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const fetchPosts = async (pageNum, reset = false) => {
    if (isFetching.current) return;

    try {
      // el bta3a de bt5lih ymn3 el refetching lama el user y3od yforce scroll
      setLoading(true);
      isFetching.current = true;

      // fetch new posts
      const params = { page: pageNum };
      if (q != null) {
        params.q = q;
        params.network = network;
        params.timeframe = timeframe;
      }
      const response = await axiosInstance.get(API_ROUTE, {
        params: params,
      });

      const rawPosts = response.data;
      const newPosts = rawPosts
        .map((post) => {
          // Case 1: Normal post
          if (!post.parentPost) return post;

          // Case 2: Silent Repost
          if (post.isSilentRepost) {
            return {
              ...post.parentPost, // Take the parent post as the display
              isSilentRepost: true,
              headerData: {
                authorId: post.authorId,
                authorPicture: post.authorPicture,
                authorName: post.authorName,
              },
            };
          }

          // Case 3: Quoted Repost
          return {
            ...post,
            repostedComponents: {
              authorId: post.parentPost.authorId,
              authorPicture: post.parentPost.authorPicture,
              authorName: post.parentPost.authorName,
              authorBio: post.parentPost.authorBio,
              authorType: post.parentPost.authorType,
              timestamp: post.parentPost.timestamp,
              visibility: post.parentPost.visibility,
              content: post.parentPost.content,
              media: post.parentPost.media,
              taggedUsers: post.parentPost.taggedUsers,
            },
          };
        })
        .filter(Boolean); // Remove nulls (from silent reposts)

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }
      }
    } catch (e) {
      console.log(e.message);
      if (reset) setPosts([]);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const loadMorePosts = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
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
      fetchPosts(1, true);
      toast.success("Post shared successfully.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      {showShare && (
        <SharePost
          handleSharePost={handleSharePost}
          currentAuthorName={currentAuthorName}
          currentAuthorPicture={currentAuthorPicture}
        />
      )}

      <div className="sm:rounded-lg rounded-none">
        <FeedPosts
          posts={posts}
          lastPostRef={lastPostElementRef}
          handleSharePost={handleSharePost}
          handleDeletePost={handleDeletePost}
          currentAuthorId={currentAuthorId}
          currentAuthorName={currentAuthorName}
          currentAuthorPicture={currentAuthorPicture}
          isAdmin={isAdmin}
          loading={loading}
        />

        {loading && (
          <div className="w-full bg-cardBackground rounded-none sm:rounded-lg border border-cardBorder mb-4 animate-pulse p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="w-1/3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="w-1/4 h-2 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-5/6 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-2/3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>

            <div className="flex space-x-4 pt-2">
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="mt-6 mb-4 p-6 text-center bg-cardBackground border border-cardBorder rounded-xl shadow-sm flex flex-col items-center gap-2">
            <span className="text-3xl">😵</span>
            <p className="text-lg font-medium text-gray-800 dark:text-white">
              That's all for now!
            </p>
            <p className="text-sm text-gray-500">
              You've reached the end of your feed. Take a break, or check back later for more updates.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MainFeed;

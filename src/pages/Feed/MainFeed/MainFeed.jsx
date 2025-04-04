import { useState, useEffect, useRef, useCallback } from "react";
import SharePost from "./SharePost/SharePost";
import FeedPosts from "./FeedPosts/FeedPosts";
import { axiosInstance } from "../../../apis/axios";

const MainFeed = () => {
  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture =
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";
  const currentAuthorType = "User";

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

  // Initial fetch of posts
  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  // Function to fetch posts with pagination
  const fetchPosts = async (pageNum, reset = false) => {
    if (isFetching.current) return;

    try {
      // el bta3a de bt5lih ymn3 el refetching lama el user y3od yforce scroll
      setLoading(true);
      isFetching.current = true;

      // fetch new posts
      const response = await axiosInstance.get("posts", {
        params: { page: pageNum },
      });
      const rawPosts = response.data;
      const newPosts = rawPosts.map((post) => {
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
        // Case 3: Quoted Repost – lesa 
        return null;
      }).filter(Boolean); // Remove nulls (from silent reposts)

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

  // Function to load more posts
  const loadMorePosts = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleSharePost = async (text, media, visibility, taggedUsers, parentPost = null, silentRepost = false) => {
    try {
      const response = await axiosInstance.post("posts", {
        content: text,
        media: media,
        taggedUsers: taggedUsers,
        visibility: visibility,
        parentPostId: parentPost,
        isSilentRepost: silentRepost
      });

      const newPost = response.data; // Process the post the same way as in fetchPosts
      let formattedPost = newPost;
      if (newPost.parentPost) {
        if (newPost.isSilentRepost) {
          formattedPost = {
            ...newPost.parentPost,
            isSilentRepost: true,
            headerData: {
              authorId: newPost.authorId,
              authorPicture: newPost.authorPicture,
              authorName: newPost.authorName,
            },
          };
        } else {
          // For quoted reposts (when you implement them)
          formattedPost = newPost;
        }
      }
      
      const updatedPosts = [formattedPost, ...posts];
      setPosts(updatedPosts);
      
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/delete/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <SharePost handleSharePost={handleSharePost} />
      <div className="sm:rounded-lg rounded-none">
        <FeedPosts
          posts={posts}
          lastPostRef={lastPostElementRef}
          handleSharePost={handleSharePost}
          handleDeletePost={handleDeletePost}
        />

        {loading && (
          <div className="flex justify-center p-4">
            <div className="loader">Loading...</div>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center p-4 text-header">
            Enough Scrolling for you today 😵
          </div>
        )}
      </div>
    </>
  );
};

export default MainFeed;

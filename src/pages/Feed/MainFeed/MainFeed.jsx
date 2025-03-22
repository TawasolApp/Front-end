import { useState, useEffect, useRef, useCallback } from 'react';
import SharePost from './SharePost/SharePost';
import FeedPosts from './FeedPosts/FeedPosts';
import { axiosInstance } from '../../../apis/axios';

const MainFeed = () => {
    // TODO: change this to redux states
    const currentAuthorId = 1;
    const currentAuthorName = "John Doe";
    const currentAuthorPicture = "https://example.com/avatar.jpg";
    const currentAuthorBio = "Software Engineer at Tech Corp";
    const currentAuthorType = "User";

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // Reference to the observer element at the bottom of the list
    const observer = useRef();
    // Reference to track if we're currently fetching
    const isFetching = useRef(false);

    // Setup Intersection Observer callback
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isFetching.current) {
                loadMorePosts();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Initial fetch of posts
    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    // Function to fetch posts with pagination
    const fetchPosts = async (pageNum, reset = false) => {
        if (isFetching.current) return;
        
        try {
            setLoading(true);
            isFetching.current = true;
            
            const response = await axiosInstance.get('posts', {
                params: { page: pageNum }
            });
            
            const newPosts = response.data;
            
            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                if (reset) {
                    setPosts(newPosts);
                } else {
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
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

    // Refresh the feed (for example, after creating a new post)
    const refreshFeed = () => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    };

    // Function to share a new post
    const sharePost = async (text, visibility) => {
        const newPost = {
            authorId: currentAuthorId,
            content: text,
            media: [],
            taggedUsers: [],
            visibility: visibility,
        };

        try {
            const response = await axiosInstance.post('posts', newPost);
            // Add the new post to the beginning of the list
            setPosts(prevPosts => [response.data, ...prevPosts]);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    };

    return (
        <>
            <SharePost sharePost={sharePost} />
            <div className="rounded-lg border-gray-200">
                <FeedPosts 
                    posts={posts} 
                    lastPostRef={lastPostElementRef}
                />
                
                {loading && (
                    <div className="flex justify-center p-4">
                        <div className="loader">Loading...</div>
                    </div>
                )}
                
                {!hasMore && posts.length > 0 && (
                    <div className="text-center p-4 text-gray-500">
                        No more posts to load
                    </div>
                )}
            </div>
        </>
    );
};

export default MainFeed;
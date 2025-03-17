import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get('posts');
                setPosts(response.data);
            } catch (e) {
                console.log(e.message)
                setPosts([]);
            }
        }
        fetchPosts();
    }, []);

    const sharePost = (text, visibility, type) => {

        const newPost = {
            content: text,
            media: [],
            taggedUsers: [],
            visibility: visibility,
            authorType: type
        }

        const newPostUI = {
            ...newPost,
            id: "42131",
            authorId: currentAuthorId,
            authorName: currentAuthorName,
            authorBio: currentAuthorBio,
            authorPicture: currentAuthorPicture,
            reactions: {
                like: 0,
                celebrate: 0,
                support: 0,
                love: 0,
                insightful: 0,
                funny: 0,
            },
            comments: 0,
            replies: 0,
            isLiked: false,
            timestamp: new Date(),
        }

        try {
            axiosInstance.post('posts', newPost);
            const allPosts = [newPostUI, ...posts];
            setPosts(allPosts);
        } catch (e) {
            console.log(`Error: ${err.message}`);
        }
    }

    return (
        <>
            <SharePost sharePost={sharePost}/>
            <div className="rounded-lg border-gray-200">
                <FeedPosts posts={posts} />
            </div>
        </>
    );
};

export default MainFeed;
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AddComment from './AddComment';
import Comment from './Comment';

const CommentsContainer = ({ postId, rerender }) => {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const mockComments = [
        {
            id: "1",
            postId: postId,
            author: {
                id: "user1",
                name: "John Doe",
                title: "Software Engineer",
                avatar: "https://example.com/avatar.jpg"
            },
            content: "Sample comment text",
            replies: [
                {
                    authorId: "user1",
                    author: {
                        id: "user1",
                        name: "John Doe",
                        title: "Software Engineer",
                        avatar: "https://example.com/avatar.jpg"
                    },
                    text: "hello world",
                    reactions: {
                        like: 44,
                        celebrate: 45,
                        support: 2,
                        love: 0,
                        insightful: 0,
                        funny: 0
                    },
                    timestamp: new Date().toISOString(),
                },
                {
                    authorId: "user1",
                    author: {
                        id: "user1",
                        name: "John Doe",
                        title: "Software Engineer",
                        avatar: "https://example.com/avatar.jpg"
                    },
                    text: "hello world",
                    reactions: {
                        like: 44,
                        celebrate: 45,
                        support: 2,
                        love: 0,
                        insightful: 0,
                        funny: 0
                    },
                    timestamp: new Date().toISOString(),
                },
                {
                    authorId: "user1",
                    author: {
                        id: "user1",
                        name: "John Doe",
                        title: "Software Engineer",
                        avatar: "https://example.com/avatar.jpg"
                    },
                    text: "hello world",
                    reactions: {
                        like: 44,
                        celebrate: 45,
                        support: 2,
                        love: 0,
                        insightful: 0,
                        funny: 0
                    },
                    timestamp: new Date().toISOString(),
                }

            ],
            reactions: {
                like: 44,
                celebrate: 45,
                support: 2,
                love: 0,
                insightful: 0,
                funny: 0
              },
            timestamp: new Date().toISOString(),
            taggedUsers: []
        }
    ];

    useEffect(() => {
        if (postId) {
            const fetchComments = async () => {
                try {
                    setLoading(true);
                    // Simulated API call
                    setComments(mockComments);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchComments();
        }
    }, []);

    const onAddComment = (text) => {
        
        rerender();

        // add a comment with the author of current user
        // setComments(prev => ({
        //     ...prev,
        //     {author: }
        // }));
    }

    return (
        <>
            <AddComment onAddComment={onAddComment} />
            {error && <div className="text-red-500 p-4">{error}</div>}
            {loading && <div className="p-4 flex justify-center"><CircularProgress size={20} /></div>}
            {!error && !loading && comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </>
    );
};

export default CommentsContainer;
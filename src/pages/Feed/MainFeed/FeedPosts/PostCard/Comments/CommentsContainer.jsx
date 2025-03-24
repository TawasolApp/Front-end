import { useEffect, useState, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import AddForm from './AddForm';
import Comment from './Comment';
import { axiosInstance } from '../../../../../../apis/axios';

const CommentsContainer = ({
    postId,
    incrementCommentsNumber,
    commentsCount
}) => {

    // TODO: change this to redux states
    const currentAuthorId = "mohsobh";
    const currentAuthorName = "Mohamed Sobh";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Computer Engineering Student at Cairo University";
    const currentAuthorType = "User";

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [pageNum, setPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const abortControllerRef = useRef(null);
    
    const fetchComments = async () => {
        try {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Create new controller for this request
            const controller = new AbortController();
            abortControllerRef.current = controller;

            setLoading(true);
            const response = await axiosInstance.get(`/posts/comments/${postId}`, {
                params: { 
                    page: pageNum, 
                    limit: 2,
                    _: Date.now() // Cache buster
                },
                signal: controller.signal
            });

            const newComments = response.data;
            setComments(prev => [...prev, ...newComments]);
            setPageNum(prev => prev + 1);
            setHasMore(commentsCount > comments.length + 2);

        } catch (err) {
            if (err.name === 'CanceledError') return;
            if (err.response?.status === 404) {
                setHasMore(false);
            } else {
                setError(err.message || "Failed to load comments");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
            return () => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        }
    }, [postId]);

    const onAddComment = async (text) => {
        try {
            const response = await axiosInstance.post(`/posts/comment/${postId}`, {
                content: text,
                taggedUsers: []
            });
            incrementCommentsNumber("inc");
            setComments(prevComments => [response.data, ...prevComments]);
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleDeleteComment = (commentId) => {
        try {
            axiosInstance.delete(`/posts/comments/${commentId}`);
            incrementCommentsNumber("dec");
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <>
            <AddForm
                handleAddFunction={onAddComment}
                type="Comment"
            />
            {error && <div className="text-red-500 font-black p-4">{error}</div>}
            {loading && <div className="p-4 flex justify-center"><CircularProgress size={20} /></div>}

            {!error && !loading && comments && comments.length > 0 && comments.map((comment, index) => (
                <div
                    key={comment.id}
                    className="py-2"
                >
                    <Comment
                        comment={comment}
                        handleDeleteComment={handleDeleteComment}
                    />
                </div>
            ))}

            {hasMore && (
                <div className="ml-4 my-3 flex items-center">
                    <button
                        onClick={fetchComments}
                        className="flex items-center px-1 py-1 space-x-1 rounded-xl hover:bg-buttonIconHover transition-colors"
                        disabled={loading}
                    >
                        <OpenInFullIcon className="text-icon" fontSize="small" />
                        <span className="text-xs font-medium text-icon pl-1">{loading ? 'Loading...' : 'Load more comments'}</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default CommentsContainer;
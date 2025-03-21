import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AddComment from './AddComment';
import Comment from './Comment';
import { axiosInstance } from '../../../../../../apis/axios';

const CommentsContainer = ({ postId, rerender }) => {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        if (postId) {
            const fetchComments = async () => {
                try {
                    setLoading(true);
                    const response = await axiosInstance.get('comments');
                    setComments(response.data);
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
            {!error && !loading && comments && comments.length > 0 && comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </>
    );
};

export default CommentsContainer;
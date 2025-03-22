import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AddForm from './AddForm';
import Comment from './Comment';
import { axiosInstance } from '../../../../../../apis/axios';

const CommentsContainer = ({
    postId,
    incrementCommentsNumber
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
    

    useEffect(() => {
        if (postId) {
            const fetchComments = async () => {
                try {
                    setLoading(true);
                    const response = await axiosInstance.get(`/posts/comments/${postId}`);
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
            axiosInstance.delete(`/posts/comments/${postId}/${commentId}`);
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
            {error && <div className="text-red-500 p-4">{error}</div>}
            {loading && <div className="p-4 flex justify-center"><CircularProgress size={20} /></div>}

            {!error && !loading && comments && comments.length > 0 && comments.map((comment, index) => (
                <div
                    key={comment.id}
                    className={`border-gray-300 py-2 ${index === comments.length - 1 ? 'pb-4' : ''}`}
                >
                    <Comment
                        comment={comment}
                        handleDeleteComment={handleDeleteComment}
                    />
                </div>
            ))}
        </>
    );
};

export default CommentsContainer;
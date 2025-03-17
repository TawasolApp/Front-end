// AddComment.jsx
import { useState } from 'react';
import { Avatar } from '@mui/material';

const AddComment = ({ onAddComment }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(commentText);
            setCommentText('');
        }
    };

    return (
        <div className="flex items-start pt-1 pb-2 px-4">
            <div className='mt-1 mr-2 h-9'>
                <Avatar sx={{ width: 32, height: 32 }} />
            </div>

            <form onSubmit={handleSubmit} className="flex-1">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
            </form>
        </div>
    );
};

export default AddComment;
import { useState } from 'react';
import { Avatar } from '@mui/material';

const AddForm = ({
    handleAddFunction,
    type
}) => {

    // TODO: change this to redux states
    const currentAuthorId = "mohsobh";
    const currentAuthorName = "Mohamed Sobh";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Computer Engineering Student at Cairo University";
    const currentAuthorType = "User";

    const [commentText, setCommentText] = useState('');
    const hasText = commentText.trim().length > 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            handleAddFunction(commentText);
            setCommentText('');
        }
    };

    return (
        <div className="flex items-start pt-1 pb-2 px-4">
            <div className='mr-2 h-9 w-8'>
                <Avatar 
                    sx={{ width: 32, height: 32 }}
                    className="relative rounded-full top-0 left-0"
                    src={currentAuthorPicture}
                />
            </div>

            <form onSubmit={handleSubmit} className="flex-1 relative">
                <textarea
                    placeholder={type === "Comment" ? "Add a comment..." : "Edit Comment..." }
                    className={`w-full px-3 py-1.5 bg-gray-50 ${hasText ? "rounded-xl" : "rounded-full"} border border-gray-200 focus:outline-none focus:border-gray-400 pr-20 resize-none transition-all duration-200 ${hasText ? 'h-16' : 'h-8'} overflow-hidden`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={1}
                />
              
                {hasText && (
                    <button
                        type="submit"
                        className="absolute right-2 bottom-3 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
                    >
                        {type}
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddForm;
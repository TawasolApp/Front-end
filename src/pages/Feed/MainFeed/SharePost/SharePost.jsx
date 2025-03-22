import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextModal from './TextModal';

const SharePost = ({ sharePost }) => {
    
    // TODO: change this to redux states
    const currentAuthorId = 1;
    const currentAuthorName = "John Doe";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Software Engineer at Tech Corp";
    const currentAuthorType = "User";

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-start gap-2 pb-3">
                    <Avatar 
                        sx={{ width: 48, height: 48 }}
                        className="rounded-full"
                        src={currentAuthorPicture} // Add your src here
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 pl-4 pr-2 py-[10px] my-1 bg-white hover:bg-gray-100 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer focus:outline-none text-left text-gray-500 font-medium transition-colors"
                    >
                        <span>Start a post</span>
                    </button>
                </div>
            </div>


            {/* Modal Overlay */}
            {isModalOpen && (
                <TextModal
                    currentAuthorName={currentAuthorName}
                    currentAuthorPicture={currentAuthorPicture}
                    setIsModalOpen={() => setIsModalOpen(false)}
                    sharePost={sharePost}
                />
            )}
        </>
    );
};

export default SharePost;
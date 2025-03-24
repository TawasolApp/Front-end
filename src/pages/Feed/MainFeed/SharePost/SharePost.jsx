import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextModal from './TextModal';

const SharePost = ({ sharePost }) => {
    
    // TODO: change this to redux states
    const currentAuthorId = "mohsobh";
    const currentAuthorName = "Mohamed Sobh";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Computer Engineering Student at Cairo University";
    const currentAuthorType = "User";

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-cardBackground border border-cardBorder rounded-none sm:rounded-lg p-4 pb-2 mb-4">
                <div className="flex items-start gap-2 pb-3">
                    <Avatar 
                        sx={{ width: 48, height: 48 }}
                        className="rounded-full"
                        src={currentAuthorPicture}
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 pl-4 pr-2 py-2 my-1 bg-cardBackground hover:bg-cardBackgroundHover rounded-full border-2 border-itemBorder text-left"
                    >
                        <span className="font-semibold text-sm text-textPlaceholder">Start a post</span>
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
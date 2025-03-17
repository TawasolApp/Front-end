import { useState } from 'react';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import Avatar from '@mui/material/Avatar';
import DropdownMenu from '../../GenericComponents/DropdownMenu';

const SharePost = ({ sharePost }) => {
    
    // TODO: change this to redux states
    const currentAuthorId = 1;
    const currentAuthorName = "John Doe";
    const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
    const currentAuthorBio = "Software Engineer at Tech Corp";
    const currentAuthorType = "User";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [text, setText] = useState('');
    const [visibilityType, setVisibilityType] = useState('Public');

    const menuItems = [
        {
          text: 'Public',
          onClick: () => setVisibilityType('Public'),
          icon: PublicIcon
        },
        {
            text: 'Connections',
            onClick: () => setVisibilityType('Connections'),
            icon: PeopleIcon
        }
      ];

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {/* Top Section */}
                <div className="flex items-start gap-2 pb-3">
                    {/* User Avatar */}
                    <Avatar 
                        sx={{ width: 48, height: 48 }}
                        className="rounded-full"
                        src={currentAuthorPicture} // Add your src here
                    />

                    {/* Post Input Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 pl-4 pr-2 py-[10px] my-1 bg-white hover:bg-gray-100 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer focus:outline-none text-left text-gray-500 font-medium transition-colors"
                    >
                        <span>Start a post</span>
                    </button>
                </div>

                {/* Post Options */}
                <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-4">
                        {/* Photo Button (without border) */}
                        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded">
                        <PermMediaIcon 
                                className="text-blue-600"
                                sx={{ 
                                    fontSize: 20, // Matches text height
                                    verticalAlign: 'middle' 
                                }}
                            />
                            <span className="text-sm font-medium">Media</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {/* Modal Container */}
                    <div className="bg-white rounded-lg w-full max-w-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <DropdownMenu
                                menuItems={menuItems}
                                position="right-0"
                                width="w-48"
                            >
                                <div className="flex items-start gap-2 mb-4">
                                    <Avatar 
                                        sx={{ width: 48, height: 48 }}
                                        className="rounded-full"
                                        src={currentAuthorPicture}
                                    />
                                    <div>
                                        <h3 className="font-medium">{currentAuthorName}</h3>
                                        <button className="text-sm text-blue-600 font-medium py-1 hover:bg-blue-50 rounded-full flex items-center gap-1">Choose Visiblity 🔽</button>
                                    </div>
                                </div>
                            </DropdownMenu>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4">

                            <textarea
                                placeholder="What do you want to talk about?"
                                className="w-full h-48 p-2 resize-none focus:outline-none text-lg"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <div className="flex justify-between items-center mt-4">
                                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    Add media
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                                        onClick={() => {
                                            sharePost(text, visibilityType, currentAuthorType);
                                            setIsModalOpen(false);
                                            setText('');
                                        }}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SharePost;
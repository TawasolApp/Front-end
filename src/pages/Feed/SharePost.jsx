import { useState } from 'react';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import Avatar from '@mui/material/Avatar';

const SharePost = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {/* Top Section */}
                <div className="flex items-start gap-2 pb-3">
                    {/* User Avatar */}
                    <Avatar 
                        sx={{ width: 48, height: 48 }}
                        className="rounded-full"
                        src="https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747267200&v=beta&t=i7IQGWZtZGe0l3DFYSaSB97k_L6dt8vE2ueVR9loapM" // Add your src here
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
                            <div className="flex items-start gap-2 mb-4">
                                <div className="w-11 h-11 rounded-full bg-gray-200"></div>
                                <div>
                                    <h3 className="font-medium">Your Name</h3>
                                    <button className="text-sm text-blue-600 font-medium px-3 py-1 hover:bg-blue-50 rounded-full">
                                        Anyone 🔽
                                    </button>
                                </div>
                            </div>

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
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50">
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
import { useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import Avatar from '@mui/material/Avatar';
import DropdownMenu from '../../GenericComponents/DropdownMenu';

const TextModal = ({
    currentAuthorName,
    currentAuthorPicture,
    setIsModalOpen,
    sharePost
}) => {

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sharePost(text, visibilityType);
        setIsModalOpen();
        setText('');
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >

            <div className="bg-white rounded-lg w-full max-w-2xl relative">

                <button
                    onClick={setIsModalOpen}
                    className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100 p-2 rounded-full"
                >
                    ✕
                </button>

                <div className="flex items-center justify-between px-4 pt-4">
                    <DropdownMenu
                        menuItems={menuItems}
                        position="right-0"
                        width="w-48"
                    >
                        <div className="flex items-start gap-2 mb-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <Avatar
                                sx={{ width: 48, height: 48 }}
                                className="rounded-full"
                                src={currentAuthorPicture}
                            />
                            <div>
                                <h3 className="font-medium">{currentAuthorName}</h3>
                                <button
                                    className="text-sm text-gray-500 font-medium py-1 flex items-center gap-1"
                                >
                                    Visibility {visibilityType === "Public" ? (
                                        <PublicIcon
                                            sx={{ fontSize: 16 }}
                                            className="text-gray-500 hover:text-gray-700"
                                        />
                                    ) : (
                                        <PeopleIcon
                                            sx={{ fontSize: 16 }}
                                            className="text-gray-500 hover:text-gray-700"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </DropdownMenu>
                </div>

                <form className="px-4 pb-4" onSubmit={handleSubmit}>
                    <textarea
                        placeholder="What do you want to talk about?"
                        className="w-full h-48 p-2 resize-none focus:outline-none text-lg"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded-full ${
                                text.trim()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!text.trim()}
                        >
                            Post
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default TextModal;

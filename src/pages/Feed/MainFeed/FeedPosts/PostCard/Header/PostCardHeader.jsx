import { useState, useEffect, useRef } from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

import ActorHeader from '../../../../GenericComponents/ActorHeader';

const FeedPostCardHeader = ({ author, timestamp }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                handleMenuClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            
            <ActorHeader author={author} timestamp={timestamp} />

            <div className="absolute right-3 top-1" ref={menuRef}>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleMenuToggle}
                        className="text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <MoreHorizIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleMenuClose}
                        className="text-gray-500 hover:bg-gray-100 ml-1 rounded-full"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-1">
                            <button
                                onClick={handleMenuClose}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Save post
                            </button>
                            <button
                                onClick={handleMenuClose}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Report post
                            </button>
                            <button
                                onClick={handleMenuClose}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Hide post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPostCardHeader;
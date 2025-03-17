import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
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
        <div className="relative"> {/* Added wrapper div */}
            {/* Author Info Container - Takes full width */}
            <div className="flex items-start gap-2 w-full pr-16 pl-3 pt-3 mb-2"> {/* Added padding for buttons */}
                {/* Avatar */}
                <a className="hover:underline flex-shrink-0">
                    <Avatar
                        src={author.avatar}
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%'
                        }}
                    />
                </a>

                {/* Author Content - Takes remaining space */}
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for proper truncation */}
                    <a className="hover:underline block">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                            {author.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-px truncate">
                            {author.title}
                        </p>
                    </a>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(timestamp))} •
                        </span>
                        <PublicIcon
                            sx={{
                                fontSize: '14px',
                                verticalAlign: 'text-top'
                            }}
                            className="text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons - Absolutely positioned */}
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
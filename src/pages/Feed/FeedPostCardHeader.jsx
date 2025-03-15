import { useState, useEffect, useRef  } from 'react';
import { Avatar } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
        <div className="flex items-start justify-between mb-4">
            {/* Author Info Container */}
            <div className="flex items-start gap-2 flex-1">
                {/* Avatar with matching height */}
                <a className="hover:underline">
                    <Avatar
                        src={author.avatar}
                        sx={{
                            width: 48,
                            height: 48, // Matches total content height
                            borderRadius: '50%'
                        }}
                    />
                </a>

                {/* Author Content */}
                <div className="flex-1">
                    <a className="hover:underline">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                            {author.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-px">
                            {author.title}
                        </p>
                    </a>

                    {/* Timestamp with precise icon sizing */}
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(timestamp))} •
                        </span>
                        <PublicIcon
                            sx={{
                                fontSize: '14px', // 14px size
                                verticalAlign: 'text-top'
                            }}
                            className="text-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="relative" ref={menuRef}>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleMenuToggle}
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
                    >
                        <MoreHorizIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleMenuClose}
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"    
                    >
                        X
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
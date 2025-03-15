import { useState, useEffect, useRef } from 'react';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoodIcon from '@mui/icons-material/Mood';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const reactionIcons = {
    like: { Icon: ThumbUpIcon, color: '#0a66c2', label: 'Like' },
    celebrate: { Icon: CelebrationIcon, color: '#c37d0a', label: 'Celebrate' },
    support: { Icon: VolunteerActivismIcon, color: '#c20a66', label: 'Support' },
    love: { Icon: FavoriteIcon, color: '#c20a0a', label: 'Love' },
    insightful: { Icon: LightbulbIcon, color: '#0ac2ae', label: 'Insightful' },
    funny: { Icon: MoodIcon, color: '#7dc20a', label: 'Funny' },
};

const LikeButton = ({ onChange }) => {
    const [currentReaction, setCurrentReaction] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);

    const handleReaction = (reactionType) => {
        const isSame = currentReaction === reactionType;
        const newReaction = isSame ? null : reactionType;
        setCurrentReaction(newReaction);
        onChange?.(newReaction, !isSame);
        setShowPicker(false);
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowPicker(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            if (!containerRef.current?.matches(':hover')) {
                setShowPicker(false);
            }
        }, 200);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const renderButtonContent = () => {
        if (currentReaction) {
            const { Icon, color, label } = reactionIcons[currentReaction];
            return (
                <>
                    <Icon style={{ color }} className="w-5 h-5" />
                    <span style={{ color }} className="text-sm">{label}</span>
                </>
            );
        }
        return (
            <>
                <ThumbUpOffAltIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Like</span>
            </>
        );
    };

    return (
        <div className="relative group"
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded w-full justify-center"
                onClick={() => handleReaction(currentReaction || 'like')}
            >
                {renderButtonContent()}
            </button>

            {showPicker && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 bg-white rounded-full shadow-lg p-2 border border-gray-200 z-10">
                    {Object.entries(reactionIcons).map(([reactionType, { Icon, color, label }]) => (
                        <div
                            key={reactionType}
                            className="relative group/icon"
                        >
                            {/* Floating label positioned for scaled icon */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {label}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mb-1"></div>
                                </div>
                            </div>

                            {/* Icon with individual scaling */}
                            <button
                                className="transform transition-transform duration-200 origin-bottom hover:scale-150 hover:-translate-y-2"
                                onClick={() => handleReaction(reactionType)}
                            >
                                <Icon
                                    style={{ color }}
                                    className="w-6 h-6 transition-all duration-200"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikeButton;
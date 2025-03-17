import { useState, useEffect, useRef } from 'react';
import reactionIcons from './reactionIcons';

const ReactionPicker = ({ onSelectReaction, children }) => {
    const [showPicker, setShowPicker] = useState(false);
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShowPicker(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            if (!containerRef.current?.matches(':hover')) {
                setShowPicker(false);
            }
        }, 500);
    };

    const handleReactionSelect = (reactionType) => {
        onSelectReaction(reactionType);
        setShowPicker(false);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <div
            className="relative group"
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {showPicker && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 bg-white rounded-full shadow-lg p-2 border border-gray-200 z-10">
                    {Object.entries(reactionIcons).map(([reactionType, { Icon, color, label }]) => (
                        <div
                            key={reactionType}
                            className="relative group/icon"
                        >
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {label}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mb-1"></div>
                                </div>
                            </div>

                            <button
                                className="transform transition-transform duration-200 origin-bottom hover:scale-150 hover:-translate-y-2"
                                onClick={() => handleReactionSelect(reactionType)}
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

export default ReactionPicker;
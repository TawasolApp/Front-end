import { useState, useEffect, useRef } from 'react';
import reactionIcons from './reactionIcons';

const ReactionPicker = ({
    onSelectReaction,
    children
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState(null);
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
                setHoveredIcon(null);
            }
        }, 300);
    };

    const handleReactionSelect = (reactionType) => {
        onSelectReaction(reactionType);
        setShowPicker(false);
    };

    const handleIconHover = (reactionType) => {
        setHoveredIcon(reactionType);
    };

    const handleIconLeave = () => {
        setHoveredIcon(null);
    };

    useEffect(() => {
        return () => {
            setShowPicker(false);
            setHoveredIcon(null);
            clearTimeout(timeoutRef.current);
        }
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
                <div className={`absolute h-16 bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center bg-cardBackground rounded-full shadow-lg px-2 border border-itemBorder z-10 transition-all duration-300 ${hoveredIcon ? 'scale-90' : ''}`}>
                    {Object.entries(reactionIcons).map(([reactionType, { Icon, color, label }], index, array) => {
                        const isHovered = hoveredIcon === reactionType;
                        
                        let pushClass = '';
                        if (hoveredIcon) {
                            const hoveredIndex = array.findIndex(([type]) => type === hoveredIcon);
                            if (index < hoveredIndex) {
                                pushClass = '-translate-x-4';
                            } else if (index > hoveredIndex) {
                                pushClass = 'translate-x-4';
                            }
                        }
                        
                        return (
                            <div
                                key={reactionType}
                                className={`relative transition-all duration-300 ${pushClass}`}
                                onMouseEnter={() => handleIconHover(reactionType)}
                                onMouseLeave={handleIconLeave}
                            >
                                <div 
                                    className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 transition-all pointer-events-none 
                                    ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                                >
                                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        {label}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mb-1"></div>
                                    </div>
                                </div>

                                <button
                                    className={`my-2 py-2 transform transition-all duration-200 origin-bottom ${isHovered ? 'scale-150 -translate-y-2' : ''}`}
                                    onClick={() => {setHoveredIcon(null); handleReactionSelect(reactionType)}}
                                >
                                    <Icon className={`w-14 h-14 p-0.5 transition-all duration-200`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReactionPicker;

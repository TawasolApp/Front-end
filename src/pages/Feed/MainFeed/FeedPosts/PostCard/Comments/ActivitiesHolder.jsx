import { useState, useMemo } from 'react';
import reactionIcons from '../../../../GenericComponents/reactionIcons';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';

const ActivitiesHolder = ({
    reactions,
    onReactionChange,
    replies,
    setShowReplies
}) => {
    const [currentReaction, setCurrentReaction] = useState(null);
    
    // Memoized calculations
    const { topReactions, totalLikes } = useMemo(() => {
        const filtered = Object.entries(reactions)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
        
        return {
            topReactions: filtered.slice(0, 3),
            totalLikes: filtered.reduce((acc, [_, count]) => acc + count, 0)
        };
    }, [reactions]);

    const handleReaction = (reactionType) => {
        if (currentReaction === null) {
            onReactionChange(reactionType, null);
            setCurrentReaction(reactionType);
        } else if (currentReaction === reactionType) {
            onReactionChange(null, reactionType);
            setCurrentReaction(null);
        } else {
            onReactionChange(reactionType, currentReaction);
            setCurrentReaction(reactionType);
        }
    };

    // Reaction display component
    const ReactionDisplay = () => {
        if (!currentReaction) return (
            <span className="text-xs text-gray-500 hover:text-blue-600">Like</span>
        );

        const { Icon, color, label } = reactionIcons[currentReaction];
        return (
            <div className="flex items-center gap-1">
                <span style={{ color }} className="text-xs font-medium">{label}</span>
            </div>
        );
    };

    return (
        <div className="flex items-center text-gray-500 mt-1">

            {/* Reactions Section */}
            <div className="flex items-center">
                <ReactionPicker onSelectReaction={handleReaction}>
                    <button
                        className="flex items-center px-2 py-1 rounded-md hover:bg-gray-100"
                        onClick={() => handleReaction(currentReaction || 'like')}
                    >
                        <ReactionDisplay />
                    </button>
                </ReactionPicker>

                {totalLikes > 0 && (
                    <div className="flex items-center gap-1">
                        <div className="flex items-center -space-x-1">
                            {topReactions.map(([reactionType]) => {
                                const { Icon, color } = reactionIcons[reactionType];
                                return (
                                    <div key={reactionType} className="bg-white rounded-full p-0.5">
                                        <Icon style={{ fontSize: 14, color }} />
                                    </div>
                                );
                            })}
                        </div>
                        <span className="text-xs hover:text-blue-600 cursor-pointer">
                            {totalLikes}
                        </span>
                    </div>
                )}
            </div>

            {/* Reply Button */}
            {replies && (
                <>
                    <span className="text-gray-300 px-1">|</span>
                    <button
                        className="text-xs text-gray-500 hover:text-blue-600 py-1 rounded-md"
                        onClick={() => setShowReplies(true)}
                    >
                        Reply
                    </button>
                    {/* Replies Section */}
                    {replies > 0 && (
                        <>
                            <span className="text-gray-300 px-1">•</span>
                            <span className="text-xs text-gray-500 py-1 rounded-md">{replies} {replies === 1 ? 'reply' : 'replies'}</span>
                        </>
                    )}
                </>
            )}
            
        </div>
    );
}

export default ActivitiesHolder;
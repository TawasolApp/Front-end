import { useState, useMemo } from 'react';
import reactionIcons from '../../../../GenericComponents/reactionIcons';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';

const ActivitiesHolder = ({
    initReactValue=null,
    reactions,
    onReactionChange,
    setShowReactions,
    replies,
    setShowReplies
}) => {
    const [currentReaction, setCurrentReaction] = useState(initReactValue);
    
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
            <span className="text-sm font-semibold text-gray-500">Like</span>
        );

        const { Icon, color, label } = reactionIcons[currentReaction];
        return (
            <div className="flex items-center">
                <span style={{ color }} className="text-sm font-semibold">{label}</span>
            </div>
        );
    };

    return (
        <div className="flex items-center text-gray-500">

            {/* Reactions Section */}
            <div className="flex items-center">
                <ReactionPicker onSelectReaction={handleReaction}>
                    <button
                        className="flex px-1 items-center rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => handleReaction(currentReaction || 'like')}
                    >
                        <ReactionDisplay />
                    </button>
                </ReactionPicker>

                {totalLikes > 0 && (
                    <div className="flex items-center">
                        <span className="pr-1 text-xs font-light">•</span>
                        <div
                            className="flex -space-x-2 cursor-pointer hover:transition-all group"
                            onClick={setShowReactions}
                        >
                            {topReactions.map(([reactionType]) => {
                                const { Icon, color } = reactionIcons[reactionType];
                                return (
                                    <div key={reactionType} className="relative">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                );
                            })}
                            <span className="text-xs pl-2 group-hover:text-blue-600 group-hover:underline">
                                {totalLikes}
                            </span>
                        </div>
                    </div>
                )}
            </div>


            <span className="text-gray-400 pl-1 text-xs font-semibold">|</span>
            <button
                className="text-sm font-semibold text-gray-500 px-1 rounded-md hover:bg-gray-100 transition-all duration-200"
                onClick={() => setShowReplies(true)}
            >
                Reply
            </button>

            {/* Reply Button */}
            {replies > 0 && (
                <>
                    <span className="text-gray-300 pr-1 text-xs font-light">•</span>
                    <span className="text-xs font-normal text-gray-500 py-1 rounded-md">{replies} {replies === 1 ? 'reply' : 'replies'}</span>
                </>
            )}
            
        </div>
    );
}

export default ActivitiesHolder;
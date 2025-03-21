import { useMemo } from 'react';
import reactionIcons from '../../../../GenericComponents/reactionIcons';

const EngagementMetrics = ({
    reactions,
    comments,
    reposts,
    setShowLikes,
    setShowComments,
    setShowReposts
}) => {

    const topReactions = useMemo(() => {
        return Object.entries(reactions)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    }, [reactions]);

    const totalLikes = useMemo(() => {
        return Object.values(reactions).reduce((acc, curr) => acc + curr, 0);
    }, [reactions]);

    return (
        <div className="flex items-center justify-between text-gray-500 mx-4 border-b border-black/10">

            {/* Left Section - Reactions */}
            <button
                className="flex items-center space-x-2 hover:underline"
                onClick={() => setShowLikes(true)}
            >
                <div className="flex items-center -space-x-1">
                    {topReactions.map(([reactionType]) => {
                        const { Icon, color } = reactionIcons[reactionType];
                        return (
                            <div key={reactionType} className="p-0.5">
                                <Icon
                                    sx={{
                                        fontSize: 16,
                                        color: color
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                {totalLikes > 0 && (
                    <span className="text-xs pr-0 ml-0.5 hover:text-blue-600">{totalLikes}</span>
                )}
            </button>

            {/* Right Section - Comments & Reposts */}
            <div className="flex items-center">
                {comments > 0 && (
                    <button
                        className="text-xs mx-1 hover:underline hover:text-blue-600"
                        onClick={() => setShowComments(true)}
                    >
                        {comments} {comments === 1 ? "comment" : "comments"}
                    </button>
                )}
                {comments > 0 && reposts > 0 && (
                    <span>•</span>
                )}
                {reposts > 0 && (
                    <button
                        className="text-xs mx-1 hover:underline hover:text-blue-600"
                        onClick={() => setShowReposts(true)}
                    >
                        {reposts} {reposts === 1 ? "repost" : "reposts"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EngagementMetrics;
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
        <div className="flex items-center justify-between text-textPlaceholder pb-1 mx-4 border-b border-cardBorder">
            <button
                className="flex items-center hover:transition-all group"
                onClick={() => setShowLikes(true)}
            >
                <div className="flex -space-x-2">
                    {topReactions.map(([reactionType]) => {
                        const { Icon, color } = reactionIcons[reactionType];
                        return (
                            <div key={reactionType} className="relative">
                                <Icon className="w-5 h-5" />
                            </div>
                        );
                    })}
                </div>
                {totalLikes > 0 && (
                    <span className="text-sm ml-1 group-hover:text-textPlaceholderHover group-hover:underline">{totalLikes}</span>
                )}
            </button>
            <div className="flex items-center">
                {comments > 0 && (
                    <button
                        className="text-xs mx-1 hover:underline hover:text-textPlaceholderHover"
                        onClick={() => setShowComments(true)}
                    >
                        {comments} {comments === 1 ? "comment" : "comments"}
                    </button>
                )}
                {comments > 0 && reposts > 0 && (
                    <span className="mx-1">•</span>
                )}
                {reposts > 0 && (
                    <button
                        className="text-xs mx-1 hover:underline hover:text-textPlaceholderHover"
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
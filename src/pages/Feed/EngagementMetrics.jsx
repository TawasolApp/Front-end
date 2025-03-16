import { useMemo } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MoodIcon from '@mui/icons-material/Mood';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const reactionIcons = {
    like: { Icon: ThumbUpIcon, color: '#0a66c2' },
    celebrate: { Icon: CelebrationIcon, color: '#c37d0a' },
    support: { Icon: VolunteerActivismIcon, color: '#c20a66' },
    love: { Icon: FavoriteIcon, color: '#c20a0a' },
    insightful: { Icon: LightbulbIcon, color: '#0ac2ae' },
    funny: { Icon: MoodIcon, color: '#7dc20a' },
};

const EngagementMetrics = ({ reactions, comments, reposts, setShowComments }) => {
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
            >
                <div className="flex items-center -space-x-1"> {/* Tighter spacing */}
                    {topReactions.map(([reactionType]) => {
                        const { Icon, color } = reactionIcons[reactionType];
                        return (
                            <div
                                key={reactionType}
                                className="p-0.5"
                            >
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
                    <span className="text-xs pr-0 ml-0.5">{totalLikes}</span>
                )}
            </button>

            {/* Right Section - Comments & Reposts */}
            <div className="flex items-center">
                <button
                    className="text-xs mx-1 hover:underline hover:text-blue-600"
                    onClick={() => setShowComments(true)}
                >
                    {comments} comments
                </button>
                <span>•</span>
                <button className="text-xs mx-1 hover:underline hover:text-blue-600">
                    {reposts} reposts
                </button>
            </div>
        </div>
    );
};

export default EngagementMetrics;
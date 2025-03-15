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

const EngagementMetrics = ({ reactions, comments, reposts }) => {
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
        <div className="flex items-center justify-between text-gray-500 pt-3 border-t border-gray-200">
            {/* Left Section - Reactions */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-[-6px]">
                    {topReactions.map(([reactionType]) => {
                        const { Icon, color } = reactionIcons[reactionType];
                        return (
                            <div
                                key={reactionType}
                                className="bg-white rounded-full p-0.5 shadow border border-gray-200"
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
                    <span className="text-xs">{totalLikes}</span>
                )}
            </div>

            {/* Right Section - Comments & Reposts */}
            <div className="flex items-center">
                <span className="text-xs mx-1">
                    {comments} comments
                </span>
                <span>•</span>
                <span className="text-xs mx-1">
                    {reposts} reposts
                </span>
            </div>
        </div>
    );
};

export default EngagementMetrics;
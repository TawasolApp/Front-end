import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoodIcon from '@mui/icons-material/Mood';

const reactionIcons = {
    like: { Icon: ThumbUpIcon, color: '#0a66c2' },
    celebrate: { Icon: CelebrationIcon, color: '#c37d0a' },
    support: { Icon: VolunteerActivismIcon, color: '#c20a66' },
    love: { Icon: FavoriteIcon, color: '#c20a0a' },
    insightful: { Icon: LightbulbIcon, color: '#0ac2ae' },
    funny: { Icon: MoodIcon, color: '#7dc20a' },
};

export default reactionIcons;
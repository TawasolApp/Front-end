import { useState } from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import reactionIcons from '../../../../GenericComponents/reactionIcons';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';

const LikeButton = ({ onChange }) => {
    const [currentReaction, setCurrentReaction] = useState(null);

    const handleReaction = (reactionType) => {
        if (currentReaction === null) {
            onChange(reactionType, null);
            setCurrentReaction(reactionType);
        } else if (currentReaction === reactionType) {
            onChange(null, reactionType);
            setCurrentReaction(null);
        } else {
            onChange(reactionType, currentReaction);
            setCurrentReaction(reactionType);
        }
    };

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
        <ReactionPicker onSelectReaction={handleReaction}>
            <button
                className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded w-full justify-center"
                onClick={() => handleReaction(currentReaction || 'like')}
            >
                {renderButtonContent()}
            </button>
        </ReactionPicker>
    );
};

export default LikeButton;
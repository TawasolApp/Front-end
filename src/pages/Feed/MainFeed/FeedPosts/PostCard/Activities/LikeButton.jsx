import { useState } from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import reactionIcons from '../../../../GenericComponents/reactionIcons';
import ReactionPicker from '../../../../GenericComponents/ReactionPicker';

const LikeButton = ({
    initReactValue,
    onChange
}) => {
    const [currentReaction, setCurrentReaction] = useState(initReactValue);

    const handleReaction = (reactionType) => {
        if (currentReaction === null) {
            setCurrentReaction(reactionType);
            onChange(reactionType, null);
        } else if (currentReaction === reactionType) {
            setCurrentReaction(null);
            onChange(null, reactionType);
        } else {
            setCurrentReaction(reactionType);
            onChange(reactionType, currentReaction);
        }
    };

    const renderButtonContent = () => {
        if (currentReaction) {
            const { Icon, color, label } = reactionIcons[currentReaction];
            return (
                <>
                    <Icon style={{ color }} className="w-4 h-4 group-hover:text-black" />
                    <span style={{ color }} className="text-sm font-semibold text-gray-600 group-hover:text-black">
                        {label}
                    </span>
                </>
            );
        }
        return (
            <>
                <ThumbUpOffAltIcon sx={{ fontSize: 16 }} className="text-textActivity group-hover:text-textActivityHover" />
                <span className="text-sm font-semibold text-textActivity group-hover:text-textActivityHover">Like</span>
            </>
        );
    };

    return (
        <ReactionPicker onSelectReaction={handleReaction}>
            <button
                className="flex items-center gap-1 p-2 hover:bg-buttonIconHover hover:transition-all duration-200 w-full justify-center group"
                onClick={() => handleReaction(currentReaction || 'Like')}
            >
                {renderButtonContent()}
            </button>
        </ReactionPicker>
    );
};

export default LikeButton;

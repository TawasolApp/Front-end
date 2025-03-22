import { getIconComponent } from '../../../utils/iconMapper';

const reactionIcons = {
    Like: { Icon: getIconComponent('react-like'), color: '#0a66c2', label: "Like" },
    Celebrate: { Icon: getIconComponent('react-celebrate'), color: '#44712e', label: "Celebrate" },
    Support: { Icon: getIconComponent('react-support'), color: '#715e86', label: "Support" },
    Love: { Icon: getIconComponent('react-love'), color: '#b24020', label: "Love" },
    Insightful: { Icon: getIconComponent('react-insightful'), color: '#915907', label: "Insightful" },
    Funny: { Icon: getIconComponent('react-funny'), color: '#1a707e', label: "Funny" },
};

export default reactionIcons;
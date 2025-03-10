import React from "react";

// paths
import InBlack from '../assets/icons/in-black.svg?react';

// icons map
const ICONS_MAP = {
    'in-black': InBlack,
};

export const getIconComponent = (iconName) => {
   
    if (!iconName) return null;
    const IconComponent = ICONS_MAP[iconName];
    return IconComponent ? (props) => <IconComponent {...props} /> : null;
}
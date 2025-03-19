import React from "react";

// paths
import InBlack from '../assets/icons/in-black.svg?react';
import GoogleG from '../assets/icons/google-g.svg?react'

// icons map
const ICONS_MAP = {
    'in-black': InBlack,
    'google-g': GoogleG,
};

export const getIconComponent = (iconName) => {
   
    if (!iconName) return null;
    const IconComponent = ICONS_MAP[iconName];
    return IconComponent ? (props) => <IconComponent {...props} /> : null;
}
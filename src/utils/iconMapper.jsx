import React from "react";

// paths
import InBlack from "../assets/icons/in-black.svg?react";
import InWhite from "../assets/icons/in-blue.svg?react";
import GoogleG from "../assets/icons/google-g.svg?react";
import ReactLike from "../assets/icons/react-like.svg?react";
import ReactCelebrate from "../assets/icons/react-celebrate.svg?react";
import ReactInsightful from "../assets/icons/react-insightful.svg?react";
import ReactFunny from "../assets/icons/react-funny.svg?react";
import ReactLove from "../assets/icons/react-love.svg?react";
import ReactSupport from "../assets/icons/react-support.svg?react";
import TawasolLarge from "../assets/icons/tawasol-large.svg?react";

const ICONS_MAP = {
  "in-black": InBlack,
  "in-white": InWhite,
  "google-g": GoogleG,
  "react-like": ReactLike,
  "react-celebrate": ReactCelebrate,
  "react-insightful": ReactInsightful,
  "react-funny": ReactFunny,
  "react-love": ReactLove,
  "react-support": ReactSupport,
  "tawasol-large": TawasolLarge,
};

export const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const IconComponent = ICONS_MAP[iconName];
  return IconComponent ? (props) => <IconComponent {...props} /> : null;
};

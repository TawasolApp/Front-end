import { getIconComponent } from "../../../utils/iconMapper";

const isDarkMode = document.getElementById("root")?.className === "dark";
const reactionIcons = {
  Like: {
    Icon: getIconComponent("react-like"),
    color: isDarkMode ? "#3399ff" : "#0a66c2",
    label: "Like",
  },
  Celebrate: {
    Icon: getIconComponent("react-celebrate"),
    color: isDarkMode ? "#5fa740" : "#44712e",
    label: "Celebrate",
  },
  Support: {
    Icon: getIconComponent("react-support"),
    color: isDarkMode ? "#9a7bb0" : "#715e86",
    label: "Support",
  },
  Love: {
    Icon: getIconComponent("react-love"),
    color: isDarkMode ? "#e45030" : "#b24020",
    label: "Love",
  },
  Insightful: {
    Icon: getIconComponent("react-insightful"),
    color: isDarkMode ? "#bb750f" : "#915907",
    label: "Insightful",
  },
  Funny: {
    Icon: getIconComponent("react-funny"),
    color: isDarkMode ? "#2cb2c5" : "#1a707e",
    label: "Funny",
  },
};

export default reactionIcons;

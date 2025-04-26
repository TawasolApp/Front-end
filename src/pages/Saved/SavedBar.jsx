import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import WorkIcon from "@mui/icons-material/Work";
import AppsIcon from "@mui/icons-material/Apps";

const menuItems = [
  {
    label: "Saved Posts",
    path: "/my-items/saved-posts",
    icon: <DynamicFeedIcon className="text-gray-400 mr-2 text-base" />,
  },
  {
    label: "Saved Jobs",
    path: "/my-items/saved-jobs",
    icon: <WorkIcon className="text-gray-400 mr-2 text-base" />,
  },
  {
    label: "Applied Jobs",
    path: "/my-items/applied-jobs",
    icon: <AppsIcon className="text-gray-400 mr-2 text-base" />,
  },
];

const SavedBar = () => {
  const [isTopPosition, setIsTopPosition] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      setIsTopPosition(window.innerWidth < 768);
    };
    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  return (
    <div className="w-full">
      <div className="py-2 block">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <div className="flex items-center px-3 py-2 text-sm hover:bg-buttonIconHover cursor-pointer group transition-all">
              {item.icon}
              <span className="text-xs font-semibold text-textHeavyTitle group-hover:text-textHeavyTitleHover">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SavedBar;

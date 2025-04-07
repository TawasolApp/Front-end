import { useState, useEffect } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";

const LeftSideBar = () => {

  // State to track if the sidebar is in top position (mobile/tablet view)
  const [isTopPosition, setIsTopPosition] = useState(false);
  // State to track if the additional items are shown (when in top position)
  const [showMore, setShowMore] = useState(false);

  const currentAuthorName = `${useSelector((state) => state.authentication.firstName)} ${useSelector((state) => state.authentication.lastName)}`;
  const currentAuthorPicture = useSelector((state) => state.authentication.picture);
  const currentAuthorBio = useSelector((state) => state.authentication.bio);
  const currentAuthorbackgroundImage = useSelector((state) => state.authentication.coverPhoto);

  // Effect to check if we're in top position (mobile/tablet) based on screen width
  useEffect(() => {
    const checkPosition = () => {
      setIsTopPosition(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkPosition();

    // Add resize listener
    window.addEventListener("resize", checkPosition);

    // Cleanup
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  // Toggle the show more state
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div
          className="h-20 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${currentAuthorbackgroundImage})` }}
        />
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <Avatar
            src={currentAuthorPicture}
            alt={currentAuthorName}
            sx={{ width: 64, height: 64 }}
            className="border-2 border-white"
          />
        </div>
      </div>

      <Link to={`/users/`}>
        <div className="pt-10 pb-4 text-center px-2">
          <h2 className="font-semibold text-base text-authorName">
            {currentAuthorName}
          </h2>
          <p className="text-xs font-normal text-authorBio mt-1">
            {currentAuthorBio}
          </p>
        </div>
      </Link>

      <div className="border-t border-cardBorder mx-2"></div>

      {/* Show these items always in sidebar mode, or when "show more" is toggled in top mode */}
      <div
        className={`py-2 ${isTopPosition && !showMore ? "hidden" : "block"}`}
      >
        <div className="flex items-center px-3 py-2 text-sm hover:bg-buttonIconHover cursor-pointer group transition-all">
          <WorkIcon className="text-yellow-600 mr-2 text-base" />
          <span className="text-xs font-semibold text-textHeavyTitle group-hover:text-textHeavyTitleHover">
            Try Premium for EGP0
          </span>
        </div>

        <Link to="/my-items/saved-posts">
          <div className="flex items-center px-3 py-2 text-sm hover:bg-buttonIconHover cursor-pointer group transition-all">
            <BookmarkIcon className="text-gray-400 mr-2 text-base" />
            <span className="text-xs font-semibold text-textHeavyTitle group-hover:text-textHeavyTitleHover">
              Saved items
            </span>
          </div>
        </Link>
      </div>

      {/* Show more/less toggle button only in top position */}
      {isTopPosition && (
        <button
          onClick={toggleShowMore}
          className="w-full flex items-center justify-center py-2 text-sm font-medium bg-mainBackground text-textPlaceholder"
        >
          {showMore ? (
            <>
              Show less{" "}
              <KeyboardArrowUpIcon
                className="ml-1 text-icon"
                fontSize="small"
              />
            </>
          ) : (
            <>
              Show more{" "}
              <KeyboardArrowDownIcon
                className="ml-1 text-icon"
                fontSize="small"
              />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LeftSideBar;

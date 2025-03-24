import { useState, useEffect } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const LeftSideBar = () => {
  // State to track if the sidebar is in top position (mobile/tablet view)
  const [isTopPosition, setIsTopPosition] = useState(false);
  // State to track if the additional items are shown (when in top position)
  const [showMore, setShowMore] = useState(false);

  // TODO: change this to redux states
  const currentAuthorId = "mohsobh";
  const currentAuthorName = "Mohamed Sobh";
  const currentAuthorPicture = "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4";
  const currentAuthorbackgroundImage = "https://media.licdn.com/dms/image/v2/C5616AQEpIPNIk_32eg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1516588679082?e=1748476800&v=beta&t=M8P7LxX0kIyegMFh9MslkxAotJMAhJIhogi6U9DJZcE";
  const currentAuthorBio = "Computer Engineering Student at Cairo University";

  // Effect to check if we're in top position (mobile/tablet) based on screen width
  useEffect(() => {
    const checkPosition = () => {
      setIsTopPosition(window.innerWidth < 768); // md breakpoint
    };
    
    // Initial check
    checkPosition();
    
    // Add resize listener
    window.addEventListener('resize', checkPosition);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkPosition);
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
          <img
            src={currentAuthorPicture}
            alt={currentAuthorName}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
        </div>
      </div>

      <Link to={`/in/${currentAuthorId}`}>
        <div className="pt-10 pb-4 text-center px-2">
          <h2 className="font-semibold text-base text-gray-900">{currentAuthorName}</h2>
          <p className="text-xs font-normal text-gray-600 mt-1">{currentAuthorBio}</p>
        </div>
      </Link>

      <div className="border-t border-gray-200 mx-2"></div>

      {/* Show these items always in sidebar mode, or when "show more" is toggled in top mode */}
      <div className={`py-2 ${isTopPosition && !showMore ? 'hidden' : 'block'}`}>
        <div className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer group transition-all">
          <WorkIcon className="text-yellow-600 mr-2 text-base" />
          <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-500">Try Premium for EGP0</span>
        </div>

        <Link to="/my-items/saved-posts">
          <div className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer group transition-all">
            <BookmarkIcon className="text-gray-500 mr-2 text-base" />
            <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-500">Saved items</span>
          </div>
        </Link>
      </div>

      {/* Show more/less toggle button only in top position */}
      {isTopPosition && (
        <button 
          onClick={toggleShowMore}
          className="w-full flex items-center justify-center py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all border-t border-gray-200"
        >
          {showMore ? (
            <>
              Show less <KeyboardArrowUpIcon className="ml-1" fontSize="small" />
            </>
          ) : (
            <>
              Show more <KeyboardArrowDownIcon className="ml-1" fontSize="small" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LeftSideBar;
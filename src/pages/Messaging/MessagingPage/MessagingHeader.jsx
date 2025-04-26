import { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { MoreHoriz } from "@mui/icons-material";

const MessagingHeader = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim()) {
      // TODO: Handle search functionality here
      console.log("Searching for:", searchText.trim());
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-b border-cardBorder shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Left Section - Title and Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg font-semibold text-text whitespace-nowrap">
            Messaging
          </h1>

          <div
            ref={searchContainerRef}
            className={`relative transition-all duration-300 ease-in-out ${
              isSearchFocused ? "w-full" : "w-1/2"
            }`}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <SearchIcon className="text-navbarIconsNormal" fontSize="small" />
            </div>
            <input
              type="text"
              placeholder="Search messages"
              ref={searchRef}
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className={`pl-10 pr-4 py-1 h-10 bg-navbarSearch rounded-md w-full text-sm text-text outline-none transition-all duration-300 ease-in-out ${
                isSearchFocused ? "border border-navbarSearchBorder" : ""
              }`}
            />
          </div>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors">
            <MoreHoriz className="text-textActivity" fontSize="small" />
          </button>
          <button className="p-2 rounded-full hover:bg-cardBackgroundHover transition-colors">
            <EditIcon className="text-textActivity" fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingHeader;

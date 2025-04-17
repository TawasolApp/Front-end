import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar } from "@mui/material";
import { axiosInstance } from "../../../../../apis/axios";
import reactionIcons from "../../../GenericComponents/reactionIcons";
import DropdownMenu from "../../../GenericComponents/DropdownMenu";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const ReactionsModal = ({ API_URL, setShowLikes, reactCounts }) => {
  const [reactionsData, setReactionsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // Process reactCounts to include "All" category
  const processedReactCounts = useMemo(() => {
    if (!reactCounts) return { all: 0 };

    const filtered = Object.entries(reactCounts).filter(
      ([key]) => key !== "none",
    );

    const total = filtered.reduce((sum, [, count]) => sum + (count || 0), 0);

    return {
      ...Object.fromEntries(filtered),
      all: total,
    };
  }, [reactCounts]);

  // Get reaction types sorted by count
  const reactionTypes = useMemo(() => {
    if (!processedReactCounts) return [];

    return Object.keys(processedReactCounts)
      .filter((type) => type !== "all" && processedReactCounts[type] > 0)
      .sort(
        (a, b) =>
          (processedReactCounts[b] || 0) - (processedReactCounts[a] || 0),
      );
  }, [processedReactCounts]);

  // Fetch reactions data with pagination
  const fetchReactions = useCallback(
    async (pageNum = 1, reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(API_URL, {
          params: {
            page: pageNum,
            type: capitalizeFirstLetter(selectedTab),
          },
        });

        const newData = response.data;
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        const filteredData =
          selectedTab === "all"
            ? newData
            : newData.filter(
                (reaction) =>
                  reaction.type.toLowerCase() === selectedTab.toLowerCase(),
              );

        setReactionsData((prev) =>
          reset ? filteredData : [...prev, ...filteredData],
        );
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL, loading, hasMore, selectedTab],
  );

  // Initial data fetch
  useEffect(() => {
    setReactionsData([]);
    setPage(1);
    setHasMore(true);
    fetchReactions(1, true);
  }, [selectedTab]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchReactions(page + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchReactions, hasMore, loading, page]);

  const handleTabClick = useCallback((type) => {
    return (e) => {
      if (e) e.preventDefault();
      setSelectedTab(type);
    };
  }, []);

  const [visibleTabs, dropdownTabs] = useMemo(() => {
    if (reactionTypes.length <= 4) return [reactionTypes, []];
    return [reactionTypes.slice(0, 3), reactionTypes.slice(3)];
  }, [reactionTypes]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-cardBackground rounded-lg w-full max-w-lg h-[500px] flex flex-col shadow-xl relative">
        <div className="absolute top-4 right-4">
          <CloseIcon
            onClick={setShowLikes}
            className="p-2 text-icon hover:bg-buttonIconHover rounded-full hover:cursor-pointer"
            sx={{
              fontSize: 40,
            }}
          />
        </div>

        <div className="pt-4 pl-6 pr-12 pb-0">
          <h3 className="text-lg font-semibold text-header">Reactions</h3>
          <div className="flex border-b border-cardBorder h-[56px] flex-shrink-0 overflow-x-auto">
            <TabButton
              label="All"
              count={processedReactCounts.all}
              isActive={selectedTab === "all"}
              onClick={handleTabClick("all")}
            />

            {visibleTabs.map((type) => (
              <ReactionTab
                key={type}
                type={type}
                count={processedReactCounts[type] || 0}
                isActive={selectedTab === type}
                onClick={handleTabClick(type)}
              />
            ))}

            {dropdownTabs.length > 0 && (
              <DropdownMenu
                menuItems={dropdownTabs.map((type) => ({
                  text: processedReactCounts[type] || 0,
                  onClick: handleTabClick(type),
                  icon: reactionIcons[type]?.Icon,
                }))}
                position="right-0"
                iconSize="w-6 h-6"
                width="w-48"
                containerClassName="z-50"
                menuClassName="absolute z-50"
              >
                <button
                  className={`p-4 h-full flex items-center gap-1 relative ${
                    selectedTab !== "all" && dropdownTabs.includes(selectedTab)
                      ? "border-b-4 border-listSelected text-listSelected font-semibold text-sm"
                      : "text-textActivity font-semibold text-sm"
                  }`}
                >
                  <span className="text-textActivity font-semibold text-sm">
                    More
                  </span>
                  <ArrowDropDownIcon />
                </button>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-y-auto flex-1 p-2 min-h-[384px]"
        >
          {reactionsData.length > 0 ? (
            <>
              {reactionsData.map((reaction) => {
                const IconComponent = reactionIcons[reaction.type]?.Icon;
                return (
                  <Link
                    to={`/users/${reaction.authorId}`}
                    key={reaction.likeId}
                    className="flex items-center gap-3 hover:bg-buttonIconHover rounded-lg relative p-2 hover:cursor-pointer"
                  >
                    <div className="relative h-14">
                      <Avatar
                        src={reaction.authorPicture}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                        }}
                      />
                      {IconComponent && (
                        <IconComponent
                          className="w-4 h-4 absolute bottom-0 right-0 bg-white rounded-full border border-white"
                          style={{ color: reactionIcons[reaction.type].color }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-authorName">
                        {reaction.authorName}
                      </p>
                      <p className="text-xs truncate text-authorBio">
                        {reaction.authorBio}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* Loading indicator and intersection observer target */}
              <div ref={observerRef} className="py-4 flex justify-center">
                {loading && (
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {loading ? (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                "No reactions found"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Update the TabButton component to capitalize the label if it's not "All"
const TabButton = memo(({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 flex items-center gap-2 relative hover:bg-buttonIconHover hover:transition-all duration-200 ${
      isActive
        ? "border-b-4 border-listSelected text-listSelected"
        : "text-textActivity"
    }`}
  >
    <span className="font-medium text-sm">
      {label === "all" ? "All" : capitalizeFirstLetter(label)}
    </span>
    <span
      className={`font-medium text-sm ${isActive ? "text-listSelected" : "text-textActivity"}`}
    >
      {count}
    </span>
  </button>
));

// Update the ReactionTab component to capitalize the type
const ReactionTab = memo(({ type, count, isActive, onClick }) => {
  const { Icon, color } = reactionIcons[type] || {};
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-2 relative font-medium hover:bg-buttonIconHover hover:transition-all duration-200 ${
        isActive
          ? "border-b-4 border-listSelected text-listSelected"
          : "text-textActivity"
      }`}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span
        className={`text-sm ${isActive ? "text-listSelected" : "text-textActivity"}`}
      >
        {count}
      </span>
    </button>
  );
});

export default ReactionsModal;

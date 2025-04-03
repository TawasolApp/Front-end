import { useState, useEffect, useMemo, useCallback, memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { mockReactionsData } from "./mockReactions";
import reactionIcons from "../../../GenericComponents/reactionIcons";
import DropdownMenu from "../../../GenericComponents/DropdownMenu";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../../../apis/axios";

const ReactionsModal = ({ APIURL, setShowLikes }) => {
  const [reactionsData, setReactionsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");

  const { reactionCounts, reactionTypes } = useMemo(() => {
    const counts = { all: reactionsData.length };
    const types = new Set();

    reactionsData.forEach((reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
      types.add(reaction.type);
    });

    const sortedTypes = Array.from(types).sort((a, b) => counts[b] - counts[a]);
    return { reactionCounts: counts, reactionTypes: sortedTypes };
  }, [reactionsData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setReactionsData(mockReactionsData);
        const response = await axiosInstance.get(APIURL);
        setReactionsData(response.data);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };
    fetchData();
  }, [APIURL]);

  const filteredReactions = useMemo(
    () =>
      selectedTab === "all"
        ? reactionsData
        : reactionsData.filter((r) => r.type === selectedTab),
    [selectedTab, reactionsData],
  );

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
          <div className="flex border-b border-cardBorder h-[56px] flex-shrink-0">
            <TabButton
              label="All"
              count={reactionCounts.all}
              isActive={selectedTab === "all"}
              onClick={handleTabClick("all")}
            />

            {visibleTabs.map((type) => (
              <ReactionTab
                key={type}
                type={type}
                count={reactionCounts[type]}
                isActive={selectedTab === type}
                onClick={handleTabClick(type)}
              />
            ))}

            {dropdownTabs.length > 0 && (
              <DropdownMenu
                menuItems={dropdownTabs.map((type) => ({
                  text: reactionCounts[type],
                  onClick: handleTabClick(type),
                  icon: reactionIcons[type]?.Icon,
                }))}
                position="right-0"
                iconSize="w-6 h-6"
                width="w-48"
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

        <div className="overflow-y-auto flex-1 p-2 min-h-[384px]">
          {filteredReactions.length > 0 ? (
            filteredReactions.map((reaction) => {
              const IconComponent = reactionIcons[reaction.type]?.Icon;
              return (
                <Link
                  to={`/in/${reaction.authorId}`}
                  key={reaction.likeId}
                  className="flex items-center gap-3 hover:bg-buttonIconHover rounded-lg relative p-2 hover:cursor-pointer"
                >
                  <div className="relative h-14">
                    <img
                      src={reaction.authorPicture}
                      alt={reaction.authorName}
                      className="w-14 h-14 rounded-full"
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
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No reactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = memo(({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 flex items-center gap-2 relative hover:bg-buttonIconHover hover:transition-all duration-200 ${
      isActive
        ? "border-b-4 border-listSelected text-listSelected"
        : "text-textActivity"
    }`}
  >
    <span className="font-medium text-sm">{label}</span>
    <span
      className={`font-medium text-sm ${isActive ? "text-listSelected" : "text-textActivity"}`}
    >
      {count}
    </span>
  </button>
));

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

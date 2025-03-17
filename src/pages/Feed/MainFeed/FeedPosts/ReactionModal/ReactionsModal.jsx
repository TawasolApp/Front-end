import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { mockReactionsData } from './mockReactions';
import reactionIcons from '../../../GenericComponents/reactionIcons';
import DropdownMenu from '../../../GenericComponents/DropdownMenu';

const ReactionsModal = ({ apiUrl, setShowLikes }) => {
  const [reactionsData, setReactionsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');

  // Memoized calculations
  const { reactionCounts, reactionTypes } = useMemo(() => {
    const counts = { all: reactionsData.length };
    const types = new Set();
    
    reactionsData.forEach(reaction => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
      types.add(reaction.type);
    });
    
    return { reactionCounts: counts, reactionTypes: Array.from(types) };
  }, [reactionsData]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(apiUrl);
        // const data = await response.json();
        setReactionsData(mockReactionsData);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Filtered reactions
  const filteredReactions = useMemo(() => (
    selectedTab === 'all' 
      ? reactionsData 
      : reactionsData.filter(r => r.type === selectedTab)
  ), [selectedTab, reactionsData]);

  // Tab click handler
  const handleTabClick = useCallback((type) => {
    // Prevent any default behavior
    return (e) => {
      if (e) e.preventDefault();
      setSelectedTab(type);
    };
  }, []);

  // Visible tabs
  const [visibleTabs, dropdownTabs] = useMemo(() => [
    reactionTypes.slice(0, 3),
    reactionTypes.slice(3)
  ], [reactionTypes]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Set fixed height for the modal */}
      <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col shadow-xl">
        {/* Header - fixed height */}
        <div className="flex justify-between items-center p-4 border-b h-[60px] flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Reactions</h3>
          <button 
            onClick={setShowLikes}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Tabs - fixed height */}
        <div className="flex border-b h-[56px] flex-shrink-0">
          <TabButton
            label="All"
            count={reactionCounts.all}
            isActive={selectedTab === 'all'}
            onClick={handleTabClick('all')}
          />
          
          {visibleTabs.map(type => (
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
              menuItems={dropdownTabs.map(type => ({
                text: reactionIcons[type]?.label || type,
                onClick: handleTabClick(type),
                icon: reactionIcons[type]?.Icon
              }))}
              position="right-0"
            >
              <button className="px-4 py-3 flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <span>Click here</span>
              </button>
            </DropdownMenu>
          )}
        </div>

        {/* Reaction List - fills remaining space with min height */}
        <div className="overflow-y-auto flex-1 p-2 min-h-[384px]">
          {filteredReactions.length > 0 ? (
            filteredReactions.map(reaction => {
              const IconComponent = reactionIcons[reaction.type]?.Icon;
              return (
                <div
                  key={reaction.likeId}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src={reaction.authorPicture}
                    alt={reaction.authorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{reaction.authorName}</p>
                    <p className="text-xs text-gray-500 truncate">{reaction.authorBio}</p>
                  </div>
                  {IconComponent && (
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: reactionIcons[reaction.type].color }}
                    />
                  )}
                </div>
              );
            })
          ) : (
            // Empty state to maintain height
            <div className="flex items-center justify-center h-full text-gray-500">
              No reactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoized components
const TabButton = memo(({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 flex items-center gap-2 ${
      isActive ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    <span className="text-sm font-medium">{label}</span>
    <span className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
      {count}
    </span>
  </button>
));

const ReactionTab = memo(({ type, count, isActive, onClick }) => {
  const { Icon, color } = reactionIcons[type] || {};
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-2 ${
        isActive ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      {Icon && <Icon style={{ color }} className="w-5 h-5" />}
      <span className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
        {count}
      </span>
    </button>
  );
});

export default ReactionsModal;
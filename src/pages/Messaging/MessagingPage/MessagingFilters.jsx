import { useState, useRef, useEffect } from "react";

const MessagingFilters = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filters, setFilters] = useState(["All", "Unread", "My Connections", "Starred"]);
  const containerRef = useRef(null);

  const handleFilterClick = (filter) => {
    if (filter === activeFilter) {
      setFilters(["All", "Unread", "My Connections", "Starred"]);
      setActiveFilter("All");
      return;
    }
    
    const newFilters = [
      filter,
      ...filters.filter(f => f !== filter)
    ];
    setFilters(newFilters);
    setActiveFilter(filter);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [filters]);

  return (
    <div className="bg-cardBackground border-b border-cardBorder py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          ref={containerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full border border-itemBorder
                text-sm text-textContent font-medium whitespace-nowrap
                focus:outline-none
                ${
                  activeFilter === filter
                    ? "bg-green-500 hover:bg-green-600 text-cardBackground font-semibold"
                    : "bg-cardBackground text-textActivity hover:bg-cardBackgroundHover"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagingFilters;